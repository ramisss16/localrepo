const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },

 appointmentId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Appointment",
  required: true
},

  diagnosis: {
    type: String,
    required: true
  },

  medicines: [
    {
      name: {
        type: String,
        required: true
      },
      dosage: {
        type: String,
        required: true
      },
      timing: {
        type: String,
        required: true
      }
    }
  ],

  notes: String

}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);