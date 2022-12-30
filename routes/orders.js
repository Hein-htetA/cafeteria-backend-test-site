const express = require("express");

const {
  getByRestaurantId,
  getByCustomerId,
  addNewOrder,
  watchNewOrder,
  editSingleOrder,
  watchUpdateOrder,
} = require("../controllers/orders");

const authenticationMiddleware = require("../middleware/authenticationMiddleware");

const router = express.Router();

router
  .route("/")
  .post(authenticationMiddleware, addNewOrder)
  .patch(authenticationMiddleware, editSingleOrder);

//router.route("/:orderId").delete(deleteSingleOrder);
router
  .route("/restaurant/:restaurantId")
  .get(authenticationMiddleware, getByRestaurantId);
router
  .route("/customer/:customerId")
  .get(authenticationMiddleware, getByCustomerId);

router.route("/:restaurantId/newOrder").get(watchNewOrder);
router.route("/:customerId/updateOrder").get(watchUpdateOrder);

module.exports = router;
