const mongoose = require("mongoose");
require("dotenv").config();

const Doctor = require("./models/Doctor");

const doctors = [{
        name: "dr. Andi Pratama",
        specialization: "Dokter Umum",
        hospital: "Geddoc Medical Center",
        experience: 8,
        consultationFee: 75000,
        description: "Melayani konsultasi kesehatan umum.",
        available: true,
    },
    {
        name: "dr. Siti Maharani, Sp.A",
        specialization: "Dokter Anak",
        hospital: "Geddoc Medical Center",
        experience: 10,
        consultationFee: 150000,
        description: "Melayani konsultasi kesehatan anak.",
        available: true,
    },
    {
        name: "dr. Budi Santoso, Sp.PD",
        specialization: "Penyakit Dalam",
        hospital: "Geddoc Medical Center",
        experience: 12,
        consultationFee: 175000,
        description: "Melayani konsultasi penyakit dalam.",
        available: true,
    },
    {
        name: "dr. Rina Anggraini, Sp.KK",
        specialization: "Kulit dan Kelamin",
        hospital: "Geddoc Medical Center",
        experience: 9,
        consultationFee: 160000,
        description: "Melayani konsultasi kesehatan kulit.",
        available: true,
    },
    {
        name: "dr. Dimas Saputra, Sp.JP",
        specialization: "Jantung",
        hospital: "Geddoc Medical Center",
        experience: 15,
        consultationFee: 200000,
        description: "Melayani konsultasi kesehatan jantung.",
        available: true,
    },
];

async function seedDoctors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const existingDoctors = await Doctor.countDocuments();

        if (existingDoctors > 0) {
            console.log(
                "Data dokter sudah tersedia. Tidak ada data yang ditambahkan."
            );
        } else {
            await Doctor.insertMany(doctors);
            console.log("5 data dokter berhasil ditambahkan!");
        }
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedDoctors();