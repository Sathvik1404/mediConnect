const doctorModel = require('../../models/doctor/doctor.model')
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
    const doctor = await doctorModel.findOne({ _id: id })
    if (doctor) {
        res.status(200).json(doctor)
    }
    else {
        res.status(404).json({ message: "No data" })
    }
})

router.get('/', async (req, res) => {
    const doctors = await doctorModel.find({})
    if (!doctors) {
        res.status(500).json({ message: "Server error" })
    }
    else {
        res.status(200).json(doctors)
    }
})

module.exports = router;