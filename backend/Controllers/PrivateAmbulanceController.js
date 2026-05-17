const PrivateAmbulance = require("../models/PrivateAmbulance");
const bcrypt = require("bcryptjs");
const generateUniqueId = require("../utils/generateUniqueId");
const jwt = require("jsonwebtoken");

exports.registerPrivateAmbulance = async (req, res) => {
  try {
    const {
      ownerName,
      driverName,
      phoneNumber,
      ownerAddress,
      ambulanceType,
      vehicleNumber,
      vehicleRegistrationLicenseNumber,
      password
    } = req.body;

    if (
      !ownerName ||
      !driverName ||
      !phoneNumber ||
      !ownerAddress ||
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

    const existing = await PrivateAmbulance.findOne({
      $or: [
        { phoneNumber },
        { vehicleNumber }
      ]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Private ambulance already registered"
      });
    }

    const privateAmbulanceId = await generateUniqueId(
      PrivateAmbulance,
      "privateAmbulanceId",
      "PRIVAMB"
    );

    const hashedPassword = await bcrypt.hash(password, 10);

    const ambulance = await PrivateAmbulance.create({
      privateAmbulanceId,
      ownerName,
      driverName,
      phoneNumber,
      ownerAddress,
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
      message: "Private ambulance registered successfully",
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

exports.loginPrivateAmbulance = async (req, res) => {
  try {
    const { privateAmbulanceId, password } = req.body;

    if (!privateAmbulanceId || !password) {
      return res.status(400).json({
        success: false,
        message: "Private ambulance ID and password are required"
      });
    }

    const ambulance = await PrivateAmbulance.findOne({
      privateAmbulanceId
    });

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        message: "Private ambulance not found"
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
        privateAmbulanceId: ambulance.privateAmbulanceId,
        role: "privateAmbulance"
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      ambulance: {
        privateAmbulanceId: ambulance.privateAmbulanceId,
        ownerName: ambulance.ownerName,
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