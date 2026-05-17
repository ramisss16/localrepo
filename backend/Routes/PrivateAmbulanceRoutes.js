const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploads");
const controller = require("../Controllers/PrivateAmbulanceController");

router.post(
  "/register",
  upload.fields([
    { name: "driverPhoto", maxCount: 1 },
    { name: "driverIdProof", maxCount: 1 },
    { name: "vehicleRegistrationCertificate", maxCount: 1 },
    { name: "vehiclePhoto", maxCount: 1 },
     {name: "driverLicense", maxCount: 1}
  ]),
  controller.registerPrivateAmbulance
);
router.post("/login", controller.loginPrivateAmbulance);

module.exports = router;