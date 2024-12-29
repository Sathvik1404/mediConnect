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
    doctorName: {
        type: String
    },
    specialization: {
        type: [String]
    },
    experience: {
        type: Number
    },
    status: {
        type: String,
        required: true,
        default: "Not Applied"
    }
});

const RequestModel = mongoose.model("requests", requestSchema);

module.exports = RequestModel;