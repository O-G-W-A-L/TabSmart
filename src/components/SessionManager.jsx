import React from 'react';
import { saveSession, restoreSession } from '../utils/chromeUtils';

const SessionManager = () => {
  const handleSave = async () => {
    await saveSession();
    alert('Session saved successfully!');
  };

  const handleRestore = async () => {
    await restoreSession();
    alert('Session restored successfully!');
  };

  return (
    <div className="flex justify-between mb-4">
      <button onClick={handleSave} className="p-2 bg-green-500 text-white rounded">Save Session</button>
      <button onClick={handleRestore} className="p-2 bg-blue-500 text-white rounded">Restore Session</button>
    </div>
  );
};

export default SessionManager;