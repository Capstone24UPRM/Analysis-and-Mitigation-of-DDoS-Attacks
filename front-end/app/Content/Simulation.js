import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import axios from 'axios';

export default function Simulation() {
  const [simulation, setSimulation] = useState('');
  const [status, setStatus] = useState('bad'); // Possible values: 'good', 'bad', 'deteriorated'

  useEffect(() => {
    // Fetch initial status from the backend
    axios.get('http://localhost:3001/status')
      .then(response => {
        setStatus(response.data.status);
      })
      .catch(error => {
        console.error('Error fetching status:', error);
      });
  }, []);

  const handleChange = (event) => {
    setSimulation(event.target.value);
  };

  const handleStartAttack = () => {
    axios.post('http://localhost:3001/start')
      .then(response => {
        setStatus(response.data.status);
      })
      .catch(error => {
        console.error('Error starting attack:', error);
      });
  };

  const handleDefendAttack = () => {
    axios.post('http://localhost:3001/defend')
      .then(response => {
        setStatus(response.data.status);
      })
      .catch(error => {
        console.error('Error defending attack:', error);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-500';
      case 'bad':
        return 'bg-red-500';
      case 'deteriorated':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative h-screen flex flex-col items-start justify-start md:items-center md:justify-center space-y-4">
      <FormControl
        variant="outlined"
        className="absolute top-4 left-4 w-40 md:relative md:top-0 md:left-0 md:w-64"
      >
        <InputLabel id="simulation-select-label" sx={{ color: 'white' }}>
          Choose Simulation
        </InputLabel>
        <Select
          labelId="simulation-select-label"
          id="simulation-select"
          value={simulation}
          onChange={handleChange}
          label="Choose Simulation"
          sx={{
            backgroundColor: 'transparent',
            borderColor: 'white',
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
            '@media (max-width: 768px)': {
              width: '10rem', // Smaller width on mobile
            },
          }}
        >
          <MenuItem value="ICMP Flood">ICMP Flood</MenuItem>
          <MenuItem value="SYN Flood">SYN Flood</MenuItem>
          <MenuItem value="HTTP Flood">HTTP Flood</MenuItem>
        </Select>
      </FormControl>

      <div className="flex space-x-4">
        <Button
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          onClick={handleStartAttack}
        >
          Start Attack
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          onClick={handleDefendAttack}
        >
          Defend Attack
        </Button>
      </div>

      <div className="flex space-x-4 mt-4">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${getStatusColor(status)}`}></div>
          <span className="text-white mt-2">Mitigation status</span>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${getStatusColor(status)}`}></div>
          <span className="text-white mt-2">Attack status</span>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full ${getStatusColor(status)}`}></div>
          <span className="text-white mt-2">Website status</span>
        </div>
      </div>
    </div>
  );
}