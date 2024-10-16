const express = require('express');
const cors = require('cors');

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
  attackStatus = 'good';
  res.json({ message: 'Attack started', status: attackStatus });
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