const User = require("../models/User");
const Revenue = require("../models/Revenue");

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
