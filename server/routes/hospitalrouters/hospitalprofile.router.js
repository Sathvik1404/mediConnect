const hospitalModel = require('../../models/hospital/hospital.model');
const express = require('express');
const session = require('express-session');

const router = express.Router();

router.use(express.json());

router.use(session({
    secret: 'hospital-token',
    resave: false,
    saveUninitialized: true
}));

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const hospital = await hospitalModel.findOne({ _id: id });
    if (hospital) {
        res.status(200).json(hospital);
    }
    else {
        res.status(404).json({ message: 'No data' });
    }
});

router.get('/', async (req, res) => {
    const hospitals = await hospitalModel.find({});
    if (hospitals) {
        res.status(200).json(hospitals);
    }
    else {
        res.status(500).json({ message: 'No data or Internal Server Error' });
    }
});

module.exports = router;