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
let backendStatus = 'good';

app.get('/status/mitigation', (req, res) => {
  res.json({ status: mitigationStatus });
});

app.get('/status/attack', (req, res) => {
  res.json({ status: attackStatus });
});

app.get('/status/backend', (req, res) => {
  res.json({ status: backendStatus });
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

  command = `PYTHONWARNINGS="ignore:RequestsDependencyWarning" python3 ../DDoS/start.py ${simulation} 127.0.0.1:3000 10 30`;
  
  console.log(simulation);
  switch (simulation) {
    case 'SYN Flood':
      command = 'python3 ../DDoS/start.py syn 127.0.0.1:3000 10 30';
      break;
    case 'TCP Flood':
      command = 'python3 ../DDoS/start.py tcp 127.0.0.1:3000 10 30';
      break;
    case 'HTTP Flood':
      command = 'python3 ../DDoS/start.py http 127.0.0.1:3000 10 30';
      break;
    default:
      command = `python3 ../DDoS/start.py ${simulation} 127.0.0.1:3000 10 30`;
      break;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
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