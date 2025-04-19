const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    hospitalId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String
    },
    availability: {
        type: String
    },
    startDate: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        default: "Not Applied"
    },
    appliedAt: {
        type: Date
    }
});

const RequestModel = mongoose.model("requests", requestSchema);

module.exports = RequestModel;