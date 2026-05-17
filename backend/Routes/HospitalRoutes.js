const express = require("express");
const router = express.Router();

const Hospital = require("../models/Hospital");
const { generateToken, jwtAuthMiddleware } = require("../middleware/jwt");

/* ======================================================
   HOSPITAL SIGNUP
====================================================== */
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    const newHospital = new Hospital(data);
    const hospital = await newHospital.save();

    // ✅ AUTO LOGIN: generate token
    const payload = {
      id: hospital._id,
      email: hospital.email
    };
    const token = generateToken(payload);

    res.status(201).json({
      message: "Signup successful",
      token,          // 🔥 VERY IMPORTANT
      hospital
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/* ======================================================
   HOSPITAL LOGIN
====================================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hospital = await Hospital.findOne({ email });

    if (!hospital || !(await hospital.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: "Invalid Email or Password" });
    }

    const payload = {
      id: hospital._id,
      email: hospital.email
    };

    const token = generateToken(payload);

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ======================================================
   GET HOSPITAL PROFILE (DASHBOARD)
====================================================== */
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user.id).select("-password");

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ======================================================
   UPDATE BANK DETAILS
====================================================== */
router.put("/bank-details", jwtAuthMiddleware, async (req, res) => {
  try {
    const { bankName, accountHolder, accountNumber, ifsc } = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      req.user.id,
      {
        bankDetails: {
          bankName,
          accountHolder,
          accountNumber,
          ifsc
        },
        "onboardingStatus.bankCompleted": true
      },
      { new: true }
    );

    res.status(200).json({
      message: "Bank details saved successfully",
      hospital
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save bank details" });
  }
});

/* ======================================================
   UPDATE EMERGENCY CONTACT
====================================================== */
router.put("/emergency-contact", jwtAuthMiddleware, async (req, res) => {
  try {
    const { name, phone, relation } = req.body;

    const hospital = await Hospital.findByIdAndUpdate(
      req.user.id,
      {
        emergencyContact: {
          name,
          phone,
          relation
        },
        "onboardingStatus.emergencyCompleted": true
      },
      { new: true }
    );

    res.status(200).json({
      message: "Emergency contact saved successfully",
      hospital
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save emergency contact" });
  }
});

module.exports = router;
