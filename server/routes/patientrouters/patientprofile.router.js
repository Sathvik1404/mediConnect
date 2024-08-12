const patientModel = require('../../models/patient/patient.model')
// const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files'); // Directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save with the original name, overwriting if it exists
    }
});

const upload = multer({
    storage: storage,
}).single('record');

// Route to handle file upload
router.put('/uploadrecord/:id', upload, async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const patient = await patientModel.findOneAndUpdate(
            { _id: id },
            { record: req.file.path },
            { new: true }  // Return the updated document
        );

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error });
    }
});

// Route to download/view the medical record
router.get('/downloadrecord/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const patient = await patientModel.findOne({ _id: id });
        // console.log('Patient:', patient);

        if (!patient || !patient.record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // console.log('Record path:', patient.record);

        // Check if the record path is a valid string
        if (typeof patient.record[0] !== 'string') {
            return res.status(500).json({ message: 'Invalid record path', error: 'Record path is not a valid string' });
        }

        const filePath = path.join(__dirname, '../../', patient.record[0]);
        // console.log('File path:', filePath);

        if (fs.existsSync(filePath)) {
            res.download(filePath); // Triggers the file download in the browser
        } else {
            res.status(404).json({ message: 'File not found on server' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching record', error });
    }
});



module.exports = router;