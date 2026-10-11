const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

const router = express.Router();

// Memeriksa token login pasien
function requireAuth(req, res, next) {
    const authorization = req.headers.authorization || "";
    const token = authorization.startsWith("Bearer ") ?
        authorization.slice(7) :
        null;

    if (!token) {
        return res.status(401).json({
            message: "Silakan login terlebih dahulu",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const patientId = decoded.id || decoded.userId;

        if (!patientId || !mongoose.isValidObjectId(patientId)) {
            return res.status(401).json({
                message: "Token login tidak valid",
            });
        }

        req.patientId = patientId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Sesi login tidak valid atau sudah berakhir",
        });
    }
}

// Mengecek apakah API aktif
router.get("/", (req, res) => {
    res.json({
        message: "Geddoc appointments API aktif",
    });
});

// Menampilkan appointment milik pasien yang login
router.get("/my", requireAuth, async(req, res) => {
    try {
        const appointments = await Appointment.find({
                patient: req.patientId,
            })
            .populate("doctor")
            .sort({ createdAt: -1 });

        res.json(appointments);
    } catch (error) {
        console.error("Get appointments error:", error);
        res.status(500).json({
            message: "Gagal mengambil data appointment",
        });
    }
});

// Menyimpan booking appointment baru
router.post("/", requireAuth, async(req, res) => {
    try {
        const {
            doctor,
            appointmentDate,
            appointmentTime,
            reason,
        } = req.body;

        if (!doctor || !appointmentDate || !appointmentTime) {
            return res.status(400).json({
                message: "Dokter, tanggal, dan jam wajib diisi",
            });
        }

        if (!mongoose.isValidObjectId(doctor)) {
            return res.status(400).json({
                message: "ID dokter tidak valid",
            });
        }

        const selectedDoctor = await Doctor.findById(doctor);

        if (!selectedDoctor) {
            return res.status(404).json({
                message: "Dokter tidak ditemukan",
            });
        }

        const appointment = await Appointment.create({
            patient: req.patientId,
            doctor,
            appointmentDate,
            appointmentTime,
            reason: reason || "",
            status: "pending",
        });

        const savedAppointment = await Appointment.findById(
            appointment._id
        ).populate("doctor");

        res.status(201).json({
            message: "Booking appointment berhasil",
            appointment: savedAppointment,
        });
    } catch (error) {
        console.error("Create appointment error:", error);
        res.status(500).json({
            message: "Booking belum dapat disimpan",
        });
    }
});

// Membatalkan appointment milik pasien
router.patch("/:id/cancel", requireAuth, async(req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "ID appointment tidak valid",
            });
        }

        const appointment = await Appointment.findOne({
            _id: req.params.id,
            patient: req.patientId,
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment tidak ditemukan",
            });
        }

        if (appointment.status !== "pending") {
            return res.status(400).json({
                message: "Hanya appointment pending yang dapat dibatalkan",
            });
        }

        appointment.status = "cancelled";
        await appointment.save();

        res.json({
            message: "Appointment berhasil dibatalkan",
            appointment,
        });
    } catch (error) {
        console.error("Cancel appointment error:", error);
        res.status(500).json({
            message: "Gagal membatalkan appointment",
        });
    }
});

module.exports = router;