const express = require('express');
const Razorpay = require('razorpay');
const bodyParser = require('body-parser');
const cors = require('cors');
const uniqid = require('uniqid');

const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Razorpay Order Route
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

router.get('/create-order', async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // Razorpay works in paise (₹1 = 100)
        currency: 'INR',
        receipt: 'receipt_order_' + Math.random().toString(36).substr(2, 9),
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating order");
    }
});


// Use the router
app.use('/api', router);

// Start the server
const PORT = 3000; // Set your desired port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
