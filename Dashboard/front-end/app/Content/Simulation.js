import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SimulationSelector from '../components/SimulationSelector';
import ControlButtons from '../components/ControlButtons';
import StatusIndicator from '../components/StatusIndicator';

export default function Simulation() {
  const [simulation, setSimulation] = useState('');
  const [mitigationStatus, setMitigationStatus] = useState('bad');
  const [attackStatus, setAttackStatus] = useState('bad');
  const [websiteStatus, setWebsiteStatus] = useState('bad');
  const [isOff, setIsOff] = useState(false);

  useEffect(() => {
    const fetchMitigationStatus = () => {
      axios.get('http://localhost:3001/status/mitigation')
        .then(response => {
          setMitigationStatus(response.data.status);
        })
        .catch(error => {
          console.error('Error fetching mitigation status:', error);
        });
    };

    const fetchAttackStatus = () => {
      axios.get('http://localhost:3001/status/attack')
        .then(response => {
          setAttackStatus(response.data.status);
        })
        .catch(error => {
          console.error('Error fetching attack status:', error);
        });
    };

    const fetchWebsiteStatus = () => {
      axios.get('http://localhost:3001/status/website')
        .then(response => {
          setWebsiteStatus(response.data.status);
        })
        .catch(error => {
          console.error('Error fetching website status:', error);
        });
    };

    fetchMitigationStatus();
    fetchAttackStatus();
    fetchWebsiteStatus();

    const intervalId = setInterval(() => {
      fetchMitigationStatus();
      fetchAttackStatus();
      fetchWebsiteStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (event) => {
    setSimulation(event.target.value);
  };

  const handleStartAttack = () => {
    axios.post('http://localhost:3001/start', { simulation })
      .then(response => {
        setAttackStatus(response.data.status);
      })
      .catch(error => {
        console.error('Error starting attack:', error);
      });
  };

  const handleDefendAttack = () => {
    axios.post('http://localhost:3001/defend')
      .then(response => {
        setMitigationStatus(response.data.status);
      })
      .catch(error => {
        console.error('Error defending attack:', error);
      });
  };

  const handleToggleOff = (event) => {
    setIsOff(event.target.checked);
    if (event.target.checked) {
      axios.post('http://localhost:3001/off')
        .then(response => {
          setAttackStatus(response.data.attackStatus);
          setMitigationStatus(response.data.mitigationStatus);
        })
        .catch(error => {
          console.error('Error setting off status:', error);
        });
    }
  };

  return (
    <div className="relative h-screen flex flex-col items-start justify-start md:items-center md:justify-center space-y-4">
      <SimulationSelector simulation={simulation} handleChange={handleChange} />
      <ControlButtons
        handleStartAttack={handleStartAttack}
        handleDefendAttack={handleDefendAttack}
        handleToggleOff={handleToggleOff}
        isOff={isOff}
      />
      <div className="flex space-x-4 mt-4">
        <StatusIndicator status={mitigationStatus} label="Mitigation status" />
        <StatusIndicator status={attackStatus} label="Attack status" />
        <StatusIndicator status={websiteStatus} label="Website status" />
      </div>
    </div>
  );
}