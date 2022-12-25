const mongoose = require("mongoose");

const singleOrderSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: [true, "Food name must be provided"],
  },

  foodCount: {
    type: Number,
    required: [true, "Food count must be provided"],
  },
});

const additionalInfoSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  },
});

const paymentMethodSchema = new mongoose.Schema({
  value: {
    type: String,
    enum: {
      values: ["Cash", "KBZPay", "WavePay"],
      message: "{VALUE} is not supported",
    },
  },
  additionalInfo: additionalInfoSchema,
});

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.ObjectId,
      required: [true, "Restaurant id must be provided"],
    },

    menuId: {
      type: mongoose.ObjectId,
      required: [true, "Menu id must be provided"],
    },

    order: [singleOrderSchema],

    message: String,

    customerId: {
      type: mongoose.ObjectId,
      required: [true, "Customer id must be provided"],
    },

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

    paymentMethod: paymentMethodSchema,
    expireAt: {
      type: Date,
      expires: 1100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
