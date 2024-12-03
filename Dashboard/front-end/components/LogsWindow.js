import { useState, useEffect, useRef } from 'react';

export default function LogsWindow() {
  const [attackLogs, setAttackLogs] = useState([
    "Attack logs will be displayed here",
  ]);
  const [mlLogs, setMlLogs] = useState([
    "ML status logs will be displayed here",
  ]);
  const [websiteLogs, setWebsiteLogs] = useState([
    "Website status logs will be displayed here",
  ]);

  // Refs for each logs container
  const attackLogsContainerRef = useRef(null);
  const mlLogsContainerRef = useRef(null);
  const websiteLogsContainerRef = useRef(null);

  // State variables to track if the user is at the bottom for each log window
  const [isAttackAtBottom, setIsAttackAtBottom] = useState(true);
  const [isMlAtBottom, setIsMlAtBottom] = useState(true);
  const [isWebsiteAtBottom, setIsWebsiteAtBottom] = useState(true);

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
    }, 2500); // Poll every 2 seconds

    return () => clearInterval(pollAttackStatus);
  }, []);

  // Polling function for ML status
  useEffect(() => {
    const pollMLStatus = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/logs/ML');
        const data = await response.json();
        setMlLogs(prev => [...prev, addTimestamp(`ML Status: ${data.status}`)]);
      } catch (error) {
        console.error('Error fetching ML status:', error);
      }
    }, 2500);

    return () => clearInterval(pollMLStatus);
  }, []);

  // Polling function for website status
  useEffect(() => {
    const pollWebsiteStatus = setInterval(async () => {
      try {
        const response = await fetch('http://localhost:3001/logs/Website');
        const data = await response.json();
        if (data.status !== 'bad') {
          setWebsiteLogs(prev => [...prev, addTimestamp(`Website Status: ${data.status}`)]);
        }
      } catch (error) {
        console.error('Error fetching website status:', error);
      }
    }, 2500);

    return () => clearInterval(pollWebsiteStatus);
  }, []);

  // Function to clear logs
  const clearLogs = (setLogFunction) => {
    setLogFunction(["Logs cleared"]);
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-[95vw] max-w-screen-lg mx-auto">
      {/* Attack Logs Window */}
      <div className="bg-slate-100 text-red-600 p-4 rounded-lg font-mono shadow-lg h-96 relative overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="sticky top-0 bg-slate-100 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Attack Status</h3>
            <button 
              onClick={() => clearLogs(setAttackLogs)}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        </div>
        {/* Logs Section */}
        <div
          className="overflow-y-auto flex-grow"
          ref={attackLogsContainerRef}
        >
          {attackLogs.map((line, index) => (
            <p key={`attack-${index}`} className="whitespace-pre-line text-sm">{line}</p>
          ))}
        </div>
        {/* Static Bottom-Right Text */}
        <div className="text-gray-500 text-xs mt-2 self-end">
          Here are the number of outgoing packets
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
            <p key={`ml-${index}`} className="whitespace-pre-line text-sm">{line}</p>
          ))}
        </div>
        {/* Static Bottom-Right Text */}
        <div className="text-gray-500 text-xs mt-2 self-end">
          Current status of the ML model
        </div>
      </div>

      {/* Website Logs Window */}
      <div className="bg-slate-100 text-green-600 p-4 rounded-lg font-mono shadow-lg h-96 relative overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="sticky top-0 bg-slate-100 z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Website Status</h3>
            <button 
              onClick={() => clearLogs(setWebsiteLogs)}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded"
            >
              Clear
            </button>
          </div>
        </div>
        {/* Logs Section */}
        <div
          className="overflow-y-auto flex-grow"
          ref={websiteLogsContainerRef}
        >
          {websiteLogs.map((line, index) => (
            <p key={`website-${index}`} className="whitespace-pre-line text-sm">{line}</p>
          ))}
        </div>
        {/* Static Bottom-Right Text */}
        <div className="text-gray-500 text-xs mt-2 self-end">
          Here are the number of incoming packets
        </div>
      </div>
    </div>
  );
}

{
  /*         
import { useState, useEffect } from "react";

const predictions = {
  0: "HTTP - FLOOD",
  1: "Normal",
  2: "SYN - FLOOD",
  3: "Smurf",
  4: "TCP - FLOOD",
  5: "UDP - FLOOD",
};

export default function LogsWindow() {
  const [lines, setLines] = useState([
    "Logs are to be displayed here!",
    "This is a simple terminal simulation.",
  ]);

  // Testing
  // const [packetData, setPacketData] = useState([
  //   {
  //     PROTOCOL: "TCP",
  //     PKT_TYPE: 0,
  //     FLAGS: 0,
  //     flags: "A",
  //     NUMBER_OF_PKT: 1,
  //     PKT_RATE: 10.2993924928,
  //     UTILIZATION: 0.0044493376,
  //     session_duration: 0.0970931053,
  //     ttl: 128,
  //     request_rate: 10.2993924928,
  //     PREDICTION: 1,
  //   },
  // ]);
  const [packetData, setPacketData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000");

    socket.onopen = () => {
      console.log("WebSocket is connected. ReadyState:", socket.readyState);
    };

    socket.onmessage = (event) => {
      try {
        console.log("Message received:", event.data);
        const newData = JSON.parse(event.data);
        const data = newData[0];
        setPacketData((prevData) => [...prevData, data]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = (event) => {
      console.log(
        "WebSocket is closed. Code:",
        event.code,
        "Reason:",
        event.reason
      );
    };

    socket.onerror = (error) => {
      console.error("WebSocket encountered an error:", error);
      console.error("WebSocket readyState:", socket.readyState);
    };

    return () => {
      socket.close();
    };
  });

  const addLine = () => {
    setLines((prevLines) => [...prevLines, "New line added!"]);
  };

  return (
    <div>
      <h1>Network Logs</h1>
      <div className="w-[95vw] max-w-screen-lg bg-slate-100 text-green-500 p-4 rounded-lg font-mono shadow-lg overflow-y-auto h-64 mx-auto">
        {packetData.length > 0 ? (
          <ul>
            {packetData.map((packet, index) => (
              <li
                key={index}
                style={{
                  color: packet.PREDICTION !== 1 ? "red" : "text-green-500",
                }}
              >
                <strong>Packet Type:</strong> {packet.PROTOCOL} |{" "}
                <strong>Flags:</strong> {packet.flags} |{" "}
                <strong>Number of Packets:</strong> {packet.NUMBER_OF_PKT} |{" "}
                <strong>Packet Rate:</strong> {packet.PKT_RATE.toFixed(2)} |{" "}
                <strong>Utilization:</strong> {packet.UTILIZATION.toFixed(2)}% |{" "}
                <strong>Session Duration:</strong>{" "}
                {packet.session_duration.toFixed(2)}s | <strong>TTL:</strong>{" "}
                {packet.ttl} | <strong>Request Rate:</strong>{" "}
                {packet.request_rate.toFixed(2)} | <strong>Prediction:</strong>{" "}
                {predictions[packet.PREDICTION]}
              </li>
            ))}
          </ul>
        ) : (
          <p>No network activity detected</p>
        )}
      </div>
    </div>
  );
} */
}
