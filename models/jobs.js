const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const slugify = require("slugify");

const jobSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please enter job title."],
    trim: true,
    maxlength: [100, "Job title can not excced 100 characters."],
  },
  slug: String,
  desctiption: {
    type: String,
    required: [true, "Please enter job description."],
    maxlength: [1000, "Job description can not exceed 1000 characters."],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please enter vaild email address."],
  },
  address: {
    type: String,
    required: [true, "Please add an address."],
  },
  company: {
    type: String,
    required: [true, "Please add company name."],
  },
  industry: {
    type: [String],
    required: true,
    enum: {
      values: [
        "Advertising",
        "Computer and technology",
        "Education",
        "Finance",
        "Media and news",
        "Other",
      ],
      message: "Please select correct options for industry.",
    },
  },
  jobType: {
    type: String,
    required: true,
    enum: {
      values: ["Permanent", "Temporary", "Intership"],
      message: "Please select correct options for job type.",
    },
  },
  minEducation: {
    type: String,
    required: true,
    enum: {
      values: ["Bachelors", "Masters", "PhD"],
      message: "Please select correct options  for education.",
    },
  },
  positions: {
    type: Number,
    default: 1,
  },
  experience: {
    type: String,
    required: true,
    enum: {
      values: ["No Experience", "1 - 2 years", "2-5 years", "5+ years"],
      message: "Please select correct option for Experience.",
    },
  },
  salary: {
    type: Number,
    required: [true, "Please eneter expected salary for this job."],
  },
  postingDate: {
    type: Date,
    default: Date.now,
  },
  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7),
  },
  applicantsApplied: {
    type: [Object],
    select: false,
  },
});

//creating job slug
jobSchema.pre("save", function (next) {
  // saving slug to database
  this.slug = slugify(this.title, { lower: true });

  next();
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
