const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true
  },

  staffId: {
    type: String,   // DOC / MGN / REC ID
    required: true
  },

  staffType: {
    type: String,
    enum: ["doctor", "manager", "receptionist"],
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["present", "absent", "leave"],
    required: true
  },

  time: {
    type: String   // optional (check-in time)
  }

}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);