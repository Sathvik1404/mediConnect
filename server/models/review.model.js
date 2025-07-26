const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
});

const ReviewSchema = mongoose.model("RevieSchema", reviewSchema);
module.exports = ReviewSchema;
