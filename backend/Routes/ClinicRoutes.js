const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");

const {
  signupClinic,
  registerDoctor,
  registerReceptionist,
  registerManager,
  loginClinicUser,
  getAllDoctors,
  getAllStaff,
  updateClinic,
  
} = require("../controllers/clinicController");


// CLINIC REGISTER
router.post(
  "/clinic/register",
  upload.fields([
    { name: "licenseDocument", maxCount: 1 },
    { name: "aadhaarDocument", maxCount: 1 },
    { name: "panDocument", maxCount: 1 },
    { name: "clinicLogo", maxCount: 1 }
  ]),
  signupClinic
);

// update clinic
router.put(
  "/clinic/update/:clinicId",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
    {
      name:
        "licenseDocument",
      maxCount: 1,
    },
    {
      name:
        "aadhaarDocument",
      maxCount: 1,
    },
    {
      name:
        "panDocument",
      maxCount: 1,
    },
    {
      name:
        "clinicLogo",
      maxCount: 1,
    },
    {
      name:
        "experienceCertificate",
      maxCount: 1,
    },
  ]),
  updateClinic
);

// DOCTOR REGISTER
router.post(
  "/doctor/register",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaarDocument", maxCount: 1 },
    { name: "panDocument", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 1 },
    { name: "qualificationCertificate", maxCount: 1 }
  ]),
  registerDoctor
);




// MANAGER REGISTER
router.post(
  "/manager/register",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaarDocument", maxCount: 1 },
    { name: "panDocument", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 1 }
  ]),
  registerManager
);


// RECEPTIONIST REGISTER
router.post(
  "/receptionist/register",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaarDocument", maxCount: 1 },
    { name: "panDocument", maxCount: 1 },
    { name: "experienceCertificate", maxCount: 1 }
  ]),
  registerReceptionist
);


// LOGIN
router.post("/auth/login", loginClinicUser);


// GET DATA
router.get("/doctor/:clinicId", getAllDoctors);
router.get("/staff/:clinicId", getAllStaff);

module.exports = router;