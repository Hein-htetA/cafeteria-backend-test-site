const express = require("express");
const {
  getAllMenu,
  addNewMenu,
  updateMenu,
  deleteMenu,
} = require("../controllers/menu");

const authenticationMiddleware = require("../middleware/authenticationMiddleware");

const router = express.Router();

router
  .route("/")
  .post(authenticationMiddleware, addNewMenu)
  .patch(authenticationMiddleware, updateMenu);

router.route("/:restaurantId").get(getAllMenu);

router
  .route("/:restaurantId/:menuId")
  .delete(authenticationMiddleware, deleteMenu);

module.exports = router;
