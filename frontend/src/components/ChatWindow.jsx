// frontend/src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToBot, fetchChatHistory } from '../services/chatApi';

// ChatWindow now accepts an authenticatedUserId prop
const ChatWindow = ({ authenticatedUserId }) => {
    // Determine the userId to use: authenticatedUserId if provided, otherwise fallback to localStorage guest ID
    const currentUserId = authenticatedUserId || localStorage.getItem('chatUserId');

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatEndRef = useRef(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // Effect to scroll to the bottom when messages update
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Effect to load chat history when the component mounts or userId changes
    useEffect(() => {
        const loadHistory = async () => {
            if (!currentUserId) { // Don't try to load history if no userId is available yet
                setIsLoadingHistory(false);
                setMessages([
                    { id: 'welcome-msg', text: "Hi! I'm your AI assistant. How can I help you today?", sender: 'bot' },
                ]);
                return;
            }

            try {
                const history = await fetchChatHistory(currentUserId);
                // Add the initial welcome message only if there's no history or it's a new session
                if (history.length === 0) {
                    setMessages([
                        { id: 'welcome-msg', text: "Hi! I'm your AI assistant. How can I help you today?", sender: 'bot' },
                    ]);
                } else {
                    setMessages(history);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
                // Display an error message if history loading fails
                setMessages([
                    { id: 'error-history', text: "Error loading chat history. Please refresh the page.", sender: 'bot', error: true },
                ]);
            } finally {
                setIsLoadingHistory(false); // Done loading history
            }
        };

        loadHistory();
    }, [currentUserId]); // Dependency on currentUserId to reload if it changes


    const handleSendMessage = async () => {
        if (inputMessage.trim() === '') return;
        if (!currentUserId) { // Prevent sending if no user ID
            console.error("Cannot send message: No user ID available.");
            setMessages((prev) => [...prev, { id: Date.now(), text: "Error: No user session found. Please refresh or log in.", sender: 'bot', error: true }]);
            return;
        }

        // Retrieve username from localStorage for display
        const loggedInUsername = JSON.parse(localStorage.getItem('authData'))?.username || 'You';
        const userMessage = { id: Date.now(), text: inputMessage, sender: 'user', username: loggedInUsername, timestamp: new Date() }; // Add timestamp and username
        const messageToSend = inputMessage;
        setInputMessage(''); // Clear input immediately

        // Add user message to display
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        // Add a "Bot is typing..." indicator
        const typingIndicatorId = Date.now() + 1;
        setMessages((prevMessages) => [...prevMessages, { id: typingIndicatorId, text: 'Bot is typing...', sender: 'bot', isTyping: true, timestamp: new Date() }]); // Add timestamp

        // Scroll to the typing indicator
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

        try {
            // Pass the currentUserId to the sendMessageToBot function
            const aiResponseText = await sendMessageToBot(messageToSend, currentUserId);

            // Remove the typing indicator and add the actual AI response
            setMessages((prevMessages) => {
                const updatedMessages = prevMessages.filter(msg => msg.id !== typingIndicatorId);
                // Ensure the bot's response also gets a timestamp and sender label
                return [...updatedMessages, { id: Date.now() + 2, text: aiResponseText, sender: 'bot', username: 'Bot', timestamp: new Date() }];
            });

        } catch (error) {
            console.error("Failed to get AI response:", error);
            // Remove typing indicator and show an error message
            setMessages((prevMessages) => {
                const updatedMessages = prevMessages.filter(msg => msg.id !== typingIndicatorId);
                // Ensure the error message also gets a timestamp and sender label
                return [...updatedMessages, { id: Date.now() + 2, text: "Error: Could not get a response from the bot. Please try again.", sender: 'bot', error: true, username: 'Bot', timestamp: new Date() }];
            });
        } finally {
            // Ensure we scroll to the bottom after the final message (whether success or error)
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // New function to clear chat history in the UI
    const handleClearChat = () => {
        setMessages([
            { id: 'welcome-msg', text: "Chat cleared! I'm your AI FAQ bot. Ask me anything about our services!", sender: 'bot' },
        ]);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-b-3xl"> {/* Removed padding and centering, now controlled by App.jsx */}

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100"> {/* Increased padding and space-y, added scrollbar */}
                {isLoadingHistory ? (
                    <div className="text-center text-gray-500 py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                        Loading chat history...
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-start ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Bot Avatar - only for bot messages */}
                            {msg.sender === 'bot' && !msg.isTyping && (
                                <div className="flex-shrink-0 mr-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-2 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            )}
                            {/* User Avatar - simple circle, could be customized */}
                            {msg.sender === 'user' && (
                                <div className="flex-shrink-0 ml-3 bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center text-gray-600 font-semibold text-sm">
                                    {/* Display first letter of username or 'Y' for You */}
                                    {(JSON.parse(localStorage.getItem('authData'))?.username || 'You').charAt(0).toUpperCase()}
                                </div>
                            )}

                            <div
                                className={`max-w-[70%] p-4 rounded-xl shadow-md transition-all duration-300 ${ // More rounded, slightly larger padding
                                    msg.sender === 'user'
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-bl-none' // Gradient for user, no left-bottom corner
                                        : msg.error // Check if this message is an error
                                            ? 'bg-red-200 text-red-800 rounded-br-none' // Error style
                                            : 'bg-gradient-to-r from-purple-100 to-indigo-100 text-gray-800 rounded-br-none' // Gradient for bot, no right-bottom corner
                                } ${msg.isTyping ? 'animate-pulse' : ''}`}
                            >
                                {/* Display sender name */}
                                {!msg.isTyping && ( // Don't show sender name for typing indicator
                                    <div className={`text-xs mb-1 font-semibold ${msg.sender === 'user' ? 'text-blue-100' : 'text-indigo-600'}`}>
                                        {msg.sender === 'user' ? (JSON.parse(localStorage.getItem('authData'))?.username || 'You') : 'Bot'}
                                    </div>
                                )}

                                {/* Display message text or typing animation */}
                                {msg.isTyping ? (
                                    <div className="flex items-center space-x-1 text-gray-600">
                                        <span>Typing</span>
                                        <span className="animate-bounce delay-75">.</span>
                                        <span className="animate-bounce delay-150">.</span>
                                        <span className="animate-bounce delay-200">.</span>
                                    </div>
                                ) : (
                                    msg.text
                                )}
                                {/* Display timestamp and like/dislike buttons */}
                                {msg.timestamp && !msg.isTyping && (
                                    <div className="flex justify-between items-center mt-2 text-xs">
                    <span className={`${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Show only time */}
                    </span>
                                        {msg.sender === 'bot' && ( // Only show for bot messages
                                            <div className="flex items-center gap-2">
                                                <button className="text-gray-500 hover:text-green-500 transition-colors duration-150">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 11-3 0v-6zM6 10.333v5.433a2.5 2.5 0 001.077 2.008l3.774 2.176a1 1 0 001.442-.894V2.667a1 1 0 00-1.442-.894L7.077 3.825A2.5 2.5 0 006 5.833v4.5z" />
                                                    </svg>
                                                </button>
                                                <button className="text-gray-500 hover:text-red-500 transition-colors duration-150">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 11-3 0v-6zM6 10.333v5.433a2.5 2.5 0 001.077 2.008l3.774 2.176a1 1 0 001.442-.894V2.667a1 1 0 00-1.442-.894L7.077 3.825A2.5 2.5 0 006 5.833v4.5z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={chatEndRef} /> {/* Reference for scrolling */}
            </div>

            {/* Message Input Area and Action Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 shadow-inner rounded-b-3xl"> {/* Added rounded-b-3xl */}
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border-2 border-blue-300 rounded-full focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                />
                {/* Send Button with Icon */}
                <button
                    onClick={handleSendMessage}
                    className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-90 flex items-center justify-center"
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-45 -mt-1 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
                {/* Clear Chat Button */}
                <button
                    onClick={handleClearChat}
                    className="flex-shrink-0 px-4 py-3 bg-gray-300 text-gray-700 rounded-full shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 active:scale-95"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
