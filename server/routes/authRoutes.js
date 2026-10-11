const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER PASIEN
router.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Semua field wajib diisi",
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password minimal 8 karakter",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email sudah terdaftar",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "Registrasi berhasil",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Register error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan saat registrasi",
        });
    }
});

// LOGIN PASIEN
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email dan password wajib diisi",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Email atau password salah",
            });
        }
        if (!user.password) {
            console.error("Login error: Password hash tidak ditemukan");

            return res.status(500).json({
                message: "Data password akun tidak tersedia",
            });
        }
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Email atau password salah",
            });
        }

        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        res.json({
            message: "Login berhasil",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Terjadi kesalahan saat login",
        });
    }
});

module.exports = router;