const express = require("express");
const router = express.Router();

const {
  registerRestaurant,
  updateRestaurant,
  getRestaurantById,
  getRestaurantByPage,
} = require("../controllers/restaurants");

router
  .route("/")
  .post(registerRestaurant)
  .patch(updateRestaurant)
  .get(getRestaurantByPage);
router.route("/:restaurantId").get(getRestaurantById);

module.exports = router;
