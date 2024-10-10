import React from 'react';

const PinToggle = ({ isPinned, onToggle }) => {
  return (
    <button 
      className={`p-2 rounded-full transition-colors duration-200 ${isPinned ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-blue-400 hover:bg-blue-600'}`}
      onClick={onToggle}
      title={isPinned ? 'Unpin popup' : 'Pin popup'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
};

export default PinToggle;