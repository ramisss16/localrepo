const Attendance = require("../models/Attendance");
const Doctor = require("../models/Doctor");
const Receptionist = require("../models/Receptionist");
const Manager = require("../models/Manager");
const mongoose = require("mongoose");


// ================== MARK SINGLE ATTENDANCE ==================
exports.markAttendance = async (req, res) => {
  try {
    const { clinicId, staffId, staffType, status, time } = req.body;

    if (!clinicId || !staffId || !staffType || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clinicId"
      });
    }

    // 🔥 VALIDATE STAFF BELONGS TO CLINIC
    let staff;

    if (staffType === "doctor") {
      staff = await Doctor.findOne({ doctorId: staffId });
    } else if (staffType === "receptionist") {
      staff = await Receptionist.findOne({ receptionistId: staffId });
    } else if (staffType === "manager") {
      staff = await Manager.findOne({ managerId: staffId });
    }

    if (!staff || staff.clinicId.toString() !== clinicId) {
      return res.status(400).json({
        success: false,
        message: "Invalid staff or staff does not belong to this clinic"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      clinicId,
      staffId,
      date: today
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today"
      });
    }

    const attendance = new Attendance({
      clinicId,
      staffId,
      staffType,
      status,
      time,
      date: today
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ================== BULK ATTENDANCE ==================
exports.markBulkAttendance = async (req, res) => {
  try {
    const { clinicId, date, records } = req.body;

    if (!clinicId || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clinicId"
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // 🔥 DELETE OLD RECORDS
    await Attendance.deleteMany({
      clinicId,
      date: attendanceDate
    });

    const formattedRecords = [];

    for (let r of records) {
      let staff;

      if (r.staffType === "doctor") {
        staff = await Doctor.findOne({ doctorId: r.staffId });
      } else if (r.staffType === "receptionist") {
        staff = await Receptionist.findOne({ receptionistId: r.staffId });
      } else if (r.staffType === "manager") {
        staff = await Manager.findOne({ managerId: r.staffId });
      }

      // ❌ INVALID STAFF OR WRONG CLINIC
      if (!staff || staff.clinicId.toString() !== clinicId) {
        return res.status(400).json({
          success: false,
          message: `Invalid staff or staff does not belong to this clinic: ${r.staffId}`
        });
      }

      formattedRecords.push({
        clinicId,
        staffId: r.staffId,
        staffType: r.staffType,
        status: r.status,
        time: r.time,
        date: attendanceDate
      });
    }

    await Attendance.insertMany(formattedRecords);

    res.status(200).json({
      success: true,
      message: "Attendance saved successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ================== GET ATTENDANCE BY DATE ==================
exports.getAttendanceByDate = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { date } = req.query;

    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clinicId"
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      clinicId,
      date: { $gte: start, $lte: end }
    });

    res.json({
      success: true,
      data: records
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ================== GET MONTHLY ATTENDANCE ==================
exports.getAttendance = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { month, year } = req.query;

    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clinicId"
      });
    }

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required"
      });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const records = await Attendance.find({
      clinicId,
      date: { $gte: startDate, $lte: endDate }
    });

    res.json({
      success: true,
      data: records
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// ================== GET ALL STAFF ==================
exports.getAllStaff = async (req, res) => {
  try {
    const { clinicId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clinicId"
      });
    }

    const doctors = await Doctor.find({ clinicId });
    const managers = await Manager.find({ clinicId });
    const receptionists = await Receptionist.find({ clinicId });

    const staff = [
      ...doctors.map(d => ({
        staffId: d.doctorId,
        name: d.name,
        type: "doctor"
      })),
      ...managers.map(m => ({
        staffId: m.managerId,
        name: m.name,
        type: "manager"
      })),
      ...receptionists.map(r => ({
        staffId: r.receptionistId,
        name: r.name,
        type: "receptionist"
      }))
    ];

    res.json({
      success: true,
      data: staff
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};