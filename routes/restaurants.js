const express = require("express");
const router = express.Router();

const {
  registerRestaurant,
  updateRestaurant,
  getRestaurantById,
  getRestaurantByPage,
} = require("../controllers/restaurants");

const authenticationMiddleware = require("../middleware/authenticationMiddleware");

router
  .route("/")
  .post(authenticationMiddleware, registerRestaurant)
  .patch(authenticationMiddleware, updateRestaurant)
  .get(getRestaurantByPage);
router.route("/:restaurantId").get(getRestaurantById);

module.exports = router;
