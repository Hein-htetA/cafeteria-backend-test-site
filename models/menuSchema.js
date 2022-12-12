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
  imageUrl: String,
  imageId: String,
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ["curry", "sideDish", "drink", "signatureDish", "additional"],
      message: "{VALUE} is not supported in category",
    },
  },
  restaurantName: {
    type: String,
    required: [true, "Restaurant Name is required"],
  },
  description: String,
  image: String,
});

module.exports = mongoose.model("Menu", menuSchema);
