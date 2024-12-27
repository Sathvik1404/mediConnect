const mongoose = require('mongoose');

const DoctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    record: {
        type: Object
    },
    specialization: {
        type: [String],
        required: true
    },
    hospitals: {
        type: [String]
    },
    patients: {
        type: [String]
    },
    role: {
        type: String,
        required: true,
        default: "doctor"
    },
    experience: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: "On Leave"
    }
});

const DoctorModel = mongoose.model("doctor", DoctorSchema);

module.exports = DoctorModel;