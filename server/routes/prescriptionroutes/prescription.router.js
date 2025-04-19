const express = require('express')
const prescriptionModel = require('../../models/prescription/prescription.model')

const router = express.Router()

router.use(express.json());

router.post('/', async (req, res) => {

    try {
        const prescription = await prescriptionModel.create(req.body)
            .then(user => res.json({ success: true }))
            .catch(err => res.status(500).json({ error: 'Failed to create prescription' }));
    } catch (err) {
        console.error('Signup error: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get('/patient/:id', async (req, res) => {
    const { id } = req.params
    // console.log(id)
    const prescriptions = await prescriptionModel.find({ patientId: id })
    if (!prescriptions) {
        return res.status(404).json({ message: "Not found" })
    }
    return res.status(200).json(prescriptions)
})

module.exports = router