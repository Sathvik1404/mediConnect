const mongoose = require('mongoose');
const express = require('express');
const AppointmentModel = require('../../models/appointments.model');
const router = express.Router();

router.post('/', async (req, res) => {
    // console.log(req.body)
    const { doctorId, date, time, patientName, patientEmail, patientId } = req.body;
    await AppointmentModel.create({ doctorId, date, time, patientEmail, patientId, patientName })
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ error: 'Failed to create one' }));
});

module.exports = router;