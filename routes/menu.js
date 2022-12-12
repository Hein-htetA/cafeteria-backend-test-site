const express = require("express");
const {
  getAllMenu,
  addNewMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu");

const router = express.Router();

router
  .route("/:restaurantName")
  .get(getAllMenu)
  .post(addNewMenu)
  .patch(updateMenu);

router.route("/:restaurantName/:menuId").delete(deleteMenu);

module.exports = router;
