// Get all jobs => for /api/v1/jobs
exports.getJobs = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "This is the jobs route",
  });
};
