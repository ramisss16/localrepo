const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getDoctorAppointments,
  getClinicAppointments
} = require("../controllers/appointmentController");

// ✅ Book appointment
router.post("/", createAppointment);

// ✅ Doctor appointments
router.get("/doctor/:doctorId", getDoctorAppointments);

// ✅ Clinic appointments
router.get("/clinic/:clinicId", getClinicAppointments);

module.exports = router;