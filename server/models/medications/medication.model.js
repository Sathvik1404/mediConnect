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
const medicaion = mongoose.model("medication", medicationSchema);
module.exports = medicaion