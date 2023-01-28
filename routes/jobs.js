const express = require("express");
const router = express.Router();

//importing jobs controllers
const {
  getJobs,
  newJob,
  getJobsInRadius,
} = require("../controllers/jobsController");

router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distnace").get(getJobsInRadius);
router.route("/jobs/new").post(newJob);

module.exports = router;
