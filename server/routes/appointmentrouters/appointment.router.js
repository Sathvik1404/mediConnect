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

// In your appointment routes file (e.g., routes/appointment.js)
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.query;

        // Find all appointments for this doctor on this date
        const appointments = await AppointmentModel.find({
            doctorId,
            date: date,
            status: { $ne: 'cancelled' } // Exclude cancelled appointments
        }).select('time');

        res.json(appointments);
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ message: 'Server error' });
    }
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
router.get('/:name', async (req, res) => {
    const name = req.params;
    try {
        const data = await AppointmentModel.find({ patientName: name })
        if (data) {
            res.status(200).json({ message: "Data retrived", data })
        }
    }
    catch (err) {
        res.status(400).json({ message: "Error in receiving in appointments" })
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await AppointmentModel.findOneAndUpdate({ _id: id }, { status }, { new: true });
    res.status(200).json(appointment);
})

module.exports = router;