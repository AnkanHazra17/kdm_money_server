const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Admin",
  },
  totalRevenue: {
    type: Number,
  },
  dailyRevenue: [
    {
      amount: {
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

module.exports = mongoose.model("Revenue", revenueSchema);
