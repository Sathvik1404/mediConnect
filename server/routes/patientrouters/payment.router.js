const express = require('express');
const axios = require('axios');
const bodyParser = require("body-parser");
const cors = require("cors");
const uniqid = require('uniqid');
const sha256 = require('sha256');
const rateLimit = require('axios-rate-limit');
const axiosRetry = require('axios-retry').default;

const router = express.Router();
const http = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 5000 });

// Initialize axios-retry on the rate-limited instance (http)
axiosRetry(http, { retries: 3 });

// Testing purpose
const PHONEPE_HOST_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
const MERCHANT_ID = 'PGTESTPAYUAT';
const SALT_INDEX = 1;
const SALT_KEY = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';

router.get('/pay', async (req, res) => {
    const payEndpoint = '/pg/v1/pay';
    const merchantTransactionId = uniqid();
    const userId = 1234;

    const payload = {
        "merchantId": MERCHANT_ID,
        "merchantTransactionId": merchantTransactionId,
        "merchantUserId": userId,
        "amount": 500000, //in paise
        "redirectUrl": `http://localhost:5000/redirect-url/${merchantTransactionId}`,
        "redirectMode": "REDIRECT",
        "mobileNumber": "9999999999",
        "paymentInstrument": {
            "type": "PAY_PAGE"
        }
    };

    // SHA256(Base64 encoded payload + “/pg/v1/pay” + salt key) + ### + salt index
    const bufferObj = Buffer.from(JSON.stringify(payload), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");
    const xVerify = sha256(base64EncodedPayload + payEndpoint + SALT_KEY) + "###" + SALT_INDEX;

    const options = {
        method: 'post',
        url: `${PHONEPE_HOST_URL}${payEndpoint}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify
        },
        data: {
            request: base64EncodedPayload
        }
    };

    try {
        // Make the API call using axios
        const response = await http.request(options);

        // Send the response data back to the client
        res.status(200).json({
            success: true,
            message: "Payment request successful",
            data: response.data
        });
    } catch (error) {
        // Handle and send error response to the client
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Payment request failed",
            error: error.message
        });
    }
});

module.exports = router;
