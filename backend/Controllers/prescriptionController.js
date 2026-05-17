const Prescription = require("../models/Prescription");
const Appointment = require("../models/Appointment");

exports.createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      medicines,
      notes
    } = req.body;

    // 🔥 check appointment
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.status === "completed") {
      return res.status(400).json({
        message: "Prescription already created"
      });
    }

    const prescription = new Prescription({
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      medicines,
      notes
    });

    await prescription.save();

    await Appointment.findByIdAndUpdate(appointmentId, {
      status: "completed"
    });

    res.status(201).json({
      success: true,
      message: "Prescription created",
      data: prescription
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getPatientPrescriptions = async (req, res) => {
  try {

    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patientId })
      .populate("doctorId", "name specialization")
      .sort({ createdAt: -1 });

    res.status(200).json(prescriptions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPrescriptionByAppointment = async (req, res) => {
  try {

    const { appointmentId } = req.params;

    const prescription = await Prescription.findOne({ appointmentId })
      .populate("patientId", "firstName lastName phone")
      .populate("doctorId", "name specialization");

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found"
      });
    }

    res.status(200).json(prescription);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};