const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

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
  const { simulation, formData } = req.body;

  if (!simulation || simulation.trim() === "") {
    return res.status(400).json({ message: "Simulation value is required" });
  }

  if (!formData) {
    return res.status(400).json({ message: "Form data is required" });
  }

  const { host, port, duration } = formData;

  console.log(`Simulation selected: ${simulation}`);
  console.log(`Form data: ${JSON.stringify(formData)}`);

  command = `PYTHONWARNINGS="ignore:RequestsDependencyWarning" python3 ../DDoS/start.py tcp ${requirement1}:${requirement2} 10 ${requirement3}`;

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
