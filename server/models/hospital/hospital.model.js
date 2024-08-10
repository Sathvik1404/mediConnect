const mongoose = require('mongoose');

const HospitalSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
    doctors: {
        type: [String]
    },
    patients: {
        type: [String]
    },
    role: {
        type: String,
        required: true,
        default: "hospital"
    },
    address: {
        type: String,
        required: true
    }
});

const HospitalModel = mongoose.model("hospital", HospitalSchema);

module.exports = HospitalModel;