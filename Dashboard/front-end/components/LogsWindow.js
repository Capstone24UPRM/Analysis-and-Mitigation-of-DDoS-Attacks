import { useState, useEffect, useRef } from 'react';

export default function LogsWindow({sourceIpLogs, destinationIpLogs, medianPrediction, mlStatus}) {
  const [attackLogs, setAttackLogs] = useState([
    "Attack logs will be displayed here",
  ]);
  const [mlLogs, setMlLogs] = useState([
    "ML status logs will be displayed here", "Scanning for attacks..."
  ]);
  const [websiteLogs, setWebsiteLogs] = useState([
    "Website status logs will be displayed here",
  ]);

  const [medianSourceRate, setMedianSourceRate] = useState(null);
  const [medianDestinationRate, setMedianDestinationRate] = useState(null);

    // Refs for each logs container
    const attackLogsContainerRef = useRef(null);
    const mlLogsContainerRef = useRef(null);
    const websiteLogsContainerRef = useRef(null);
  
    // State variables to track if the user is at the bottom for each log window
    const [isAttackAtBottom, setIsAttackAtBottom] = useState(true);
    const [isMlAtBottom, setIsMlAtBottom] = useState(true);
    const [isWebsiteAtBottom, setIsWebsiteAtBottom] = useState(true);

    // Helper function to calculate the median
    const calculateMedian = (logs) => {
      if (logs.length < 5) return null; // Not enough data to calculate median
      // Extract the last 5 records
      const lastFiveLogs = logs.slice(-5);
  
      // Extract packet rates and sort them
      const packetRates = lastFiveLogs.map(log => log.PKT_RATE).sort((a, b) => a - b);
  
      // Calculate the median
      return packetRates.length % 2 === 0
        ? (packetRates[packetRates.length / 2 - 1] + packetRates[packetRates.length / 2]) / 2
        : packetRates[Math.floor(packetRates.length / 2)];
    };
  
    // Calculate medians whenever logs change
    useEffect(() => {
      setMedianSourceRate(calculateMedian(sourceIpLogs));
    }, [sourceIpLogs]);
  
    useEffect(() => {
      setMedianDestinationRate(calculateMedian(destinationIpLogs));
    }, [destinationIpLogs]);

  // Function to add timestamp to logs
  const addTimestamp = (message) => {
    const now = new Date();
    return `[${now.toLocaleTimeString()}] ${message}`;
  };

  // Scroll handling and auto-scroll for attackLogs
  const handleAttackScroll = () => {
    const el = attackLogsContainerRef.current;
    if (el) {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isUserAtBottom = scrollHeight - scrollTop - clientHeight < 5;
      setIsAttackAtBottom(isUserAtBottom);
    }
  };

  useEffect(() => {
    const el = attackLogsContainerRef.current;
    if (el) {
      el.addEventListener('scroll', handleAttackScroll);
      handleAttackScroll();
      return () => {
        el.removeEventListener('scroll', handleAttackScroll);
      };
    }
  }, []);

  useEffect(() => {
    const el = attackLogsContainerRef.current;
    if (el && isAttackAtBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [attackLogs, isAttackAtBottom]);

  // Scroll handling and auto-scroll for mlLogs
  const handleMlScroll = () => {
    const el = mlLogsContainerRef.current;
    if (el) {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isUserAtBottom = scrollHeight - scrollTop - clientHeight < 5;
      setIsMlAtBottom(isUserAtBottom);
    }
  };

  useEffect(() => {
    const el = mlLogsContainerRef.current;
    if (el) {
      el.addEventListener('scroll', handleMlScroll);
      handleMlScroll();
      return () => {
        el.removeEventListener('scroll', handleMlScroll);
      };
    }
  }, []);

  useEffect(() => {
    const el = mlLogsContainerRef.current;
    if (el && isMlAtBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [mlLogs, isMlAtBottom]);

  // Scroll handling and auto-scroll for websiteLogs
  const handleWebsiteScroll = () => {
    const el = websiteLogsContainerRef.current;
    if (el) {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const isUserAtBottom = scrollHeight - scrollTop - clientHeight < 5;
      setIsWebsiteAtBottom(isUserAtBottom);
    }
  };

  useEffect(() => {
    const el = websiteLogsContainerRef.current;
    if (el) {
      el.addEventListener('scroll', handleWebsiteScroll);
      handleWebsiteScroll();
      return () => {
        el.removeEventListener('scroll', handleWebsiteScroll);
      };
    }
  }, []);

  useEffect(() => {
    const el = websiteLogsContainerRef.current;
    if (el && isWebsiteAtBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [websiteLogs, isWebsiteAtBottom]);

  // Polling function for ML status
  // useEffect(() => {
  //   const pollMLStatus = setInterval(async () => {
  //     try {
  //       const response = await fetch('http://localhost:3001/logs/ML');
  //       const data = await response.json();
  //       setMlLogs(prev => [...prev, addTimestamp(mlStatus)]);
  //     } catch (error) {
  //       console.error('Error fetching ML status:', error);
  //     }
  //   }, 2500);

  //   return () => clearInterval(pollMLStatus);
  // }, []);
  useEffect(() => {
    
      try {
        if (mlStatus === null) {
          return;
        }
        setMlLogs(prev => [...prev,addTimestamp(mlStatus)]);
        console.log("Logs", mlLogs)
      } catch (error) {
        console.error('Error fetching ML status:', error);
      }
  }, [mlStatus]);


  // Function to clear logs and reset to the last log in the list.
  const clearLogs = (setLogFunction) => {
    setLogFunction([mlLogs[mlLogs.length - 1]]);
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-[95vw] max-w-screen-lg mx-auto">
      {/* Attack Logs Window */}
      <div className="bg-slate-100 text-red-600 p-4 rounded-lg font-mono shadow-lg h-96 relative overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="sticky top-0 bg-slate-100 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Outgoing Traffic</h3>
          </div>
        </div>
        {/* Logs Section */}
        <div
          className="overflow-y-auto flex-grow"
          ref={attackLogsContainerRef}
        >
          {sourceIpLogs && sourceIpLogs.length > 5 ? (
            sourceIpLogs.slice(-5).map((log, index) => (
              <div key={`destination-${index}`}>
                <p className="whitespace-pre-line text-xs">
                {addTimestamp("")}
                  SRC: {log.SRC_IP} DST: {log.DST_IP}, Rate: {log.PKT_RATE}
                </p>
                {index < 4 && <hr className="my-2 border-gray-300" />} 
                {/* Add line except after the last item */}
              </div>
            ))
          ) : (
            <p className='text-sm'>Outgoing traffic will be displayed here</p>
          )}

        </div>
        {/* Static Bottom-Right Text */}
        <div className="text-gray-500 text-xs mt-2 self-end">
          Outgoing Packet Rate (s): {medianSourceRate !== null && 
    medianSourceRate.toFixed(2)
  }
        </div>
      </div>

      {/* ML Logs Window */}
      <div className="bg-slate-100 text-blue-600 p-4 rounded-lg font-mono shadow-lg h-96 relative overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="sticky top-0 bg-slate-100 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">ML Status</h3>
            <button 
              onClick={() => clearLogs(setMlLogs)}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        </div>
        {/* Logs Section */}
        <div
          className="overflow-y-auto flex-grow"
          ref={mlLogsContainerRef}
        >
        {mlLogs.map((line, index) => (
          <div key={`ml-${index}`}>
            <p className="whitespace-pre-line text-sm">{line}</p>
            {index < mlLogs.length - 1 && <hr className="my-2 border-gray-300" />} {/* Add line except after the last item */}
          </div>
        ))}
        </div>
        {/* Static Bottom-Right Text */}
        <div className="text-gray-500 text-xs mt-2 self-end">
        Prediction: {medianPrediction}
        </div>
      </div>

      {/* Website Logs Window */}
      <div className="bg-slate-100 text-green-600 p-4 rounded-lg font-mono shadow-lg h-96 relative overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="sticky top-0 bg-slate-100 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Website Incoming Traffic</h3>
          </div>
        </div>
        {/* Logs Section */}
        <div
          className="overflow-y-auto flex-grow"
          ref={websiteLogsContainerRef}
        >
          {destinationIpLogs && destinationIpLogs.length > 5 ? (
            destinationIpLogs.slice(-5).map((log, index) => (
              <div key={`destination-${index}`}>
                <p className="whitespace-pre-line text-xs">
                {addTimestamp("")}
                  SRC: {log.SRC_IP} DST: {log.DST_IP}, Rate: {log.PKT_RATE}
                </p>
                {index < 4 && <hr className="my-2 border-gray-300" />} {/* Add line except after the last item */}
              </div>
            ))
          ) : (
            <p className='text-sm'>Incoming traffic will be displayed here</p>
          )}
        </div>
        {/* Static Bottom-Right Text */}
        <div className="text-gray-500 text-xs mt-2 self-end">
          Incoming Packet Rate (s):   {medianDestinationRate !== null && 
    medianDestinationRate.toFixed(2)
  }
        </div>
      </div>
    </div>
  );
}
