const Message = require('../models/message/message.model');
const express = require('express');
const router = express.Router();
router.post('/messages', async (req, res) => {
    try {
        const { doctorId, patientId, message, doctorName, patientName } = req.body;
        const newMessage = new Message({ doctorId, patientId, message, doctorName, patientName });
        await newMessage.save();
        res.status(201).json({ message: "Message sent!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to send message" });
    }
});
router.get('/messages', async (req, res) => {
    try {
        const data = await Message.find({}, { __v: 0 });
        if (data) {
            res.status(200).json(data)
        } else {
            res.status(400).json({ message: "There was an error in retrieving the messages" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.put('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;
        const updated = await Message.findByIdAndUpdate(
            id,
            { $set: { reply: reply || "You need to eat properly and take water" } },
            { new: true }
        );
        if (updated) {
            res.status(200).json({ message: "Reply is sent", data: updated })
        } else {
            res.status(400).json({ message: "There was an error in adding the reply" })
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
module.exports = router;