const mongoose = require("mongoose");

const withdrawalReqSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("WithdrawalReq", withdrawalReqSchema);
