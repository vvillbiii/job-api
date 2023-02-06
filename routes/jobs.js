const express = require("express");
const router = express.Router();

//importing jobs controllers
const {
  getJobs,
  getJob,
  newJob,
  getJobsInRadius,
  updateJob,
  deleteJob,
  jobStats,
  applyJobs,
} = require("../controllers/jobsController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/jobs").get(getJobs);

router.route("/jobs/:id/:slug").get(getJob);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router
  .route("/jobs/new")
  .post(isAuthenticatedUser, authorizeRoles("employer", "admin"), newJob);
router.route("/stats/:topic").get(jobStats);

router
  .route("/jobs/:id/apply")
  .put(isAuthenticatedUser, authorizeRoles("user"), applyJobs);

router
  .route("/jobs/:id")
  .put(isAuthenticatedUser, authorizeRoles("employer", "admin"), updateJob)
  .delete(isAuthenticatedUser, authorizeRoles("employer", "admin"), deleteJob);

module.exports = router;
