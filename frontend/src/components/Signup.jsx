// frontend/src/components/Signup.jsx
import React, { useState } from 'react';
import { signupUser } from '../services/authApi';

const Signup = ({ onAuthSuccess, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        try {
            const data = await signupUser(username, password);
            setSuccessMessage(data.message || 'Registration successful! Redirecting to login...');
            setTimeout(() => {
                onSwitchToLogin(); // Switch to login form after successful signup
            }, 2000); // Increased delay for better user experience
        } catch (err) {
            setError(err.message || 'An unexpected error occurred during signup.');
            console.error('Signup form error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4 font-inter">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">Create Account</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-sm">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 text-sm">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline ml-2">{successMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-base font-semibold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 text-base"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            minLength="3"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-base font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 text-base"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide transform hover:scale-[1.01]"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-8">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none transition-colors duration-200"
                    >
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
