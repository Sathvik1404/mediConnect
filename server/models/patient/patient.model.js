const mongoose = require('mongoose');

const PatientSchema = mongoose.Schema({
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
        type: String,
        required: true
    },
    record: {
        type: [String]
    },
    role: {
        type: String,
        required: true,
        default: "patient"
    },
    address: {
        type: String
    },
    doctors: {
        type: [String]
    }
});

const PatientModel = mongoose.model("patient", PatientSchema);

module.exports = PatientModel;