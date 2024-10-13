import React from 'react';

const TabSorter = ({ onSort }) => {
  return (
    <div className="mb-4">
      <label className="mr-2">Sort tabs:</label>
      <select onChange={(e) => onSort(e.target.value)} className="p-2 border rounded">
        <option value="title">By Title</option>
        <option value="domain">By Domain</option>
        <option value="recent">Most Recently Used</option>
        <option value="opened">Time Opened</option>
      </select>
    </div>
  );
};

export default TabSorter;
