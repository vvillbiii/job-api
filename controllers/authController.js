const User = require("../models/users");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");

// Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendToken(user, 200, res);
});

//Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //check email and password
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password"), 400);
  }

  //finding user in db
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Please enter email or password"), 401);
  }

  // check if password is correct
  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    return next(new ErrorHandler("Please enter email or password"), 401);
  }

  sendToken(user, 200, res);
});

//forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  //check if user email
  if (!user) {
    return next(new ErrorHandler("No user found with this email.", 404));
  }

  //reset token
  const resetToken = user.getPasswordReset();

  await user.save({ validateBeforeSave: false });
});
