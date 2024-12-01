import { useState, useEffect } from 'react';

export default function LogsWindow() {
  const [attackLogs, setAttackLogs] = useState(['Attack logs will be displayed here']);
  const [mlLogs, setMlLogs] = useState(['ML status logs will be displayed here']);
  const [websiteLogs, setWebsiteLogs] = useState(['Website status logs will be displayed here']);

  // Function to add timestamp to logs
  const addTimestamp = (message) => {
    const now = new Date();
    return `[${now.toLocaleTimeString()}] ${message}`;
  };

  // Polling function for attack status
  useEffect(() => {
    const pollAttackStatus = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/logs/Attack');
        const data = await response.json();
        if (data.status !== 'bad') {
          setAttackLogs(prev => [...prev, addTimestamp(`Attack Status: ${data.status}`)]);
        }
      } catch (error) {
        console.error('Error fetching attack status:', error);
      }
    }, 500); // Poll every 0.5 seconds

    return () => clearInterval(pollAttackStatus);
  }, []);

  // Polling function for ML status
  useEffect(() => {
    const pollMLStatus = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:5000/logs/ML');
        const data = await response.json();
        setMlLogs(prev => [...prev, addTimestamp(`ML Status: ${data.status}`)]);
      } catch (error) {
        console.error('Error fetching ML status:', error);
      }
    }, 500);

    return () => clearInterval(pollMLStatus);
  }, []);

  // Polling function for website status
  useEffect(() => {
    const pollWebsiteStatus = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/logs/website');
        const data = await response.json();
        if (data.status !== 'bad') {
          setWebsiteLogs(prev => [...prev, addTimestamp(`Website Status: ${data.status}`)]);
        }
      } catch (error) {
        console.error('Error fetching website status:', error);
      }
    }, 500);

    return () => clearInterval(pollWebsiteStatus);
  }, []);

  // Optional: Function to clear logs
  const clearLogs = (setLogFunction) => {
    setLogFunction(['Logs cleared']);
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-[95vw] max-w-screen-lg mx-auto">
      {/* Attack Logs Window */}
      <div className="bg-slate-100 text-red-600 p-4 rounded-lg font-mono shadow-lg overflow-y-auto h-64">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Attack Status</h3>
          <button 
            onClick={() => clearLogs(setAttackLogs)}
            className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
        {attackLogs.map((line, index) => (
          <p key={`attack-${index}`} className="whitespace-pre-line text-sm">{line}</p>
        ))}
      </div>

      {/* ML Logs Window */}
      <div className="bg-slate-100 text-blue-600 p-4 rounded-lg font-mono shadow-lg overflow-y-auto h-64">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">ML Status</h3>
          <button 
            onClick={() => clearLogs(setMlLogs)}
            className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
        {mlLogs.map((line, index) => (
          <p key={`ml-${index}`} className="whitespace-pre-line text-sm">{line}</p>
        ))}
      </div>

      {/* Website Logs Window */}
      <div className="bg-slate-100 text-green-600 p-4 rounded-lg font-mono shadow-lg overflow-y-auto h-64">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">Website Status</h3>
          <button 
            onClick={() => clearLogs(setWebsiteLogs)}
            className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
          >
            Clear
          </button>
        </div>
        {websiteLogs.map((line, index) => (
          <p key={`website-${index}`} className="whitespace-pre-line text-sm">{line}</p>
        ))}
      </div>
    </div>
  );
}