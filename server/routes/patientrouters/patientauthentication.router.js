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

router.post('/signup', async (req, res) => {
    const { name, email, password, age, mobile, gender } = req.body;

    try {
        // Check if a user with the same email already exists
        const existingUser = await patientModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, 12);

        // Create the new user
        await patientModel.create({ name, email, password: hash, age, gender, mobile })
            .then(user => res.json({ success: true }))
            .catch(err => res.status(500).json({ error: 'Failed to create user' }));

    } catch (err) {
        console.error('Signup error: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const patient = await patientModel.findOne({ email });
        if (!patient) {
            return res.status(404).json({ error: 'No record exists' });
        }
        const isPassowrdValid = await bcrypt.compare(password, patient.password);
        if (!isPassowrdValid) {
            return res.status(401).json({ error: 'The password is incorrect' });
        }
        const token = jwt.sign({ email: patient.email }, "jwt-secret-key", { expiresIn: '1h' });
        return res.status(200).json({ status: 'Success', token, patient });
    } catch (err) {
        console.log('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;