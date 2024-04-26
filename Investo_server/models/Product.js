const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  action: {
    type: String,
    required: true,
    enum: ["Call", "Put"],
  },
  usersCalled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 24 * 60 * 60,
  },
});

module.exports = mongoose.model("Product", productSchema);
