const User = require("../models/users");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const Job = require("../models/jobs");
const fs = require("fs");

//get current user profile => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "jobsPublished",
    select: "title postingDate",
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//update current user Password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //check previous user password
  const isMatched = await user.comparePassword(req.body.currentPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old Password is incorrect.", 401));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//update current user data => /api/v1/me/update
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//delete current user => /api/v1/me/delete
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  deleteUserData(req.user.id, req.user.role);

  const user = await User.findByIdAndDelete(req.user.id);

  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Your account has been deleted.",
  });
});

//delete user data
async function deleteUserData(user, role) {
  if (role === "employer") {
    await Job.deleteMany({ user: user });
  }

  if (role === "user") {
    const appliedJobs = await Job.find({ "applicantsApplied.id": user }).select(
      "+applicantsApplied"
    );

    for (let i = 0; i < appliedJobs.length; i++) {
      let obj = appliedJobs[i].applicantsApplied.find((o) => o.id === user);

      let filepath = `${__dirname}/public/uploads/${obj.resume}`.replace(
        "\\controllers",
        ""
      );

      fs.unlink(filepath, (err) => {
        if (err) return console.log(err);
      });

      appliedJobs[i].applicantsApplied.splice(
        appliedJobs[i].applicantsApplied.indexOf(obj.id)
      );

      appliedJobs[i].save();
    }
  }
}
