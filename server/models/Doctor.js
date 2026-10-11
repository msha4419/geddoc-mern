const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    hospital: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        default: 0,
    },
    consultationFee: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    available: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);