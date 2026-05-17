const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser'); 
const cors = require('cors');

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ROUTES
const hospitalRoutes = require('./Routes/HospitalRoutes');
const ambulanceRoutes = require('./Routes/AmbulanceRoutes');
const hospitalAmbulanceRoutes = require("./Routes/HospitalAmbulanceRoutes");
const privateAmbulanceRoutes = require("./Routes/PrivateAmbulanceRoutes");
const patientRoutes = require('./Routes/patientRoutes');
const clinicRoutes = require("./Routes/ClinicRoutes");
const appointmentRoutes = require("./Routes/appointmentRoutes");
const prescriptionRoutes = require("./Routes/prescriptionRoutes");
const attendanceRoutes = require("./Routes/attendanceRoutes");
const onlineDoctorRoutes = require("./Routes/onlineDoctorRoutes");
const authRoutes = require("./Routes/authRoutes");


//  CLEAN PREFIXES
app.use("/api/hospital", hospitalRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/ambulance", ambulanceRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/hospital-ambulance", hospitalAmbulanceRoutes);
app.use("/api/private-ambulance", privateAmbulanceRoutes);

const otpRoutes = require("./routes/otpRoutes");
// MAIN MODULE (IMPORTANT)
app.use("/api/clinic", clinicRoutes);


// OPTIONAL (later phase)
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/online-doctor", onlineDoctorRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});