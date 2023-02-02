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
} = require("../controllers/jobsController");

const isAuthenticatedUser = require("../middleware/auth");

router.route("/jobs").get(getJobs);

router.route("/jobs/:id/:slug").get(getJob);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/jobs/new").post(isAuthenticatedUser, newJob);
router.route("/stats/:topic").get(jobStats);

router
  .route("/jobs/:id")
  .put(isAuthenticatedUser, updateJob)
  .delete(isAuthenticatedUser, deleteJob);

module.exports = router;
