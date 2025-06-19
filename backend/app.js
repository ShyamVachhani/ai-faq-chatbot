// backend/app.js

// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Import chat history utility functions and route handlers
const { saveMessageToDB, getChatHistoryRoute } = require('./controllers/chatHistoryController');

// NEW: Import authentication controller
const authController = require('./controllers/authController');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware Setup ---
// Enable CORS for cross-origin requests
app.use(cors());
// Parse incoming JSON payloads
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        // Exit process if database connection fails
        process.exit(1);
    });

// --- AI API Initialization (Google Gemini) ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- FAQ Data ---
const faqData = `
Q: What services do you offer?
A: We offer web development, mobile app development, and UI/UX design.

Q: How can I contact support?
A: You can reach our support team at support@example.com or call us at +1-800-555-1234.

Q: What are your business hours?
A: We are open Monday to Friday, 9 AM to 5 PM IST, excluding public holidays.

Q: Do you offer free consultations?
A: Yes, we offer a free 30-minute initial consultation for new clients. Please book through our website.

Q: Where are you located?
A: Our main office is located in Tech City, Rajkot, Gujarat, India.

Q: What are your typical project timelines?
A: Small projects usually take 2-4 weeks, medium projects 1-3 months, and large projects 3-6 months. Timelines vary based on complexity.

Q: Do you work with international clients?
A: Yes, we serve clients globally. Our communication is primarily in English, and we use online collaboration tools.

Q: What is your payment schedule?
A: We typically require a 30% upfront payment, 40% midway through the project, and the remaining 30% upon completion.

Q: Can I request changes during the project?
A: Yes, minor changes can be accommodated within the agreed scope. Significant changes may require a change order and affect the timeline/cost.
`;

// --- Chatbot API Endpoint ---
app.post('/api/chat/message', async (req, res) => {
    const { message: userMessage, userId } = req.body;

    if (!userMessage) {
        return res.status(400).json({ message: "Message cannot be empty." });
    }

    const prompt = `You are a friendly and helpful assistant designed to answer questions *strictly based* on the following FAQ data for our business.

  FAQs:
  ${faqData}

  If a user asks a question that is not directly and clearly covered by the provided FAQs, politely let them know that you can only provide information from the FAQs. Suggest they rephrase their question or ask about a topic listed in the FAQs. Do not make up information or answer questions outside the scope of the FAQs. Be concise and always maintain a helpful tone.

  User: ${userMessage}
  `;

    try {
        await saveMessageToDB({ userId, sender: 'user', text: userMessage });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponseText = response.text().trim();

        await saveMessageToDB({ userId, sender: 'bot', text: aiResponseText });

        res.json({ response: aiResponseText });

    } catch (error) {
        console.error("Error communicating with AI API or saving message:", error);
        try {
            await saveMessageToDB({ userId, sender: 'bot', text: `Error: Failed to get response from bot. Please try again. (${error.message})` });
        } catch (saveError) {
            console.error("Failed to save error message:", saveError);
        }
        res.status(500).json({
            message: "Failed to get response from chatbot. Please check backend logs.",
            error: error.message
        });
    }
});

// --- NEW: User Authentication Routes ---
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);

// --- Chat History API Endpoints ---
app.get('/api/chat/history', getChatHistoryRoute);

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
