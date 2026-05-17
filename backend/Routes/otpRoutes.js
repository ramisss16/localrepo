const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
} = require("../Controllers/otpController");

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

module.exports = router;