import React from 'react';

const StatusIndicator = ({ status, label }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'bad':
        return 'bg-red-500';
      case 'deteriorated':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`w-8 h-8 rounded-full ${getStatusColor(status)}`}></div>
      <span className="text-white mt-2">{label}</span>
    </div>
  );
};

export default StatusIndicator;