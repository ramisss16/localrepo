const express = require("express");
const router = express.Router();

const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getDoctorPatients,
} = require("../controllers/patientController");

router.post("/", createPatient);
router.get("/", getPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);
router.get("/doctor/:doctorId", getDoctorPatients);

module.exports = router;