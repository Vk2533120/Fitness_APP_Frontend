// frontend/src/components/shared/MessageDisplay.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext'; // To get clearContextMessage

function MessageDisplay() {
  const { message, isError, clearContextMessage } = useAuth();

  if (!message) {
    return null; // Don't render if no message
  }

  const bgColor = isError ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg text-white ${bgColor} z-50 flex items-center justify-between min-w-[300px]`}>
      <p className="mr-4">{message}</p>
      <button
        onClick={clearContextMessage}
        className="text-white text-xl font-bold ml-auto p-1 leading-none hover:text-gray-200"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
}

export default MessageDisplay;