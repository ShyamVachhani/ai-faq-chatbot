// frontend/src/services/chatApi.js

const API_BASE_URL = 'http://localhost:5000'; // Ensure this matches your backend port

/**
 * Sends a message to the chatbot backend.
 * @param {string} message The user's message.
 * @param {string} userId The ID of the user (or session).
 * @returns {Promise<string>} The AI's response text.
 */
export const sendMessageToBot = async (message, userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Include userId in the request body
            body: JSON.stringify({ message, userId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get bot response.');
        }

        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Error sending message to bot:', error);
        throw error; // Re-throw to be caught by the calling component
    }
};

/**
 * Fetches chat history for a specific user ID.
 * @param {string} userId The ID of the user (or session).
 * @returns {Promise<Array>} An array of chat messages.
 */
export const fetchChatHistory = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history?userId=${userId}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch chat history.');
        }

        const data = await response.json();
        // Map the fetched history to match the frontend's message structure
        return data.history.map(msg => ({
            id: msg._id, // Use MongoDB _id as the unique key
            text: msg.text,
            sender: msg.sender,
            timestamp: msg.timestamp // Keep timestamp if you want to display it or sort
        }));
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
};

