const Job = require("../models/jobs");

// Get all jobs => for /api/v1/jobs
exports.getJobs = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "This is the jobs route",
  });
};

// create a new jb  => /api/v1/jobs/new
exports.newJob = async (req, res, next) => {
  const job = await Job.create(req.body);

  res.status(200).json({
    success: true,
    message: "Job created.",
    data: job,
  });
};
