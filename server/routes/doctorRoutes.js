const express = require("express");
const Doctor = require("../models/Doctor");

const router = express.Router();

// GET semua dokter
router.get("/", async(req, res) => {
    try {
        const doctors = await Doctor.find().sort({ name: 1 });

        res.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error.message);

        res.status(500).json({
            message: "Gagal mengambil data dokter",
        });
    }
});

// GET detail dokter berdasarkan ID
router.get("/:id", async(req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Dokter tidak ditemukan",
            });
        }

        res.json(doctor);
    } catch (error) {
        res.status(400).json({
            message: "ID dokter tidak valid",
        });
    }
});

module.exports = router;