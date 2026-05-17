const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  dateOfBirth: {
    type: Date
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },

  address: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);