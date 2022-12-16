const express = require("express");
const {
  getAllMenu,
  addNewMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu");

const router = express.Router();

router.route("/").post(addNewMenu).patch(updateMenu);

router.route("/:restaurantId").get(getAllMenu);

router.route("/:restaurantId/:menuId").delete(deleteMenu);

module.exports = router;
