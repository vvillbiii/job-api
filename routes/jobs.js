const express = require("express");
const router = express.Router();

//importing jobs controllers
const { getJobs, newJob } = require("../controllers/jobsController");

router.route("/jobs").get(getJobs);
router.route("/jobs/new").post(newJob);

module.exports = router;
