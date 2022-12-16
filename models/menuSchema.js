const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  menuPhotoUrl: String,
  menuPhotoId: String,
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ["curry", "sideDish", "drink", "signatureDish", "additional"],
      message: "{VALUE} is not supported in category",
    },
  },
  restaurantId: {
    type: mongoose.ObjectId,
    required: [true, "Restaurant Name is required"],
  },
  description: String,
});

module.exports = mongoose.model("Menu", menuSchema);
