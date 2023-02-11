const express = require("express");
const app = express();
dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const errorHandler = require("./utils/errorHandler");
const cookieParse = require("cookie-parser");

const fileupload = require("express-fileupload");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

//DB CONNECTION
const dbConnection = require("./config/database");
const errorMiddleware = require("./middleware/errors");

//handling uncaught expection
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to uncaught expection.");
  process.exit(1);
});

// setup body parser
app.use(express.json());

//setup cookie parser
app.use(cookieParse);

//setup file uploads
app.use(fileupload());

//setup security headers
app.use(helmet());

// rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// Import routers
const jobs = require("./routes/jobs");
const auth = require("./routes/auth");
const user = require("./routes/user");

app.use("/api/v1", jobs);
app.use("/api/v1", auth);
app.use("/api/v1", user);

// handle unhandled routes
app.all("*", (req, res, next) => {
  next(new errorHandler(`${req.originalUrl} route not found`, 404));
});

// error middleware
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}, on ${process.env.NODE_ENV}`);
});

// handling unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
