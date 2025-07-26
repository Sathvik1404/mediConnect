const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    doctorId: {
        type: String,
        ref: 'doctor',
        required: true
    },
    patientId: {
        type: String,
        ref: 'patient',
        required: false  // Make it required: true if you're tracking authenticated patients
    },
    message: {
        type: String,
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    reply: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);
