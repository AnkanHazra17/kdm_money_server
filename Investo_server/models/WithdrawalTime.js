const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  withdrawalReq: [
    {
      userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      upi: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        required: true,
        default: "Pending",
        enum: ["Pending", "Approved"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Withdraw", withdrawalSchema);
