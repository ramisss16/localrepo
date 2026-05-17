const HospitalAmbulance = require("../models/HospitalAmbulance");
const bcrypt = require("bcryptjs");
const generateUniqueId = require("../utils/generateUniqueId");
const jwt = require("jsonwebtoken");

exports.registerHospitalAmbulance = async (req, res) => {
  try {
    const {
      hospitalName,
      driverName,
      phoneNumber,
      hospitalAddress,
      ambulanceType,
      vehicleNumber,
      vehicleRegistrationLicenseNumber,
      password
    } = req.body;

    if (
      !hospitalName ||
      !driverName ||
      !phoneNumber ||
      !hospitalAddress ||
      !ambulanceType ||
      !vehicleNumber ||
      !vehicleRegistrationLicenseNumber ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const existing = await HospitalAmbulance.findOne({
      $or: [
        { phoneNumber },
        { vehicleNumber }
      ]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Hospital ambulance already registered"
      });
    }

    const hospitalAmbulanceId = await generateUniqueId(
      HospitalAmbulance,
      "hospitalAmbulanceId",
      "HOSPAMB"
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const ambulance = await HospitalAmbulance.create({
      hospitalAmbulanceId,
      hospitalName,
      driverName,
      phoneNumber,
      hospitalAddress,
      ambulanceType,
      vehicleNumber,
      vehicleRegistrationLicenseNumber,
      password: hashedPassword,
      driverPhoto: req.files?.driverPhoto?.[0]?.path || null,
      driverIdProof: req.files?.driverIdProof?.[0]?.path || null,
      vehicleRegistrationCertificate:
        req.files?.vehicleRegistrationCertificate?.[0]?.path || null,
      vehiclePhoto: req.files?.vehiclePhoto?.[0]?.path || null
    });

    res.status(201).json({
      success: true,
      message: "Hospital ambulance registered successfully",
      ambulance
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};

exports.loginHospitalAmbulance = async (req, res) => {
  try {
    const { hospitalAmbulanceId, password } = req.body;

    if (!hospitalAmbulanceId || !password) {
      return res.status(400).json({
        success: false,
        message: "Hospital ambulance ID and password are required"
      });
    }

    const ambulance = await HospitalAmbulance.findOne({
      hospitalAmbulanceId
    });

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Hospital ambulance not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      ambulance.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: ambulance._id,
        hospitalAmbulanceId: ambulance.hospitalAmbulanceId,
        role: "hospitalAmbulance"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      ambulance: {
        hospitalAmbulanceId: ambulance.hospitalAmbulanceId,
        hospitalName: ambulance.hospitalName,
        driverName: ambulance.driverName,
        phoneNumber: ambulance.phoneNumber,
        ambulanceType: ambulance.ambulanceType,
        availability: ambulance.availability
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};