const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let mitigationStatus = "bad";
let attackStatus = "bad";
let websiteStatus = "bad";
let backendStatus = "good";

app.get("/", (req, res) => {
  res.send("Analysis and Mitigation Server");
});

app.get("/status/mitigation", (req, res) => {
  res.json({ status: mitigationStatus });
});

app.get("/status/attack", (req, res) => {
  res.json({ status: attackStatus });
});

app.get("/status/backend", (req, res) => {
  res.json({ status: backendStatus });
});

app.get("/status/website", (req, res) => {
  res.json({ status: websiteStatus });
});

app.post("/start", (req, res) => {
  const { simulation, formData1, formData2 } = req.body;

  console.log(formData1);
  console.log(formData2);
  console.log(simulation);

  if (!simulation || simulation.trim() === "") {
    return res.status(400).json({ message: "Simulation value is required" });
  }

  if (!formData1) {
    return res.status(400).json({ message: "Form data is required" });
  }

  const { host, port, duration } = formData1;

  console.log(`Simulation selected: ${simulation}`);
  console.log(`Form data: ${JSON.stringify(formData1)}`);

  switch (simulation) {
    case "TCP Flood":
      selected_simulation = "tcp";
      break;
    case "UDP Flood":
      selected_imulation = "udp";
      break;
    case "SYN Flood":
      selected_simulation = "syn";
      break;
    default:
      return res.status(400).json({ message: "Invalid simulation type" });
  }

  command = `PYTHONWARNINGS="ignore:RequestsDependencyWarning" python3 ../DDoS/start.py ${selected_simulation} ${host}:${port} 10 ${duration}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return res
        .status(500)
        .json({ message: "Error starting attack", error: stderr });
    }
    console.log(`Script output: ${stdout}`);
    attackStatus = "good";
    res.json({
      message: "Attack started",
      status: attackStatus,
      output: stdout,
    });
  });
});

app.post("/defend", (req, res) => {
  mitigationStatus = "good";
  res.json({ message: "Defending attack", status: mitigationStatus });
});

app.post("/off", (req, res) => {
  attackStatus = "bad";
  mitigationStatus = "bad";
  res.json({
    message: "Attack and mitigation set to bad",
    attackStatus,
    mitigationStatus,
  });
});

// Path to the directory and CSV file
const publicDirPath = path.join(__dirname, '../front-end/public');
const csvFilePath = path.join(publicDirPath, 'Network_Summary.csv');

// Function to ensure the directory and file exist
const ensureEmptyCsv = () => {
  try {
    // Check if the public directory exists, if not, create it
    if (!fs.existsSync(publicDirPath)) {
      fs.mkdirSync(publicDirPath, { recursive: true }); // Create the directory and any necessary subdirectories
    }

    // Create or overwrite the file with an empty one
    fs.writeFileSync(csvFilePath, '', { flag: 'w' });
  } catch (err) {
    console.error('Error ensuring the CSV file:', err);
  }
};

// Endpoint to reset the CSV file
app.post('/reset-csv', (req, res) => {
  try {
    ensureEmptyCsv(); // Create or reset the file to be empty
    res.status(200).json({ message: 'CSV file reset successfully.' });
  } catch (err) {
    console.error('Error resetting CSV file:', err);
    res.status(500).json({ message: 'Failed to reset the CSV file.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

