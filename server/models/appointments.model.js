const mongoose = require('mongoose');

const AppointmentShema = mongoose.Schema({
    doctorId: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    patientEmail: {
        type: String
    },
    patientName: {
        type: String
    },
    patientId: {
        type: String
    },
    status: {
        type: String,
        default: "Not Completed"
    },
    doctorName: {
        type: String
    },
    hospitalName: {
        type: String
    }
});

const AppointmentModel = mongoose.model('appointment', AppointmentShema);

module.exports = AppointmentModel;