const express = require("express");
const app = express();
const dotenv = require("dotenv");

// Setting up config.env
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT} in ${process.env.NODE_ENV}`);
});
