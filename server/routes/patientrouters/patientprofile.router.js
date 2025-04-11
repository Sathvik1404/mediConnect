const patientModel = require('../../models/patient/patient.model')
// const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Upload = require('./upload')

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

router.get('/', async (req, res) => {
    const patiets = await patientModel.find({})
    res.json(patiets)
})

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
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    // Allowed file extensions
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
}).single('record');

router.put('/uploadrecord/:id', upload, async (req, res) => {
    const { id } = req.params;
    try {
        console.log(req.file);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const uploadResult = await Upload(req.file.path);
        console.log(uploadResult);

        const patient = await patientModel.findOneAndUpdate(
            { _id: id },
            { record: uploadResult.secure_url },
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json({
            message: 'File uploaded successfully',
            filePath: uploadResult.secure_url
        });
    } catch (error) {
        console.error('Upload error:', error);
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

        // console.log(patient.record)
        // res.download(patient.record[0])

        return res.status(200).json({ fileUrl: patient.record });

        // const filePath = path.join(__dirname, '../../', patient.record[0]);
        // // console.log('File path:', filePath);

        // if (fs.existsSync(filePath)) {
        //     res.download(filePath); // Triggers the file download in the browser
        // } else {
        //     res.status(404).json({ message: 'File not found on server' });
        // }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching record', error });
    }
});



module.exports = router;