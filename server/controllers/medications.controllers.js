const Medication = require('../models/medications/medication.model');
const express = require('express');
const router = express.Router();
router.post('/medication', (req, res) => {
    try {
        const body = req.body;
        const data = new Medication(body).save();
        if (data) {
            res.status(200).json({ message: "Medication sent", body })
        } else {
            res.status(400).json({ message: "There was an error in sending medication" })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.get('/medication', async (req, res) => {
    try {
        const data = await Medication.find({}, { _id: 0, __v: 0 });
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(400).json({ message: "There was an error in retreiving medications" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;