const mongoose = require('mongoose')

const prescriptionSchema = mongoose.Schema({
    patientId: {
        type: Object
    },
    doctorId: {
        type: Object
    },
    medication: {
        type: String
    },
    dosage: {
        type: String
    },
    frequency: {
        type: String
    },
    duration: {
        type: String
    },
    instructions: {
        type: String
    },
    datePrescribed: {
        type: Date
    }
})

const prescriptionModel = mongoose.model("prescription", prescriptionSchema)

module.exports = prescriptionModel