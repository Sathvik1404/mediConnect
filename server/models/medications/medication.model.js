const mongoose = require('mongoose')
const medicationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        required: true,
    },
    remaining: {
        type: Number,
        required: true,
    },
});
const medication = mongoose.model("medication", medicationSchema);
module.exports = medication