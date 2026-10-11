const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// Halaman utama API
app.get("/", (req, res) => {
    res.json({
        message: "Geddoc MERN Backend is running!",
    });
});

// Mengecek status backend dan database
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        application: "Geddoc",
        backend: "Node.js + Express.js",
        database: mongoose.connection.readyState === 1 ?
            "Connected" : "Disconnected",
    });
});

// Menghubungkan MongoDB Atlas
async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI belum diatur di file .env");
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas connected successfully!");

        app.listen(PORT, () => {
            console.log(
                `Geddoc backend running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();