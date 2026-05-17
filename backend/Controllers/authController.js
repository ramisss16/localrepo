const Clinic = require("../models/Clinic");
const Doctor = require("../models/Doctor");
const OnlineDoctor = require("../models/OnlineDoctor");
const Receptionist = require("../models/Receptionist");
const Manager = require("../models/Manager");

exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: "User ID and password are required",
      });
    }

    let user = null;
    let role = "";

    if (userId.startsWith("ADM")) {
      user = await Clinic.findOne({ adminId: userId });
      role = "admin";
    } else if (userId.startsWith("DOC") || userId.startsWith("ODC")) {
      user =
        (await OnlineDoctor.findOne({ doctorId: userId })) ||
        (await Doctor.findOne({ doctorId: userId }));
      role = "doctor";
    } else if (userId.startsWith("REC")) {
      user = await Receptionist.findOne({ receptionistId: userId });
      role = "receptionist";
    } else if (userId.startsWith("MGN")) {
      user = await Manager.findOne({ managerId: userId });
      role = "manager";
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      role,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};