const express = require("express");

const {
  getByRestaurantId,
  addNewOrder,
  watchNewOrder,
  editSingleOrder,
  deleteSingleOrder,
} = require("../controllers/orders");

const router = express.Router();

router.route("/").post(addNewOrder).patch(editSingleOrder);

//router.route("/:orderId").delete(deleteSingleOrder);
router.route("/:restaurantId").get(getByRestaurantId);
router.route("/:restaurantId/newOrder").get(watchNewOrder);

module.exports = router;
