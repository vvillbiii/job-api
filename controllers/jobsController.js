const Job = require("../models/jobs");

// Get all jobs => for /api/v1/jobs
exports.getJobs = async (req, res, next) => {
  const jobs = await Job.find();

  res.status(200).json({
    success: true,
    message: "This is the jobs route",
    results: jobs.length,
    data: jobs,
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
