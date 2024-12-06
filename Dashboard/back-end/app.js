const express = require("express");
const cors = require("cors");
const { exec, spawn } = require("child_process");
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
  let selected_simulation;
  switch (simulation) {
    case "TCP Flood":
      selected_simulation = "tcp";
      args = [`../DDoS/start.py`, selected_simulation, `${host}:${port}`, `10`, `${duration}`];
      break;
    case "UDP Flood":
      selected_simulation = "udp";
      args = [`../DDoS/start.py`, selected_simulation, `${host}:${port}`, `10`, `${duration}`];
      break;
    case "GET Flood":
      selected_simulation = "get";
      args = [`../DDoS/start.py`, selected_simulation, `${host}:${port}`, `1`, `10`, `sock.txt`,`10`, `${duration}`];
      break;
    default:
      return res.status(400).json({ message: "Invalid simulation type" });
  }
  const command = `python3`;

  attackStatus = "good";

  const child = spawn(command, args);

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    stdout += data.toString();
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
    console.error(`stderr: ${data}`);
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`Error executing script: ${stderr}`);
      return res
        .status(500)
        .json({ message: "Error starting attack", error: stderr });
    }
    res.json({
      message: "Attack started",
      status: attackStatus,
      output: stdout,
    });
    attackStatus = "bad";
    console.log('Finished execution');
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

