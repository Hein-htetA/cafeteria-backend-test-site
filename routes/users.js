const express = require("express");
const { getUserByRestaurantId, updateUser } = require("../controllers/users");
const router = express.Router();

router.route("/").patch(updateUser);
router.route("/:restaurantId").get(getUserByRestaurantId);

module.exports = router;
