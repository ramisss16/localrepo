const mongoose = require("mongoose");

const hospitalAmbulanceSchema = new mongoose.Schema(
  {
    hospitalAmbulanceId: {
      type: String,
      unique: true
    },

    hospitalName: {
      type: String,
      required: true,
      trim: true
    },

    driverName: {
      type: String,
      required: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/
    },

    otpVerified: {
      type: Boolean,
      default: false
    },

    hospitalAddress: {
      type: String,
      required: true
    },

    driverPhoto: {
      type: String
    },

    driverLicense: {
      type: String
    },

    driverIdProof: {
      type: String
    },

    ambulanceType: {
      type: String,
      enum: ["Basic", "ICU", "Oxygen"],
      required: true
    },

    vehicleNumber: {
      type: String,
      required: true,
      unique: true
    },

    vehicleRegistrationLicenseNumber: {
      type: String,
      required: true
    },

    vehicleRegistrationCertificate: {
      type: String
    },

    vehiclePhoto: {
      type: String
    },

    password: {
      type: String,
      required: true
    },

    availability: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "HospitalAmbulance",
  hospitalAmbulanceSchema
);