// backend/controllers/chatHistoryController.js
const ChatMessage = require('../models/ChatMessage');

/**
 * Saves a new chat message to the database.
 * This function is now a utility that returns the saved message or throws an error.
 * It does NOT directly handle Express req/res objects.
 * @param {object} messageData - Object containing userId, sender, and text.
 * @returns {Promise<object>} The saved message document.
 */
exports.saveMessageToDB = async (messageData) => {
    try {
        const { userId, sender, text } = messageData;

        if (!userId || !sender || !text) {
            // Throw an error if essential data is missing
            throw new Error('UserId, sender, and text are required to save a message.');
        }

        const newMessage = new ChatMessage({
            userId,
            sender,
            text,
        });

        const savedMessage = await newMessage.save();
        return savedMessage;
    } catch (error) {
        console.error('Error in saveMessageToDB:', error);
        // Re-throw the error to be handled by the caller (the Express route)
        throw error;
    }
};

/**
 * Retrieves chat history for a specific userId from the database.
 * This function is now a utility that returns the history or throws an error.
 * It does NOT directly handle Express req/res objects.
 * @param {string} userId - The ID of the user whose chat history to retrieve.
 * @returns {Promise<Array>} An array of chat message documents.
 */
exports.getChatHistoryFromDB = async (userId) => {
    try {
        let query = {};
        if (userId) { // If userId is provided, filter by it
            query.userId = userId;
        }

        // Fetch messages, sorted by timestamp
        const history = await ChatMessage.find(query).sort({ timestamp: 1 });
        return history;
    } catch (error) {
        console.error('Error in getChatHistoryFromDB:', error);
        // Re-throw the error to be handled by the caller (the Express route)
        throw error;
    }
};

// --- Express Route Handlers (These will still be called by app.js routes) ---
// These functions wrap the utility functions above to handle Express req/res.

exports.saveMessageRoute = async (req, res) => {
    try {
        const savedMessage = await exports.saveMessageToDB(req.body);
        res.status(201).json({ message: 'Message saved successfully', chatMessage: savedMessage });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save message', error: error.message });
    }
};

exports.getChatHistoryRoute = async (req, res) => {
    try {
        const { userId } = req.query;
        const history = await exports.getChatHistoryFromDB(userId);
        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chat history', error: error.message });
    }
};
