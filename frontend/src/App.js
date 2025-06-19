import React from 'react';
import './output.generated.css';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <header className="bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">
                    Hello, Tailwind CSS!
                </h1>
                <p className="text-gray-700 text-lg">
                    If you see this styled, Tailwind is working!
                </p>
                <button className="mt-6 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
                    Click Me
                </button>
            </header>
        </div>
    );
}

export default App;