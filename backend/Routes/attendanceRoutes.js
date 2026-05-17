const express = require("express");
const router = express.Router();

const {
  markAttendance,
  markBulkAttendance,
  getAttendance,
  getAttendanceByDate
} = require("../controllers/attendanceController");


// 🔹 Single attendance
router.post("/mark", markAttendance);

// 🔥 Bulk attendance (main UI)
router.post("/bulk", markBulkAttendance);

// 🔹 Get attendance for a specific day
router.get("/day/:clinicId", getAttendanceByDate);

// 🔹 Monthly attendance
router.get("/:clinicId", getAttendance);

module.exports = router;