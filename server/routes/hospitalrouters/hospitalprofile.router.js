const hospitalModel = require('../../models/hospital/hospital.model');
const requestModel = require('../../models/requests/request.model');
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

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, mobile, email, address, patients } = req.body;
    await hospitalModel.findOneAndUpdate({ _id: id }, { name, mobile, email, address, patients })
        .then(hos => res.status(200).json({ message: "Success" }))
        .catch(err => res.status(500).json({ message: "Internal Server Error or No data" }))
});

router.post('/:id/apply', async (req, res) => {
    const { id } = req.params;
    const { doctorId, doctorName, specialization, experience } = req.body;
    try {
        await requestModel.create({ hospitalId: id, doctorId, doctorName, specialization, experience })
            .then(user => res.json({ success: true }))
            .catch(err => res.json(err))
    } catch (err) {
        console.log('Request failed:', err);
        res.status(500).json({ error: 'Internal server error' })
    }
});

router.get('/:id/requests', async (req, res) => {
    const { id } = req.params;
    const requests = await requestModel.find({ hospitalId: id });
    if (requests) {
        res.status(200).json(requests)
    } else {
        res.status(500).json({ message: "No Error or Internal error" })
    }
});

router.put('/:id/requests/:reqId', async (req, res) => {
    const { id, reqId } = req.params;
    const { status } = req.body;
    await requestModel.findOneAndUpdate({ _id: reqId }, { status })
        .then(hos => res.status(200).json({ message: "Success" }))
        .catch(err => res.status(500).json({ message: "Internal Server Error or No data" }))
})

module.exports = router;