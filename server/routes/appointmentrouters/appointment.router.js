const mongoose = require('mongoose');
const express = require('express');
const AppointmentModel = require('../../models/appointments.model');
const router = express.Router();
const session = require('express-session');

router.use(express.json());

router.use(session({
    secret: 'hospital-token',
    resave: false,
    saveUninitialized: true
}));

router.post('/', async (req, res) => {
    // console.log(req.body)
    const { doctorId, date, time, patientName, patientEmail, patientId, doctorName, hospitalName } = req.body;
    await AppointmentModel.create({ doctorId, date, time, patientEmail, patientId, patientName, doctorName, hospitalName })
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ error: 'Failed to create one' }));
});

router.get('/', async (req, res) => {
    const response = await AppointmentModel.find({});
    // console.log(response);
    if (!response) {
        res.status(500).json({ message: "Server error" })
    } else {
        res.status(200).json(response)
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await AppointmentModel.findOneAndUpdate({ _id: id }, { status }, { new: true });
    res.status(200).json(appointment);
})

module.exports = router;