const express = require("express");
const { getUser, updateUser, registerUser } = require("../controllers/users");
const router = express.Router();

router.route("/").get(getUser).post(registerUser).patch(updateUser);

module.exports = router;
