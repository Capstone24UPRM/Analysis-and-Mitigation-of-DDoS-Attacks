const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let mitigationStatus = 'bad';
let attackStatus = 'bad';
let websiteStatus = 'bad';

app.get('/status/mitigation', (req, res) => {
  res.json({ status: mitigationStatus });
});

app.get('/status/attack', (req, res) => {
  res.json({ status: attackStatus });
});

app.get('/status/website', (req, res) => {
  res.json({ status: websiteStatus });
});

app.post('/start', (req, res) => {
  const { simulation } = req.body;

  if (!simulation || simulation.trim() === "") {
    return res.status(400).json({ message: 'Simulation value is required' });
  }

  console.log(`Simulation selected: ${simulation}`);

  exec('python3 ../MHDDoS/start.py tcp 127.0.0.1 10 30', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error}`);
      return res.status(500).json({ message: 'Error starting attack', error: stderr });
    }
    console.log(`Script output: ${stdout}`);
    attackStatus = 'good';
    res.json({ message: 'Attack started', status: attackStatus, output: stdout });
  });
});

app.post('/defend', (req, res) => {
  mitigationStatus = 'good';
  res.json({ message: 'Defending attack', status: mitigationStatus });
});

app.post('/off', (req, res) => {
  attackStatus = 'bad';
  mitigationStatus = 'bad';
  res.json({ message: 'Attack and mitigation set to bad', attackStatus, mitigationStatus });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});