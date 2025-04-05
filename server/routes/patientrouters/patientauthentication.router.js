const patientModel = require('../../models/patient/patient.model')
// const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');

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
    // const otp = sessionStorage.getItem('otp')
    // // Create a transporter using Gmail
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'srikarmarikanti@gmail.com', // Your Gmail address
    //         pass: 'oyty yzub gpmv xvor',    // Your App Password
    //     },
    // });

    // // Set up email options
    // const mailOptions = {
    //     from: 'srikarmarikanti@gmail.com', // Sender address
    //     to: email, // Recipient address
    //     subject: 'Test Email from Nodemailer', // Subject
    //     text: 'Hello, this is a test email sent using Nodemailer with Gmail!', // Plain text body
    //     html: `<b>${otp}</b>`, // HTML body
    // };

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

        // Send the email
        // await transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         return console.error('Error:', error);
        //     }
        //     console.log('Email sent:', info.response);
        // });

        return res.status(200).json({ status: 'Success', token, patient });
    } catch (err) {
        console.log('Login error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getKey', async (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID })
})
router.post('/create-order', async (req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET_ID,
    });
    try {
        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1,
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})


module.exports = router;