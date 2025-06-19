// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures usernames are unique
        trim: true,   // Removes leading/trailing whitespace
        minlength: 3, // Minimum length for username
    },
    password: {
        type: String,
        required: true,
        minlength: 6, // Minimum length for password (bcrypt will hash it)
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;