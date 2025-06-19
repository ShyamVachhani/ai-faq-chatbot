// backend/models/ChatMessage.js
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    userId: {
        // CHANGE TYPE TO STRING
        type: String, // Now accepts strings like "guest-1749991755499"
        required: true, // userId is now required
        // REMOVE 'ref: 'User'' as it's no longer an ObjectId reference
    },
    sender: {
        type: String, // 'user' or 'bot'
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
module.exports = ChatMessage;
