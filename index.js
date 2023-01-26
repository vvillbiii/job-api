const express = require("express");
const app = express();
dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;

//DB CONNECTION
const dbConnection = require("../job-api/config/database");

// Import routers
const jobs = require("../job-api/routes/jobs");

app.use("/api/v1", jobs);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}, on ${process.env.NODE_ENV}`);
});
