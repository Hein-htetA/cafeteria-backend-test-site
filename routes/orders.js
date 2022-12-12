const express = require("express");

const {
  getByRestaurantName,
  addNewOrder,
  watchNewOrder,
  editSingleOrder,
  deleteSingleOrder,
} = require("../controllers/orders");

const router = express.Router();

router.route("/").post(addNewOrder).patch(editSingleOrder);

router.route("/:orderId").delete(deleteSingleOrder);
router.route("/:restaurant").get(getByRestaurantName);
router.route("/:restaurant/newOrder").get(watchNewOrder);

module.exports = router;
