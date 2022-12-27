const mongoose = require("mongoose");

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
  checked: {
    type: Boolean,
    default: false,
  },
  additionalInfo: additionalInfoSchema,
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Restaurant Name is required"],
  },
  firstPhone: {
    type: String,
    required: [true, "First Phone Number is required"],
  },
  secondPhone: {
    type: String,
  },
  address: {
    type: String,
  },
  establishedIn: String,
  deliveryService: {
    type: Boolean,
    default: false,
  },
  paymentMethods: [paymentMethodSchema],
  priority: {
    type: Number,
    default: 1,
  },
  ownerId: {
    type: mongoose.ObjectId,
    required: [true, "Owner Id is required"],
  },
  restaurantPhotoUrl: String,
  restaurantPhotoId: String,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
