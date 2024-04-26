const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

// Sign Up Controller
exports.signUp = async (req, res) => {
  try {
    // Data fetch
    const { userName, email, password, confirmPassword, accountType } =
      req.body;

    // Validate data
    if (!userName || !email || !password || !confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Match password and confrimation password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confrom Password value does not match",
      });
    }

    // Check User already present or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User alresdy registered",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Entry create in db
    const user = await User.create({
      userName,
      email,
      accountType,
      password: hashedPassword,
      withrawalAmount: 0,
    });

    return res.status(200).json({
      success: true,
      message: "User is registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again",
    });
  }
};

// Log in Controller
exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exists",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      user.token = token;
      user.password = undefined;

      // Create cookie
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User loggedin successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Login failure, please try again later",
    });
  }
};

// Call Or put action
exports.takeAction = async (req, res) => {
  try {
    const { name, action } = req.body;
    const userId = req.user.id;
    if (!name || !action) {
      return res.status(400).json({
        success: false,
        message: "Please Provide required data",
      });
    }
    const currentCall = await Product.find().sort({ createdAt: -1 }).limit(1);

    if (!currentCall) {
      return res.status(404).json({
        success: false,
        message: "Current Call Not Found",
      });
    }

    if (currentCall[0].usersCalled.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already take action",
      });
    }

    if (currentCall[0].name === name && currentCall[0].action === action) {
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }

      currentCall[0].usersCalled.push(userId);
      await currentCall[0].save();

      const increase = (user.withrawalAmount * 6) / 100;
      const total = user.withrawalAmount + increase;

      user.withrawalAmount = total;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Amount Added to your account",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Product Does not match",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Occured While Taking Action",
    });
  }
};
