const express = require("express");
const app = express();
require("dotenv").config;
const { PORT = 3000 } = process.env;

// Import routers
const jobs = require("../job-api/routes/jobs");

app.use("/api/v1", jobs);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
