const mongoose = require("mongoose");

const paymentRequestIdSchema = new mongoose.Schema({
  payReqId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("PaymentReqId", paymentRequestIdSchema);
