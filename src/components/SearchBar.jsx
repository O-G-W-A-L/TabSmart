import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <input 
      type="text" 
      placeholder="Search tabs..." 
      onChange={(e) => onSearch(e.target.value)}
      className="w-full p-2 mb-4 border rounded"
    />
  );
};

export default SearchBar;
