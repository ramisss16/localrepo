const Patient = require("../models/Patient");

// CREATE
const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient)
      return res.status(404).json({ message: "Patient not found" });

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
const deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getDoctorPatients = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await require("../models/Appointment")
      .find({ doctorId })
      .populate("patientId");

    const uniquePatients = [
      ...new Map(
        appointments.map(a => [a.patientId._id.toString(), a.patientId])
      ).values()
    ];

    res.status(200).json(uniquePatients);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getDoctorPatients
};