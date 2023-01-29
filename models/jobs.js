const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const slugify = require("slugify");
const geoCoder = require("../utils/geocoder");

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
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    cooridnates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddrress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  company: {
    type: String,
    required: [true, "Please add company name."],
  },
  industry: {
    type: [String],
    required: [true, "Please enter industry for job."],
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
    required: [true, "Please enter job type."],
    enum: {
      values: ["Permanent", "Temporary", "Intership"],
      message: "Please select correct options for job type.",
    },
  },
  minEducation: {
    type: String,
    required: [true, "Please enter minimum education."],
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
    required: [true, "Please enter experience required."],
    enum: {
      values: ["No Experience", "1 - 2 years", "2-5 years", "5+ years"],
      message: "Please select correct option for Experience.",
    },
  },
  salary: {
    type: Number,
    required: [true, "Please enter expected salary for this job."],
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
    //hiding from user
    select: false,
  },
});

//creating job slug
jobSchema.pre("save", function (next) {
  // saving slug to database
  this.slug = slugify(this.title, { lower: true });

  next();
});

//setting up location
jobSchema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);
  this.location = {
    type: "Point",
    cooridnates: [loc[0].longitude, loc[0].latitude],
    formattedAddrress: loc[0].formattedAddress,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
