const express = require("express");
const router = express.Router();

const {
  registerRestaurant,
  updateRestaurant,
  getRestaurantById,
  getRestaurantByPage,
  getRestaurantByName,
  saveSubscriptionToRestaurant,
} = require("../controllers/restaurants");

const authenticationMiddleware = require("../middleware/authenticationMiddleware");

router
  .route("/")
  .post(authenticationMiddleware, registerRestaurant)
  .patch(authenticationMiddleware, updateRestaurant)
  .get(getRestaurantByPage);
router.route("/save-subscription").patch(saveSubscriptionToRestaurant);
router.route("/search").get(getRestaurantByName);
router.route("/:restaurantId").get(getRestaurantById);

module.exports = router;
