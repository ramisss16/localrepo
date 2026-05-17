const mongoose = require("mongoose");
const Doctor = require("../models/Doctor");
const Receptionist = require("../models/Receptionist");
const Manager = require("../models/Manager");
const generateUniqueId = require("../utils/generateUniqueId");
const Clinic = require("../models/Clinic");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// ================== CLINIC SIGNUP ==================
exports.signupClinic = async (req, res) => {
  try {
    const {
      clinicName,
      clinicEmail,
      adminName,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      licenseNumber,
    } = req.body;

   if (!clinicName || !clinicEmail) {
  return res.status(400).json({
    success: false,
    message:
      "Clinic name and email are required",
  });
}

   const existing = await Clinic.findOne({clinicEmail,});

if (existing) {
  return res.status(400).json({
    success: false,
    message:
      "Clinic email already exists",
  });
}

   let hashedPassword =
"";

if (password) {
  hashedPassword =
    await bcrypt.hash(
      password,
      10
    );
}
    const adminId = await generateUniqueId(Clinic, "adminId", "ADM");

   const clinic =
new Clinic({
  adminId,

  clinicName,
  clinicEmail,

 adminName:
  adminName,

  email: email || undefined,
  password: hashedPassword,
  phone: phone || undefined,

  address:
    address ,

  city:
    city ,

  state:
    state ,

  pincode:
    pincode ,

  licenseNumber:
    licenseNumber,

  licenseDocument:
    req.files
      ?.licenseDocument?.[0]
      ?.path,

  aadhaarDocument:
    req.files
      ?.aadhaarDocument?.[0]
      ?.path,

  panDocument:
    req.files
      ?.panDocument?.[0]
      ?.path ,

  clinicLogo:
    req.files
      ?.clinicLogo?.[0]
      ?.path,
});

    await clinic.save();

    res.status(201).json({
      success: true,
      message: "Clinic created successfully",
      data: {
        adminId,
        clinicId: clinic._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// update clinic details
exports.updateClinic =
  async (req, res) => {
    try {
      const { clinicId } =
        req.params;

      const {
        adminName,
        email,
        password,
        phone,
        address,
        city,
        state,
        pincode,
        specialization,
        consultationFee,
        availableSlots,
        officialAddress,
        officialContact,
        officialEmail,
        specialistsCount,
        doctorsCount,
        visitMode,
        hasSupportStaff,
      } = req.body;

      // clinic check
      const clinic =
        await Clinic.findById(
          clinicId
        );

      if (!clinic) {
        return res
          .status(404)
          .json({
            success:
              false,
            message:
              "Clinic not found",
          });
      }

      // hash password only if provided
      let hashedPassword =
        clinic.password;

      if (password) {
        hashedPassword =
          await bcrypt.hash(
            password,
            10
          );
      }

      // update clinic
      const updatedClinic =
        await Clinic.findByIdAndUpdate(
          clinicId,
          {
            adminName:
              adminName ||
              clinic.adminName,

            email:
              email ||
              clinic.email,

            password:
              hashedPassword,

            phone:
              phone ||
              clinic.phone,

            address:
              address ||
              clinic.address,

            city:
              city ||
              clinic.city,

            state:
              state ||
              clinic.state,

            pincode:
              pincode ||
              clinic.pincode,

            specialization:
              specialization ||
              clinic.specialization,

            consultationFee:
              consultationFee ||
              clinic.consultationFee,

            availableSlots:
              availableSlots ||
              clinic.availableSlots,

            officialAddress:
              officialAddress ||
              clinic.officialAddress,

            officialContact:
              officialContact ||
              clinic.officialContact,

            officialEmail:
              officialEmail ||
              clinic.officialEmail,

            specialistsCount:
              specialistsCount ||
              clinic.specialistsCount,

            doctorsCount:
              doctorsCount ||
              clinic.doctorsCount,

            visitMode:
              visitMode ||
              clinic.visitMode,

            hasSupportStaff:
              hasSupportStaff ??
              clinic.hasSupportStaff,

            // FILES
            photo:
              req.files?.photo?.[0]
                ?.path ||
              clinic.photo,

            licenseDocument:
              req.files
                ?.licenseDocument?.[0]
                ?.path ||
              clinic.licenseDocument,

            aadhaarDocument:
              req.files
                ?.aadhaarDocument?.[0]
                ?.path ||
              clinic.aadhaarDocument,

            panDocument:
              req.files
                ?.panDocument?.[0]
                ?.path ||
              clinic.panDocument,

            clinicLogo:
              req.files
                ?.clinicLogo?.[0]
                ?.path ||
              clinic.clinicLogo,

            experienceCertificate:
              req.files
                ?.experienceCertificate?.[0]
                ?.path ||
              clinic.experienceCertificate,
          },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Clinic updated successfully",
        data:
          updatedClinic,
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        message:
          err.message,
      });
    }
  };

// ================== REGISTER DOCTOR ==================
exports.registerDoctor = async (req, res) => {
  try {
    const { clinicId, name, specialization, phone, email, password } = req.body;

    if (!clinicId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found",
      });
    }

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctorId = await generateUniqueId(Doctor, "doctorId", "DOC");

    const doctor = new Doctor({
      doctorId,
      clinicId,
      name,
      specialization,
      phone,
      email,
      password: hashedPassword,

      photo: req.files?.photo?.[0]?.path ,
      aadhaarDocument: req.files?.aadhaarDocument?.[0]?.path,
      panDocument: req.files?.panDocument?.[0]?.path,
      experienceCertificate: req.files?.experienceCertificate?.[0]?.path,
      licenseCertificate: req.files?.licenseCertificate?.[0]?.path,
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      data: { doctorId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== REGISTER MANAGER ==================
exports.registerManager = async (req, res) => {
  try {
    const { clinicId, name, email, phone, password } = req.body;

    if (!clinicId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clinicId",
      });
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found",
      });
    }

    const existing = await Manager.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Manager already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const managerId = await generateUniqueId(Manager, "managerId", "MGN");

    const manager = new Manager({
      managerId,
      clinicId,
      name,
      email,
      phone,
      password: hashedPassword,

      photo: req.files?.photo?.[0]?.path ,
      aadhaarDocument: req.files?.aadhaarDocument?.[0]?.path ,
      panDocument: req.files?.panDocument?.[0]? 
      experienceCertificate: req.files?.experienceCertificate?.[0]?.path ,
    });

    await manager.save();

    res.status(201).json({
      success: true,
      message: "Manager registered successfully",
      data: { managerId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== REGISTER RECEPTIONIST ==================
exports.registerReceptionist = async (req, res) => {
  try {
    const { clinicId, name, phone, email, password } = req.body;

    if (!clinicId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(clinicId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid clinicId",
      });
    }

    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(404).json({
        success: false,
        message: "Clinic not found",
      });
    }

    const existing = await Receptionist.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Receptionist already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const receptionistId = await generateUniqueId(
      Receptionist,
      "receptionistId",
      "REC"
    );

    const receptionist = new Receptionist({
      receptionistId,
      clinicId,
      name,
      phone,
      email,
      password: hashedPassword,

      photo: req.files?.photo?.[0]?.path,
      aadhaarDocument: req.files?.aadhaarDocument?.[0]?.path,
      panDocument: req.files?.panDocument?.[0]?.path,
      experienceCertificate: req.files?.experienceCertificate?.[0]?.path,
    });

    await receptionist.save();

    res.status(201).json({
      success: true,
      message: "Receptionist registered successfully",
      data: { receptionistId },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== LOGIN ==================
exports.loginClinicUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    let user;

    // Admin
    user = await Clinic.findOne({ adminId: userId });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Admin login successful",
        role: "admin",
        token,
        clinicId: user._id,
      });
    }

    // Doctor
    user = await Doctor.findOne({ doctorId: userId });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, role: "doctor" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Doctor login successful",
        role: "doctor",
        token,
        clinicId: user.clinicId,
      });
    }

    // Manager
    user = await Manager.findOne({ managerId: userId });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, role: "manager" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Manager login successful",
        role: "manager",
        token,
        clinicId: user.clinicId,
      });
    }

    // Receptionist
    user = await Receptionist.findOne({ receptionistId: userId });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { id: user._id, role: "receptionist" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Receptionist login successful",
        role: "receptionist",
        token,
        clinicId: user.clinicId,
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================== GET DOCTORS ==================
exports.getAllDoctors = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const doctors = await Doctor.find({ clinicId });

    res.status(200).json({
      success: true,
      message: "Doctors fetched",
      data: doctors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllStaff = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const doctors = await Doctor.find({ clinicId });
    const managers = await Manager.find({ clinicId });
    const receptionists = await Receptionist.find({ clinicId });

    const staff = [
      ...doctors.map((d) => ({
        staffId: d.doctorId,
        name: d.name,
        type: "doctor",
      })),
      ...managers.map((m) => ({
        staffId: m.managerId,
        name: m.name,
        type: "manager",
      })),
      ...receptionists.map((r) => ({
        staffId: r.receptionistId,
        name: r.name,
        type: "receptionist",
      })),
    ];

    res.json({
      success: true,
      data: staff,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
