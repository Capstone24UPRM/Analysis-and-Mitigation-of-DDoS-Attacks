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
        {/* <button
        onClick={addLine}
        className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-lg"
      >
        Add Line
      </button> */}
      </div>
    </div>
  );
}
