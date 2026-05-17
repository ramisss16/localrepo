const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// define hospital schema
const hospitalSchema = new mongoose.Schema(
  {
    hospitalname: {
      type: String,
      required: true
    },

    address: {
      line1: String,
      line2: String
    },

    email: {
      type: String,
      unique: true,
      required: true
    },

    mobile1: {
      type: String,
      required: true
    },

    mobile2: {
      type: String,
      required: true
    },

    gstnumber: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    // 🔒 DO NOT TOUCH (as requested)
    documents: {
      regCertificate: String,
      gstPan: String,
      addressProof: String
    },

    // 🏦 Bank Details (NEW)
    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      ifsc: String,
      bankName: String
    },

    // 🚨 Emergency Contact (NEW)
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },

    // 📌 Onboarding status (NEW)
    onboardingStatus: {
      bankCompleted: {
        type: Boolean,
        default: false
      },
      emergencyCompleted: {
        type: Boolean,
        default: false
      },
      termsAccepted: {
        type: Boolean,
        default: false
      }
    }
  },
  { timestamps: true }
);

// 🔐 hash password
hospitalSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔑 compare password
hospitalSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Hospital = mongoose.model("Hospital", hospitalSchema);
module.exports = Hospital;
