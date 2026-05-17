const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true
  },

  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  doctorId: {
    type: String,
    ref: "Doctor",
    required: true
  },

  appointmentDate: {
    type: Date,
    default: Date.now
  },

  tokenNumber: Number,

  status: {
    type: String,
    enum: ["waiting", "completed"],
    default: "waiting"
  }

}, { timestamps: true });



module.exports = mongoose.model("Appointment", appointmentSchema); 

