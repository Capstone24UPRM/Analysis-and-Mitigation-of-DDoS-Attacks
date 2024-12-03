import { useState, useEffect } from "react";

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

  // Function to add timestamp to logs
  const addTimestamp = (message) => {
    const now = new Date();
    return `[${now.toLocaleTimeString()}] ${message}`;
  };

  // Polling function for attack status
  // useEffect(() => {
  //   const pollAttackStatus = setInterval(async () => {
  //     try {
  //       const response = await fetch('http://localhost:3001/logs/Attack');
  //       const data = await response.json();
  //       if (data.status !== 'bad') {
  //         setAttackLogs(prev => [...prev, addTimestamp(`Attack Status: ${data.status}`)]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching attack status:', error);
  //     }
  //   }, 500); // Poll every 0.5 seconds

  //   return () => clearInterval(pollAttackStatus);
  // }, []);

  // // Polling function for ML status
  // useEffect(() => {
  //   const pollMLStatus = setInterval(async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/logs/ML');
  //       const data = await response.json();
  //       setMlLogs(prev => [...prev, addTimestamp(`ML Status: ${data.status}`)]);
  //     } catch (error) {
  //       console.error('Error fetching ML status:', error);
  //     }
  //   }, 500);

  //   return () => clearInterval(pollMLStatus);
  // }, []);

  // // Polling function for website status
  // useEffect(() => {
  //   const pollWebsiteStatus = setInterval(async () => {
  //     try {
  //       const response = await fetch('http://localhost:3001/logs/website');
  //       const data = await response.json();
  //       if (data.status !== 'bad') {
  //         setWebsiteLogs(prev => [...prev, addTimestamp(`Website Status: ${data.status}`)]);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching website status:', error);
  //     }
  //   }, 500);

  //   return () => clearInterval(pollWebsiteStatus);
  // }, []);

  // Optional: Function to clear logs
  const clearLogs = (setLogFunction) => {
    setLogFunction(["Logs cleared"]);
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
          <p key={`attack-${index}`} className="whitespace-pre-line text-sm">
            {line}
          </p>
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
          <p key={`ml-${index}`} className="whitespace-pre-line text-sm">
            {line}
          </p>
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
          <p key={`website-${index}`} className="whitespace-pre-line text-sm">
            {line}
          </p>
        ))}
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
