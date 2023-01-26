const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

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
});
