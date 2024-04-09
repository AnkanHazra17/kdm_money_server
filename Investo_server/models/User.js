const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      required: true,
      default: "Public",
      enum: ["Admin", "Public"],
    },
    levelOneCommision: {
      type: Boolean,
      default: false,
    },
    levelTwoCommision: {
      type: Boolean,
      default: false,
    },
    levelThreeCommition: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    withrawalAmount: {
      type: Number,
    },
    isGetWeekySalary: {
      type: Boolean,
      default: false,
    },
    membersAdded: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        dateAdded: {
          type: Date,
          default: Date.now(),
          expires: 604800,
        },
      },
    ],
    levelOneChield: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    allChield: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    brokerLevel: {
      type: String,
      default: "none",
      enum: ["none", "vip_1", "vip_2", "vip_3", "vip_4", "vip_5", "vip_6"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
