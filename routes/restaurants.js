const express = require("express");
const router = express.Router();

const {
  registerRestaurant,
  updateRestaurant,
  getRestaurant,
} = require("../controllers/restaurants");

router.route("/").post(registerRestaurant).patch(updateRestaurant);
router.route("/:restaurantId").get(getRestaurant);

module.exports = router;
