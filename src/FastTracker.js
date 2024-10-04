import React, { useState, useEffect } from 'react';
import './FastTracker.css';

const FastTracker = () => {
  const [fasting, setFasting] = useState(false);
  const [timer, setTimer] = useState(0); // Temps en secondes
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    let interval = null;
    if (fasting) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000); // Le chronomètre compte les secondes
    } else if (!fasting && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [fasting, timer]);

  const startFast = () => {
    const now = new Date();
    setStartTime(now);
    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 heures plus tard
    setEndTime(end);
    setFasting(true);
    setTimer(0); // Réinitialiser le chronomètre
  };

  const stopFast = () => {
    setFasting(false);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fast-tracker">
      <h1>Jeûne intermittent</h1>
      <p>La discipline est votre amie, pas votre ennemie. 🤝</p>

      <div className="fast-info">
        <p>{fasting ? 'Vous êtes en train de jeûner !' : 'Vous pouvez manger maintenant !'}</p>
        <p>Temps écoulé : {formatTime(timer)}</p>
        {startTime && <p>Commencé à : {startTime.toLocaleTimeString()}</p>}
        {endTime && <p>Fin prévue : {endTime.toLocaleTimeString()}</p>}
      </div>

      <button onClick={fasting ? stopFast : startFast} className="fast-button">
        {fasting ? 'Arrêter le jeûne' : 'Commencez à jeûner'}
      </button>
    </div>
  );
};

export default FastTracker;
