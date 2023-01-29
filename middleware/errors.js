const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    error.message = err.message;

    //Wrong mongoose object id error
    if (err.name === "CastError") {
      const message = `Resource not found. Invaild; ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    //mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 404);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error.",
    });
  }

  err.message = err.message || "Internal Server Error.";

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
