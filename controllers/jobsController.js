const { json } = require("express");
const Job = require("../models/jobs");
const geoCoder = require("../utils/geocoder");

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

// updating a job => /api/v1/jobs/:id
exports.updateJob = async (req, res, next) => {
  const id = req.params.id;
  let job = await Job.findById(id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "job is updated.",
    data: job,
  });
};

// delete a job => /api/v1/jobs/:id
exports.deleteJob = async (req, res, next) => {
  const id = req.params.id;
  let job = await Job.findById(id);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  job = await Job.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "job is deleted.",
  });
};

//serach jobs with radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //getting latitude and longtide from geocoder with zipcode
  const loc = await geoCoder.geocode(zipcode);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;

  const radius = distance / 3963;

  const jobs = await Job.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
};
