const express = require("express");
const router = express.Router();

const {
  createPrescription,
  getPatientPrescriptions,
  getPrescriptionByAppointment
} = require("../controllers/prescriptionController");

router.post("/", createPrescription);

router.get("/patient/:patientId", getPatientPrescriptions);

router.get("/appointment/:appointmentId", getPrescriptionByAppointment);

module.exports = router;