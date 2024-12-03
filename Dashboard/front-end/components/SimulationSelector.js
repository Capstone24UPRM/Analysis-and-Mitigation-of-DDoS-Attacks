import React from 'react';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';

const Selector = ({
  selectedOption,
  handleChange,
  label,
  option1,
  option2,
  option3,
  error,
  helperText,
}) => {
  return (
    <FormControl
      variant="outlined"
      className="w-40 md:relative md:top-0 md:left-0 md:w-64"
      error={error}
    >
      <InputLabel id="simulation-select-label" sx={{ color: 'black' }}>
        Select {label}
      </InputLabel>
      <Select
        labelId="selected-option-label"
        id="selected-option-select"
        value={selectedOption}
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
        <MenuItem value={option1}>{option1}</MenuItem>
        <MenuItem value={option2}>{option2}</MenuItem>
        <MenuItem value={option3}>{option3}</MenuItem>
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Selector;