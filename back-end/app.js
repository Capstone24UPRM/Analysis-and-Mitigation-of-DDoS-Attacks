const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let status = 'bad'; 

app.get('/status', (req, res) => {
  console.log('GET /status called');
  res.json({ status });
});

app.post('/start', (req, res) => {
  console.log('POST /start called');
  status = 'bad';
  res.json({ message: 'Attack started', status });
});

app.post('/defend', (req, res) => {
  console.log('POST /defend called');
  status = 'good'; 
  res.json({ message: 'Defending attack', status });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});