const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updatePassword,
  updateUser,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateUser);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);
