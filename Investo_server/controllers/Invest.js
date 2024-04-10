const { instance } = require("../config/rezorpay");
const crypto = require("crypto");
const User = require("../models/User");
const Revenue = require("../models/Revenue");
const { mailSender } = require("../utils/mailSender");
const { withrawalEmail } = require("../mail-temp/withrawalMail");

const afterPaymentActions = async (product, userId, res) => {
  try {
    if (!product || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Required data",
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.products.push(product);

    // Update Users Parent
    const usersParentId = user?.parent;
    const usersParent = await User.findById(usersParentId).select("-password");
    if (usersParent) {
      if (!usersParent.levelOneCommision) {
        const one_money = product?.price * (10 / 100);
        usersParent.withrawalAmount += one_money;
        usersParent.levelOneCommision = true;
        await usersParent.save();
      }

      const levelTwoParentId = usersParent?.parent;
      const levelTwoParent = await User.findById(levelTwoParentId).select(
        "-password"
      );
      if (levelTwoParent) {
        if (!levelTwoParent.levelTwoCommision) {
          const two_money = product?.price * (4 / 100);
          levelTwoParent.withrawalAmount += two_money;
          levelTwoParent.levelTwoCommision = true;
          await levelTwoParent.save();
        }

        const levelThreeParentId = levelTwoParent?.parent;
        const levelthreeParent = await User.findById(levelThreeParentId).select(
          "-password"
        );
        if (levelthreeParent) {
          if (!levelthreeParent.levelThreeCommition) {
            const three_money = product?.price * (2 / 100);
            levelthreeParent.withrawalAmount += three_money;
            levelthreeParent.levelThreeCommition = true;
            await levelthreeParent.save();
          }
        }
      }
    }

    const revenue = await Revenue.findOne({ name: "Admin" });
    if (!revenue) {
      return res.status(404).json({
        success: false,
        message: "Revenue Not found",
      });
    }

    revenue.totalRevenue += product?.price;
    revenue.dailyRevenue.push({ amount: product?.price });
    await revenue.save();
  } catch (error) {}
};

exports.capterPayment = async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Product",
      });
    }

    const amount = product?.price;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };

    // Initiate the payment using razorpay
    try {
      const paymentResponse = await instance.orders.create(options);

      res.json({
        success: true,
        data: paymentResponse,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Could Not Initiate the order",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server error while creating order",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const product = req.body?.product;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    product ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment Failed: All fields are required",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // After Payment actions
    afterPaymentActions(product, userId, res);

    return res.status(200).json({
      success: true,
      message: "Payment verified",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Payment Failed",
  });
};

exports.withrawalRequest = async (req, res) => {
  try {
    const { upi, amount } = req.body;
    const userId = req.user.id;

    if (!upi || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Required Data",
      });
    }

    const admin = await User.findOne({ accountType: "Admin" }).select(
      "-password"
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (amount > user.withrawalAmount) {
      return res.status(400).json({
        success: false,
        message: "Your total savings is less than your requested amount",
      });
    }

    if (amount) {
      user.withrawalAmount -= amount;
      await user.save();
    }

    const mailRes = await mailSender(
      admin.email,
      "Withrawal Request",
      withrawalEmail(
        user.firstName,
        user.lastName,
        user.email,
        user.withrawalAmount,
        upi,
        amount
      )
    );

    if (!mailRes) {
      return res.status(400).json({
        success: false,
        message: "Withrawal Request failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Withrawal request sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went while withrawaling money",
    });
  }
};
