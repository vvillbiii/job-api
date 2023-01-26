const express = require("express");
const router = express.Router();

router.get("/jobs", (req, res) => {
  res.status(200).json({
    success: true,
    message: "This is the jobs route",
  });
});

module.exports = router;
