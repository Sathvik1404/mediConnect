const hospitalModel = require('../../models/hospital/hospital.model')
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
    const { name, email, password, mobile, location } = req.body;
    try {
        const hash = await bcrypt.hash(password, 12);
        await hospitalModel.create({ name, email, password: hash, mobile, location })
            .then(user => res.json({ success: true }))
            .catch(err => res.json(err))
    } catch (err) {
        console.error('Signup error: ', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hospital = await hospitalModel.findOne({ email });
        if (!hospital) {
            return res.status(404).json({ error: 'No record exists' });
        }
        const isPassowrdValid = await bcrypt.compare(password, hospital.password);
        if (!isPassowrdValid) {
            return res.status(401).json({ error: 'The password is incorrect' });
        }
        const token = jwt.sign({ email: hospital.email }, "jwt-secret-key", { expiresIn: '1h' });
        return res.status(200).json({ status: 'Success', token, hospital, role: "hospital" });
    } catch (err) {
        console.log('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;