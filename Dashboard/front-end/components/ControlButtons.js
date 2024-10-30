import React from 'react';
import { Button, Switch, FormControlLabel } from '@mui/material';

const ControlButtons = ({ handleStartAttack, handleDefendAttack, handleToggleOff, isOff }) => {
  return (
    <div className="flex space-x-4">
      <Button
        variant="outlined"
        sx={{
          color: isOff ? 'var(--color-disabled)' : 'var(--color-primary)',
          borderColor: isOff ? 'var(--color-disabled)' : 'var(--color-primary)',
          '&:hover': {
            borderColor: isOff ? 'var(--color-disabled)' : 'var(--color-primary)',
            backgroundColor: isOff ? 'transparent' : 'var(--color-hover)',
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
          color: isOff ? 'var(--color-disabled)' : 'var(--color-primary)',
          borderColor: isOff ? 'var(--color-disabled)' : 'var(--color-primary)',
          '&:hover': {
            borderColor: isOff ? 'var(--color-disabled)' : 'var(--color-primary)',
            backgroundColor: isOff ? 'transparent' : 'var(--color-hover)',
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
        sx={{ color: 'var(--color-primary)' }}
      />
    </div>
  );
};

export default ControlButtons;