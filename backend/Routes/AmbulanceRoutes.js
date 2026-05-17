const express = require("express");
const router = express.Router();

const Ambulance = require("../models/Ambulance");


//    ADD AMBULANCE 

router.post("/add", async (req, res) => {
  try {
    const ambulance = new Ambulance(req.body);

    const savedAmbulance = await ambulance.save();

    res.status(201).json({
      message: "Ambulance added successfully",
      ambulance: savedAmbulance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add ambulance" });
  }
});


//    GET ALL AMBULANCES 

router.get("/all", async (req, res) => {
  try {
    const ambulances = await Ambulance.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: ambulances.length,
      ambulances
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ambulances" });
  }
});


//    GET SINGLE AMBULANCE

router.get("/:id", async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id);

    if (!ambulance) {
      return res.status(404).json({ error: "Ambulance not found" });
    }

    res.status(200).json(ambulance);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ambulance" });
  }
});


//    UPDATE AMBULANCE

router.put("/:id", async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ambulance) {
      return res.status(404).json({ error: "Ambulance not found" });
    }

    res.status(200).json({
      message: "Ambulance updated successfully",
      ambulance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ambulance" });
  }
});


//    DELETE AMBULANCE

router.delete("/:id", async (req, res) => {
  try {
    const ambulance = await Ambulance.findByIdAndDelete(req.params.id);

    if (!ambulance) {
      return res.status(404).json({ error: "Ambulance not found" });
    }

    res.status(200).json({
      message: "Ambulance deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete ambulance" });
  }
});


//    TOGGLE AVAILABILITY

router.patch("/:id/status", async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id);

    if (!ambulance) {
      return res.status(404).json({ error: "Ambulance not found" });
    }

    ambulance.availability =
      ambulance.availability === "Available" ? "Busy" : "Available";

    await ambulance.save();

    res.status(200).json({
      message: "Availability updated",
      availability: ambulance.availability
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;