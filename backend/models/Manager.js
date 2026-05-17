const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  managerId: {
    type: String,
    unique: true
  },

  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  // CLOUDINARY FILE URLS
  photo: String,
  aadhaarDocument: String,
  panDocument: String,
  experienceCertificate: String

}, { timestamps: true });

module.exports = mongoose.model("Manager", managerSchema);