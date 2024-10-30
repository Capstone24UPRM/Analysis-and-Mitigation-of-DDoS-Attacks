import React from 'react';
import { Button, Switch, FormControlLabel } from '@mui/material';

const ControlButtons = ({ handleStartAttack, handleDefendAttack, handleToggleOff, isOff }) => {
  return (
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
        disabled={isOff}
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
        disabled={isOff}
      >
        Defend Attack
      </Button>
      <FormControlLabel
        control={
          <Switch
            checked={isOff}
            onChange={handleToggleOff}
            color="primary"
          />
        }
        label={isOff ? "OFF" : "ON"}
        sx={{ color: 'white' }}
      />
    </div>
  );
};

export default ControlButtons;