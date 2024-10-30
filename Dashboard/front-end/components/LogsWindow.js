import { useState } from 'react';

export default function LogsWindow() {
  const [lines, setLines] = useState([
    'Logs are to be displayed here!',
    'This is a simple terminal simulation.'
  ]);

  const addLine = () => {
    setLines((prevLines) => [...prevLines, 'New line added!']);
  };

  return (
    <div className="w-[95vw] max-w-screen-lg bg-slate-100 text-green-500 p-4 rounded-lg font-mono shadow-lg overflow-y-auto h-64 mx-auto">
      {lines.map((line, index) => (
        <p key={index} className="whitespace-pre-line">{line}</p>
      ))}
      <button
        onClick={addLine}
        className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg"
      >
        Add Line
      </button>
    </div>
  );
}
