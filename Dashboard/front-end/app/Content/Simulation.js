import React, { useState, useEffect } from "react";
import axios from "axios";
import Selector from "../../components/SimulationSelector";
import ControlButtons from "../../components/ControlButtons";
import StatusIndicator from "../../components/StatusIndicator";
import Setup from "@/components/Setup";
import LogsWindow from "@/components/LogsWindow";

export default function Simulation() {
  const [simulation, setSimulation] = useState("");
  const [mitigationStatus, setMitigationStatus] = useState("bad");
  const [attackStatus, setAttackStatus] = useState("bad");
  const [websiteStatus, setWebsiteStatus] = useState("bad");
  const [backendStatus, setBackendStatus] = useState("bad");
  const [isOff, setIsOff] = useState(true);
  const [formData1, setFormData1] = useState({
    host: "",
    port: "",
    duration: "",
  });

  const [formData2, setFormData2] = useState({
    os: "",
    hostEndpoint: "",
    hostPassword: "",
  });

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
        setPacketData((prevData) => [...prevData, newData]);
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

  useEffect(() => {
    const fetchMitigationStatus = () => {
      axios
        .get("http://localhost:3001/status/mitigation")
        .then((response) => {
          setMitigationStatus(response.data.status);
        })
        .catch((error) => {
          console.error("Error fetching mitigation status:", error);
        });
    };

    const fetchAttackStatus = () => {
      axios
        .get("http://localhost:3001/status/attack")
        .then((response) => {
          setAttackStatus(response.data.status);
        })
        .catch((error) => {
          console.error("Error fetching attack status:", error);
        });
    };

    const fetchWebsiteStatus = () => {
      axios
        .get("http://localhost:3001/status/website")
        .then((response) => {
          setWebsiteStatus(response.data.status);
        })
        .catch((error) => {
          console.error("Error fetching website status:", error);
        });
    };

    const fetchBackendStatus = () => {
      axios
        .get("http://localhost:3001/status/backend")
        .then((response) => {
          setBackendStatus(response.data.status);
        })
        .catch((error) => {
          console.error("Error fetching backend status:", error);
          setBackendStatus("bad");
        });
    };

    fetchMitigationStatus();
    fetchAttackStatus();
    fetchWebsiteStatus();
    fetchBackendStatus();

    const intervalId = setInterval(() => {
      fetchMitigationStatus();
      fetchAttackStatus();
      fetchWebsiteStatus();
      fetchBackendStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (event) => {
    setSimulation(event.target.value);
  };

  const handleStartAttack = () => {
    axios
      .post("http://localhost:3001/start", { simulation, formData1, formData2 })
      .then((response) => {
        setAttackStatus(response.data.status);
      })
      .catch((error) => {
        console.error("Error starting attack:", error);
      });
  };

  const handleDefendAttack = () => {
    try{
      const data = {
        src_address: packetData[packetData.length - 1].SRC_IP,
        dst_address: packetData[packetData.length - 1].DST_IP,
        system: formData2.os
      }
      axios
      .post("http://localhost:5000/mitigate/test", data)
      .then((response) => {
        setMitigationStatus(response.data.status);
      })
      .catch((error) => {
        console.error("Error defending attack:", error);
      });
    } catch (error) {
      console.error("Error defending attack:", error);
    };
  };

  const handleToggleOff = (event) => {
    setIsOff(event.target.checked);
    if (event.target.checked) {
      axios
        .post("http://localhost:3001/off")
        .then((response) => {
          setAttackStatus(response.data.attackStatus);
          setMitigationStatus(response.data.mitigationStatus);
        })
        .catch((error) => {
          console.error("Error setting off status:", error);
        });
    }
  };

  return (
    <div>
      <div className="flex flex-row">
        <div className="flex flex-col items-start space-y-4 mr-4 md:mr-8">
          <Selector
            selectedOption={simulation}
            handleChange={handleChange}
            label={"Simulation"}
            option1={"TCP Flood"}
            option2={"UDP Flood"}
            option3={"GET Flood"}
          />
          <ControlButtons
            handleStartAttack={handleStartAttack}
            handleDefendAttack={handleDefendAttack}
            handleToggleOff={handleToggleOff}
            isOff={isOff}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <StatusIndicator
            status={mitigationStatus}
            label="Mitigation status"
            labelStyle={{ color: "black" }}
          />
          <StatusIndicator
            status={attackStatus}
            label="Attack status"
            labelStyle={{ color: "black" }}
          />
          <StatusIndicator
            status={websiteStatus}
            label="Website status"
            labelStyle={{ color: "black" }}
          />
          <StatusIndicator
            status={backendStatus}
            label="Server status"
            labelStyle={{ color: "black" }}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4 mt-4 md:mt-0">
        <div className="flex justify-end mb-2">
          <Setup formData1={formData1} setFormData1={setFormData1} formData2={formData2} setFormData2={setFormData2} />
        </div>
        <div>
          <LogsWindow packetData={packetData} />
          <a
            href="https://yourwebsite.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
}
