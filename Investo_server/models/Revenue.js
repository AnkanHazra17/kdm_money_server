const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Admin",
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maxAmount: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
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
