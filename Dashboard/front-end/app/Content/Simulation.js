import React, { useState, useEffect } from "react";
import { Button } from '@mui/material';
import axios from "axios";
import Selector from "../../components/SimulationSelector";
import ControlButtons from "../../components/ControlButtons";
import StatusIndicator from "../../components/StatusIndicator";
import Setup from "@/components/Setup";
import LogsWindow from "@/components/LogsWindow";
import { SosRounded } from "@mui/icons-material";

export default function Simulation() {
  const [simulation, setSimulation] = useState("");
  const [mitigationStatus, setMitigationStatus] = useState("bad");
  const [attackStatus, setAttackStatus] = useState("bad");
  const [websiteStatus, setWebsiteStatus] = useState("bad");
  const [backendStatus, setBackendStatus] = useState("bad");

  const [fileExists, setFileExist] = useState(false)
  const csvFilePath = "/Network_Summary.csv";

  const [isDefending, setIsDefending] = useState(false)

  useEffect(() => {
    const checkFile = async () => {
      try {
        const response = await fetch(csvFilePath, { method: "HEAD" });
        if (response.ok) {
          setFileExist(true);
        } else {
          setFileExist(false);
        }
      } catch (error) {
        setFileExist(false);
      }
    };

    // Set up an interval to check the file periodically
    const intervalId = setInterval(() => {
      checkFile();
    }, 2000); // Check every 2 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [csvFilePath]);


  // const [isOff, setIsOff] = useState(true);
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
  const [sourceIpLogs, setSourceIpLogs] = useState([]);
  const [destinationIpLogs, setDestinationIpLogs] = useState([]);
  const [medianPrediction, setMedianPrediction] = useState("");
  const [btnVisible, setBtnVisible] = useState(false);
  const [mlStatus, setMlStatus] = useState(null);


  const simulations = {
    "TCP Flood": "tcp",
    "UDP Flood": "udp",
  };

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


  // Filter packetData based on source and destination IP
  useEffect(() => {
    if (!packetData || packetData.length === 0) return;

    const sourceIp = ""; // Assume formData1 contains the source IP to filter
    const destinationIp = formData1?.host; // Assume formData2 contains the destination IP to filter

    const newSourceLogs = packetData.filter(row => row.SRC_IP === sourceIp);
    const newDestinationLogs = packetData.filter(row => row.DST_IP === destinationIp);

    setSourceIpLogs(prev => [...prev, ...newSourceLogs]);
    setDestinationIpLogs(prev => [...prev, ...newDestinationLogs]);
  }, [packetData, formData1, formData2]);

  const calculateStringMedian = (logs) => {
    if (logs.length < 5) return null; // Not enough data to calculate median

    // Extract the last 5 records
    const lastFiveLogs = logs.slice(-5);

    // Extract predictions and sort them lexicographically
    const predictions = lastFiveLogs.map(log => log.PREDICTION).sort();

    // Calculate the median (middle element of sorted list)
    return predictions.length % 2 === 0
      ? predictions[predictions.length / 2 - 1] // For simplicity, pick the lower middle
      : predictions[Math.floor(predictions.length / 2)];
  };

  useEffect(() => {
    setMedianPrediction(calculateStringMedian(destinationIpLogs));
  }, [destinationIpLogs]);

  useEffect(() => {
    if (medianPrediction == "TCP Flood") {
      setMlStatus("TCP Flood Attack detected");
    }
    else if (medianPrediction == "UDP Flood") {
      setMlStatus("UDP Flood Attack detected");
    } else if (medianPrediction == "Normal") {
      setMlStatus("No attack detected");
    }
  }, [medianPrediction]);

  useEffect(() => {
    // const fetchMitigationStatus = () => {
    //   axios
    //     .get("http://localhost:3001/status/mitigation")
    //     .then((response) => {
    //       setMitigationStatus(response.data.status);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching mitigation status:", error);
    //     });
    // };

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

    // fetchMitigationStatus();
    fetchAttackStatus();
    fetchWebsiteStatus();
    fetchBackendStatus();

    const intervalId = setInterval(() => {
      // fetchMitigationStatus();
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

  const handleDefendAttack = async () => {
    try {
      if (isDefending) {
        //Stop defending 
        const response = await axios.post('http://127.0.0.1:5000/mitigate/remove');
        setMitigationStatus(response.data.status);
        setMlStatus("Stopped Mitigation Process");
        setIsDefending(false);
      } else {
        // First check if server is running
        const isServerRunning = await axios
          .get('http://127.0.0.1:5000/mitigate/status')
          .then(() => true)
          .catch(() => false);

        if (!isServerRunning) {
          console.error("Mitigation server not running");
          // setMitigationStatus("bad");
          return;
        }

        // If server is running, proceed with mitigation request
        const data = {
          src_address: "192.168.0.8",
          dst_address: "192.168.0.11",
          system: formData2.os
        };

        const response = await axios.post(
          `http://127.0.0.1:5000/mitigate/${simulations[simulation]}`,
          data
        );
        console.log(response.data);
        setMitigationStatus(response.data.status);
        console.log("Mitigation status:", mitigationStatus);
        setMlStatus("Starting Mitigation Process");
        setIsDefending(true);
      }
  
      // // If server is running, proceed with mitigation request
      // const data = {
      //   src_address: "127.0.0.1",
      //   dst_address: "127.0.0.1",  
      //   system: "Darwin",
      // };
      
      // const response = await axios.post(
      //   `http://127.0.0.1:5000/mitigate/${simulations[simulation]}`,
      //   data
      // );
      // console.log(response.data);
      // setMitigationStatus(response.data.status);
      // console.log("Mitigation status:", mitigationStatus);
      // setMlStatus("Starting Mitigation Process");
    } catch (error) {
      console.error("Error defending attack:", error);
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
          />
          <ControlButtons
            handleStartAttack={handleStartAttack}
            handleDefendAttack={handleDefendAttack}
            btnVisible={btnVisible && simulation}
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
          <Setup formData1={formData1} setFormData1={setFormData1} formData2={formData2} setFormData2={setFormData2} setBtnVisible={setBtnVisible} />
        </div>
        <div>
          <LogsWindow
            sourceIpLogs={sourceIpLogs}
            destinationIpLogs={destinationIpLogs}
            medianPrediction={medianPrediction}
            mlStatus={mlStatus}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          {fileExists && (
            <Button
              variant="outlined"
              sx={{
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                '&:hover': {
                  borderColor: 'var(--color-primary)',
                  backgroundColor: 'var(--color-hover)',
                },
              }}
              component="a"
              href={csvFilePath}
              download
            >
              Download Network Summary
            </Button>
          )}
          {fileExists && (
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'red',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
              onClick={async () => {
                try {
                  const response = await axios.post('http://localhost:3001/reset-csv');
                  if (response.status === 200) {
                    console.log(response.data.message);
                    alert('Network data has been reset successfully.');
                  }
                } catch (error) {
                  console.error('Error resetting network data:', error);
                  alert('Failed to reset network data. Please try again.');
                }
              }}
            >
              Reset Network Data
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
