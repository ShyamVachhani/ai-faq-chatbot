// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import your User model

// Secret key for JWTs - IMPORTANT: Use a strong, random key in production!
// For development, you can put it directly here, but for production,
// it should be in your .env file (e.g., process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeythatshouldbeverylongandrandom';

// User Registration (Signup)
exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User with that username already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt

        // Create new user
        user = new User({
            username,
            password: hashedPassword, // Store the hashed password
        });

        await user.save(); // Save the new user to the database

        // Generate JWT token (optional, could also be done on login only)
        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(201).json({
            message: 'User registered successfully!',
            token, // Send token back
            userId: user._id, // Send user ID for frontend
            username: user.username
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            message: 'Logged in successfully!',
            token, // Send token back
            userId: user._id, // Send user ID for frontend
            username: user.username
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
};
