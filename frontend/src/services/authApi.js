// frontend/src/services/authApi.js

const API_BASE_URL = 'http://localhost:5000'; // Ensure this matches your backend port

/**
 * Registers a new user.
 * @param {string} username The username for registration.
 * @param {string} password The password for registration.
 * @returns {Promise<object>} Data containing token, userId, and username on success.
 * @throws {Error} If registration fails.
 */
export const signupUser = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // If response.ok is false, it means an HTTP error (4xx, 5xx) occurred.
            // The backend should send an error message in the JSON data.
            throw new Error(data.message || 'Failed to register user.');
        }

        return data; // Contains { message, token, userId, username }
    } catch (error) {
        console.error('Signup API error:', error);
        throw error; // Re-throw to be handled by the calling component
    }
};

/**
 * Logs in an existing user.
 * @param {string} username The username for login.
 * @param {string} password The password for login.
 * @returns {Promise<object>} Data containing token, userId, and username on success.
 * @throws {Error} If login fails.
 */
export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // If response.ok is false, it means an HTTP error (4xx, 5xx) occurred.
            // The backend should send an error message in the JSON data.
            throw new Error(data.message || 'Failed to log in.');
        }

        return data; // Contains { message, token, userId, username }
    } catch (error) {
        console.error('Login API error:', error);
        throw error; // Re-throw to be handled by the calling component
    }
};
