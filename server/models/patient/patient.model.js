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
        type: Object
    },
    role: {
        type: String,
        required: true,
        default: "patient"
    }
});

const PatientModel = mongoose.model("patient", PatientSchema);

module.exports = PatientModel;