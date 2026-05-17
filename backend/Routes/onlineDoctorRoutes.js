const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");

const {
  registerOnlineDoctor,
  loginOnlineDoctor,
} = require("../controllers/onlineDoctorController");

router.post(
  "/register",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaarDocument", maxCount: 1 },
    { name: "panDocument", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 1 },
    { name: "licenseCertificate", maxCount: 1 },
  ]),
  registerOnlineDoctor
);

router.post("/login", loginOnlineDoctor);

module.exports = router;