const patientModel = require('../../models/patient/patient.model')
// const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const router = express.Router();

// router.use(cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials: true
// }));

router.use(express.json());

router.use(session({
    secret: 'hospital-token',
    resave: false,
    saveUninitialized: true
}));

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const patient = await patientModel.findOne({ _id: id })
    if (patient) {
        res.status(200).json(patient)
    }
    else {
        res.status(404).json({ message: "No data" })
    }
})

router.put('/:id', async (req, res) => {
    const { name, address, mobile, age, email, doctors, record } = req.body;
    const patient = await patientModel.findOneAndUpdate({ _id: req.params.id }, { name, address, mobile, age, email, doctors, record }, { new: true })
    res.status(200).json(patient)
})

module.exports = router;