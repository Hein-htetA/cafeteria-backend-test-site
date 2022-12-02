const mongoose = require("mongoose");

const singleOrderSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, "Food name must be provided"],
    lowercase: true,
  },

  foodCount: {
    type: Number,
    required: [true, "Food count must be provided"],
  },
});

const orderSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: [true, "Restaurant name must be provided"],
      trim: true,
    },
    order: [singleOrderSchema],
    message: String,

    customerName: {
      type: String,
      required: [true, "Customer name must be provided"],
    },
    address: {
      type: String,
      required: [true, "Address must be provided"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number must be provided"],
    },
    status: {
      type: String,
      enum: {
        values: ["accepted", "received", "onDelivery"],
        message: "{VALUE} is not supported",
      },
      default: "received",
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    orderState: {
      type: String,
      enum: {
        values: ["newOrder", "order", "recycleBin", "history", "onDelivery"],
        message: "{VALUE} is not supported",
      },
      default: "newOrder",
    },
    paymentMethod: {
      method: {
        type: String,
        required: [true, "Payment method is required"],
      },
      additionalInfo: {
        type: String,
      },
    },
    expireAt: {
      type: Date,
      expires: 1100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
