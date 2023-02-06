const Job = require("../models/jobs");
const geoCoder = require("../utils/geocoder");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFilter = require("../utils/apiFilter");
const path = require("path");

// Get all jobs => for /api/v1/jobs
exports.getJobs = catchAsyncErrors(async (req, res, next) => {
  const apiFilter = new APIFilter(Job.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .searchByQuery()
    .pagination();

  const jobs = await apiFilter.query;

  res.status(200).json({
    success: true,
    message: "This is the jobs route",
    results: jobs.length,
    data: jobs,
  });
});

// create a new job  => /api/v1/jobs/new
exports.newJob = catchAsyncErrors(async (req, res, next) => {
  // adding user to body
  req.body.user = req.user.id;

  const job = await Job.create(req.body);

  res.status(200).json({
    success: true,
    message: "Job created.",
    data: job,
  });
});

// get a single job with id and slug => /api/v1/jobs/:id/slug
exports.getJob = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const slug = req.params.slug;
  const job = await Job.find({ $and: [{ _id: id }, { slug: slug }] });

  if (!job || job.length === 0) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});
// updating a job => /api/v1/jobs/:id
exports.updateJob = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
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
});

// delete a job => /api/v1/jobs/:id
exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let job = await Job.findById(id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  job = await Job.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "job is deleted.",
  });
});

//serach jobs with radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = catchAsyncErrors(async (req, res, next) => {
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
});

//get stats about a job => /api/v1/stats/:topic
exports.jobStats = catchAsyncErrors(async (req, res, next) => {
  const stats = await Job.aggregate([
    {
      $match: { $text: { $search: '"' + req.params.topic + '"' } },
    },
    {
      $group: {
        _id: { $toUpper: "$experience" },
        totalJobs: { $sum: 1 },
        avgPosition: { $avg: "positions" },
        avgSalary: { $avg: "$salary" },
        minSalary: { $min: "$salary" },
        maxSalary: { $max: "$salary" },
      },
    },
  ]);

  if (stats.length === 0) {
    return next(
      new ErrorHandler(`No stats found for - ${req.params.topic}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: stats,
  });
});

//apply to job using resume => /api/v1/job/:id/apply
exports.applyJobs = catchAsyncErrors(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  // check if job date passed or not
  if (job.lastDate < new Date(Date.now())) {
    return next(
      new ErrorHandler("You can not apply to this job. Date is over.", 400)
    );
  }

  //check files
  if (!req.files) {
    return next(new ErrorHandler("Please upload file.", 400));
  }

  const file = req.files.file;

  //check file type
  const supportedFiles = /.docx|.pdf/;
  if (!supportedFiles.test(path.extname(file.name))) {
    return next(new ErrorHandler("Please upload document file.", 400));
  }

  //check document size
  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(new ErrorHandler("Pplease upload file less than 2MB", 400));
  }

  //renaming resume
  file.name = `${req.user.name.replace(" ", "_")}_${job._id}${
    path.parse(file.name).ext
  }`;

  file.mv(`${process.env.UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler("Resume upload failed.", 500));
    }

    await Job.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          applicantsApplied: {
            id: req.user.id,
            resume: file.name,
          },
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Applied to job successfully.",
      data: file.name,
    });
  });
});
