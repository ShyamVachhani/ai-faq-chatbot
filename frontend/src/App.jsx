// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import Signup from './components/Signup';
import Login from './components/Login';

// Placeholder components for the new side panels
const CommonQuestionsPanel = () => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Questions</h3>
        <ul className="space-y-3 text-blue-700">
            <li className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-200">What are your business hours?</li>
            <li className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-200">Where are you located?</li>
            <li className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-200">How can I reset my password?</li>
            <li className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-200">What payment methods do you accept?</li>
            <li className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-200">What is your return policy?</li>
            <li className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors duration-200">How do I track my order?</li>
        </ul>
    </div>
);

function App() {
    const [authData, setAuthData] = useState(() => {
        const storedAuthData = localStorage.getItem('authData');
        return storedAuthData ? JSON.parse(storedAuthData) : null;
    });

    const [showLogin, setShowLogin] = useState(true);

    // New state to manage visibility of side panels
    const [showCommonQuestions, setShowCommonQuestions] = useState(true);
    const [showAdminPanel, setShowAdminPanel] = useState(false); // Admin panel initially hidden

    useEffect(() => {
        if (authData) {
            localStorage.setItem('authData', JSON.stringify(authData));
        } else {
            localStorage.removeItem('authData');
            localStorage.removeItem('chatUserId');
        }
    }, [authData]);

    const handleAuthSuccess = (data) => {
        setAuthData(data);
        localStorage.setItem('chatUserId', data.userId);
    };

    const handleLogout = () => {
        setAuthData(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-inter flex flex-col items-center justify-center p-4">
            {authData ? (
                <div className="w-full max-w-6xl h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"> {/* Wider max-w, height adjusted, flex col */}
                    {/* Top Bar / Header */}
                    <div className="bg-white p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            {/* Bot Avatar (can be replaced with an image later) */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-2 shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900">AI FAQ Assistant</h1>
                                <p className="text-gray-600 mt-1">Ask me anything! I'm here to help with your questions.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={() => setShowCommonQuestions(!showCommonQuestions)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors duration-200 flex items-center gap-1 shadow-sm"
                            >
                                {showCommonQuestions ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Hide Common Questions
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .749 0 1.488.102 2.207.29a3.321 3.321 0 013.04-1.921A10.05 10.05 0 0121.542 12c-1.274 4.057-5.064 7-9.542 7z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Show Common Questions
                                    </>
                                )}
                            </button>

                            {authData.username && (
                                <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
                                    <span>Welcome, {authData.username}!</span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area: Chat + Side Panels */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Chat Window - takes primary space */}
                        <div className={`flex-1 ${showCommonQuestions || showAdminPanel ? 'w-2/3' : 'w-full'}`}> {/* Dynamic width */}
                            <ChatWindow authenticatedUserId={authData.userId} />
                        </div>

                        {/* Side Panels Container - Conditionally rendered */}
                        {(showCommonQuestions || showAdminPanel) && (
                            <div className="w-1/3 bg-gray-100 p-6 space-y-6 overflow-y-auto border-l border-gray-200">
                                {showCommonQuestions && <CommonQuestionsPanel />}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                showLogin ? (
                    <Login onAuthSuccess={handleAuthSuccess} onSwitchToSignup={() => setShowLogin(false)} />
                ) : (
                    <Signup onAuthSuccess={handleAuthSuccess} onSwitchToLogin={() => setShowLogin(true)} />
                )
            )}
        </div>
    );
}

export default App;
