const express = require("express");

const {
  getByRestaurantId,
  getByCustomerId,
  addNewOrder,
  watchNewOrder,
  editSingleOrder,
  watchUpdateOrder,
} = require("../controllers/orders");

const router = express.Router();

router.route("/").post(addNewOrder).patch(editSingleOrder);

//router.route("/:orderId").delete(deleteSingleOrder);
router.route("/restaurant/:restaurantId").get(getByRestaurantId);
router.route("/customer/:customerId").get(getByCustomerId);
router.route("/:restaurantId/newOrder").get(watchNewOrder);
router.route("/:customerId/updateOrder").get(watchUpdateOrder);

module.exports = router;
