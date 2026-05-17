const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const mongoose = require("mongoose");

exports.createAppointment = async (req, res) => {
  try {
    const { clinicId, patientId, doctorId } = req.body;

    if (!clinicId || !patientId || !doctorId) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // ✅ validate clinicId
    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({
        message: "Invalid clinicId"
      });
    }

    // ✅ check doctor belongs to clinic
    const doctor = await Doctor.findOne({ doctorId });

    if (!doctor || doctor.clinicId.toString() !== clinicId) {
      return res.status(400).json({
        message: "Doctor does not belong to this clinic"
      });
    }

    // ✅ get today's start
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔥 NEW LOGIC: doctor cannot be in 2 clinics same day
    const existingClinicBooking = await Appointment.findOne({
  doctorId,
  clinicId: { $ne: clinicId }, // 🔥 different clinic
  appointmentDate: { $gte: today }
});

if (existingClinicBooking) {
  return res.status(400).json({
    message: "Doctor already assigned to another clinic today"
  });
}
    if (existingClinicBooking) {
      return res.status(400).json({
        message: "Doctor already assigned to another clinic today"
      });
    }

    // ✅ token logic (per doctor per day)
    const count = await Appointment.countDocuments({
      doctorId,
      appointmentDate: { $gte: today }
    });

    const appointment = new Appointment({
      clinicId,
      patientId,
      doctorId,
      tokenNumber: count + 1,
      appointmentDate: new Date()
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Doctor Appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: today }
    })
      .populate("patientId", "firstName lastName phone dateOfBirth gender")
      .sort({ tokenNumber: 1 });

    res.status(200).json(appointments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Get Clinic Appointments
exports.getClinicAppointments = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
          clinicId,
          appointmentDate: { $gte: start }
        })
          .populate("patientId", "firstName lastName phone")
          .sort({ tokenNumber: 1 });

    res.json({
      success: true,
      data: appointments
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};