// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../services/authApi';

const Login = ({ onAuthSuccess, onSwitchToSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await loginUser(username, password);
            onAuthSuccess(data);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred during login.');
            console.error('Login form error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4 font-inter">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">Welcome Back!</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-sm">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline ml-2">{error}</span>
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
                            placeholder="Your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
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
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide transform hover:scale-[1.01]"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </button>
                </form>
                <p className="text-center text-gray-600 text-sm mt-8">
                    Don't have an account?{' '}
                    <button
                        onClick={onSwitchToSignup}
                        className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none transition-colors duration-200"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
