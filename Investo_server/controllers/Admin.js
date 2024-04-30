const User = require("../models/User");
const Revenue = require("../models/Revenue");
const Product = require("../models/Product");
const Withdraw = require("../models/WithdrawalTime");

exports.allUsersFulldata = async (req, res) => {
  try {
    const users = await User.find({
      accountType: { $ne: "Admin" },
    })
      .select("-password")
      .populate("parent", "firstName lastName email");

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "Users Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All users data fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while fethcing all users data",
    });
  }
};

exports.getRevenueDetails = async (req, res) => {
  try {
    const revenue = await Revenue.findOne({ name: "Admin" });
    if (!revenue) {
      return res.status(404).json({
        success: false,
        message: "Revenue details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Revenue details found",
      revenue,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while fetching revenue details",
    });
  }
};

exports.createRevenue = async (req, res) => {
  try {
    const { total } = req.body;
    const revenue = await Revenue.create({
      totalRevenue: total,
    });

    return res.status(200).json({
      success: true,
      message: "Revenue initialized",
      revenue,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while initializing revenue",
    });
  }
};

exports.createProducts = async (req, res) => {
  try {
    const { name, price, change } = req.body;

    if (!name || !price || !change) {
      return res.status(400).json({
        success: false,
        message: "Please Provide Required Data",
      });
    }

    const product = await Product.create({
      name: name,
      price: price,
      change: change,
    });
    return res.status(200).json({
      success: true,
      message: "Product Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured While Creating Product",
    });
  }
};

exports.createCall = async (req, res) => {
  try {
    const { productId, call } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }
    product.call = call;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Call Created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured while creating call",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Please Provide required data",
      });
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured While deleting Product",
    });
  }
};

exports.setWithdrawalTime = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingTime = await Withdraw.findOne({
      startTime: startTime,
      endTime: endTime,
    });

    if (existingTime) {
      return res.status(400).json({
        success: false,
        message: "Time Already Sated",
      });
    }

    const timeSeted = await Withdraw.create({ startTime, endTime });
    return res.status(200).json({
      success: true,
      message: "Withdrawal Time Set",
      timeSeted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured While Setting Withdrawal time",
    });
  }
};

exports.setWithdralAmount = async (req, res) => {
  try {
    const { minAmount, maxAmount, tax } = req.body;
    if (!minAmount || !maxAmount || !tax) {
      return res.status(400).json({
        success: false,
        message: "Please provide required data",
      });
    }

    const revenue = await Revenue.findOne({ name: "Admin" });
    if (!revenue) {
      return res.status(404).json({
        success: false,
        message: "Revenue Not Found",
      });
    }

    revenue.minAmount = minAmount;
    revenue.maxAmount = maxAmount;
    revenue.tax = tax;
    await revenue.save();

    return res.status(200).json({
      success: true,
      message: "Withdrawal Amount Set Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured While Updating withrawal amount",
    });
  }
};

exports.getWithdrawalRequests = async (req, res) => {
  try {
    const allReq = await Withdraw.find();
    if (!allReq) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal req not found",
      });
    }

    const allWithdrawal = allReq.map((withdraw) => withdraw.withdrawalReq);
    const withdrawalData = allWithdrawal.filter((arr) => arr.length > 0).flat();

    return res.status(200).json({
      success: true,
      message: "All Withdrawal Requests Found",
      withdrawalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured While Getting All Withdrawal Requests",
    });
  }
};

exports.approveWithdrawalRequest = async (req, res) => {
  try {
    const { requsetId } = req.body;
  } catch (error) {}
};
