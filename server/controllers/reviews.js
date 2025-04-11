const express = require('express');
const ReviewSchema = require('../models/review.model');
const router = express.Router();

router.post('/review', async (req, res) => {
    try {
        const data = await new ReviewSchema(req.body).save();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: "There was an error submitting the review", error: err.message });
    }
});
router.get('/review', async (req, res) => {
    try {
        const data = await ReviewSchema.find({}, { quote: 1, name: 1, role: 1, _id: 0 });
        res.status(200).json(data);
    }
    catch (err) {
        res.status(500).json({ message: "There was an error in retrieving the reviews" })
    }
})

module.exports = router;
