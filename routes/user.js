const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateUser);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/delete").put(isAuthenticatedUser, deleteUser);
