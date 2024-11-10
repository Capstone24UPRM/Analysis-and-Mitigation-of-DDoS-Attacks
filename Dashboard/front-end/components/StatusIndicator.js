import React from 'react';

const StatusIndicator = ({ status, label, labelStyle }) => {
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
    <div className="flex flex-row items-center">
      <div /*indicator*/ className={`w-4 h-4 rounded-full ${getStatusColor(status)}`}></div> 
      <span style={labelStyle} className="text-white ml-2">{label}</span>
    </div>
  );
};

export default StatusIndicator;