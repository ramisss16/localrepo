
const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
  adminId: {
    type: String,
    unique: true
  },

  clinicName: {
    type: String,
    required: true
  },

  clinicEmail: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },

  adminName: {
    type: String,
    
  },

  email: {
    type: String,
    sparse: true,
    unique: true
  },

  password: {
    type: String,
    
  },

  phone: {
    type: String,
    
  },

  address: String,
  city: String,
  state: String,
  pincode: String,

  licenseNumber: String,

  specialization: String,

  // CLOUDINARY FILE URLS
  photo: String,
  licenseDocument: String,
  aadhaarDocument: String,
  panDocument: String,
  clinicLogo: String,
  experienceCertificate: String,

  consultationFee: Number,
  availableSlots: String,

  officialAddress: String,
  officialContact: String,
  officialEmail: String,

  specialistsCount: {
    type: String,
    enum: ["1 Specialist", "More than one Specialist"]
  },

  doctorsCount: String,

  visitMode: {
    type: String,
    enum: ["online", "offline"]
  },

  hasSupportStaff: Boolean,

  isVerified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Clinic", clinicSchema);