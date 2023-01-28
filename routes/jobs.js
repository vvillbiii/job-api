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
} = require("../controllers/jobsController");

router.route("/jobs").get(getJobs);

router.route("/jobs/:id/:slug").get(getJob);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/jobs/new").post(newJob);

router.route("/jobs/:id").put(updateJob).delete(deleteJob);

module.exports = router;
