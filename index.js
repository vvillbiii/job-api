const express = require("express");
const app = express();
dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;

//DB CONNECTION
const dbConnection = require("./config/database");
const errorMiddleware = require("./middleware/errors");

// setup body parser
app.use(express.json());

// Import routers
const jobs = require("./routes/jobs");

app.use("/api/v1", jobs);

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
