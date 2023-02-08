const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
  getAppliedJobs,
  getPublishedJobs,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router
  .route("/jobs/applied")
  .get(isAuthenticatedUser, authorizeRoles("user"), getAppliedJobs);

router
  .route("/jobs/published")
  .get(
    isAuthenticatedUser,
    authorizeRoles("employer", "admin"),
    getPublishedJobs
  );

router.route("/me/update").put(isAuthenticatedUser, updateUser);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/delete").put(isAuthenticatedUser, deleteUser);
