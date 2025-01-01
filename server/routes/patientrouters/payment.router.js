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
router.post('/order', async (req, res) => {
    try {
        // Validate request body
        const { amount, currency } = req.body;
        if (!amount || !currency) {
            return res.status(400).json({ message: 'Amount and currency are required.' });
        }

        // Initialize Razorpay instance
        const razorpay = new Razorpay({
            key_id: 'rzp_test_BxN4zyfawxKOr3', // Replace with your Razorpay Key ID
            key_secret: 'v8VVhznJpGfoc8frEX3tViFO', // Replace with your Razorpay Secret Key
        });

        // Options for Razorpay order
        const options = {
            amount: amount * 100, // Amount in smallest currency unit (paise)
            currency: currency || 'INR', // Default currency is INR
            receipt: uniqid(), // Unique identifier for the order
        };

        // Create Razorpay order
        const response = await razorpay.orders.create(options);
        res.status(200).json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Use the router
app.use('/api', router);

// Start the server
const PORT = 3000; // Set your desired port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
