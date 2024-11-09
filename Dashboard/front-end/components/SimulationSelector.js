import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SimulationSelector = ({ simulation, handleChange }) => {
  return (
    <FormControl
      variant="outlined"
      className="w-40 md:relative md:top-0 md:left-0 md:w-64"
    >
      <InputLabel id="simulation-select-label" sx={{ color: 'black' }}>
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
          borderColor: 'black',
          color: 'black',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'whiblackte',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black',
          },
          '& .MuiSvgIcon-root': {
            color: 'black',
          },
          '@media (max-width: 768px)': {
            width: '10rem', // Smaller width on mobile
          },
        }}
      >
        <MenuItem value="ICMP Flood">ICMP Flood</MenuItem>
        <MenuItem value="TCP Flood">TCP Flood</MenuItem>
        <MenuItem value="HTTP Flood">HTTP Flood</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SimulationSelector;