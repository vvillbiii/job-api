const User = require("../models/users");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Register a new user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // creating jwt token
  const token = user.getJwtToken();

  res.status(200).json({
    success: true,
    message: "User is registered",
    token,
  });
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

  // create web token
  const token = user.getJwtToken();

  res.status(200).json({
    success: false,
    token,
  });
});
