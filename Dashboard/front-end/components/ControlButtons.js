import { useState, useEffect } from 'react';
import { Button, Switch, FormControlLabel } from '@mui/material';

const ControlButtons = ({ handleStartAttack, handleDefendAttack, btnVisible }) => {

  const [timerRunning, setTimerRunning] = useState(false);
  const [time, setTime] = useState("");
  const [savedTimer, setSavedTimer] = useState("");
  const [isDefending, setIsDefending] = useState(false);

  const startTimer = () => {
    setTimerRunning(true);
    setTime(savedTimer);
  };

  const resetTimer = () => {
    setTime(savedTimer);
    localStorage.setItem("timer", savedTimer);
    setTimerRunning(false);
  };

  useEffect(() => {
    const timer = localStorage.getItem("timer");
    const [navigation] = performance.getEntriesByType("navigation");
    if (timer) {
      setTime(Number(timer));
    }
    if (!timerRunning && timer !== 0) {
      setSavedTimer(timer);
    }
  });

  useEffect(() => {
    let timerId;

    if (timerRunning && time > -1) {
      timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
        localStorage.setItem("timer", time - 1);
      }, 1000);
    } else if (time === -1) {
      resetTimer();
    }

    return () => clearInterval(timerId);
  }, [timerRunning, time]);

  const handleAttack = () => {
    handleStartAttack();
    startTimer();
  }

  const toggleDefend = () => {
    setIsDefending(!isDefending);
    handleDefendAttack();
  }

  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
      <Button
        variant="outlined"
        sx={{
          color: !timerRunning ? 'var(--color-disabled)' : 'var(--color-primary)',
          borderColor: !timerRunning ? 'var(--color-disabled)' : 'var(--color-primary)',
          '&:hover': {
            borderColor: !timerRunning ? 'var(--color-disabled)' : 'var(--color-primary)',
            backgroundColor: !timerRunning ? 'transparent' : 'var(--color-hover)',
          },
        }}
        onClick={handleAttack}
        disabled={timerRunning || !btnVisible}
      >
        {!timerRunning ? "Start Attack" : time}
      </Button>
      <Button
        variant="outlined"
        sx={{
          color: 'var(--color-primary)',
          borderColor: 'var(--color-primary)',
          '&:hover': {
            borderColor: 'var(--color-primary)',
            backgroundColor: 'var(--color-hover)',
          },
        }}
        onClick={toggleDefend}
        disabled={!btnVisible}
      >
        {isDefending ? "Stop Defending" : "Defend Attack"}
      </Button>
    </div>
  );
};

export default ControlButtons;