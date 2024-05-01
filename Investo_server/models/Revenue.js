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
  withdrawalTax: {
    type: Number,
    required: true,
  },
  dipositeTax: {
    type: Number,
  },
  inviteBonus: {
    type: Number,
  },
  levelOneBouns: {
    type: Number,
  },
  levelTwoBonus: {
    type: Number,
  },
  levelThreeBonus: {
    type: Number,
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
