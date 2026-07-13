import React from 'react';

const DailyEncouragement = ({ message }) => {
  if (!message) return null;

  return (
    <div className="daily-encouragement" role="note">
      <span className="daily-encouragement-icon" aria-hidden="true">{message.icon}</span>
      <div className="daily-encouragement-text">
        <p className="daily-encouragement-main">{message.text}</p>
        <p className="daily-encouragement-sub">{message.subtext}</p>
      </div>
      <span className="daily-encouragement-accent" aria-hidden="true">{message.accentIcon}</span>
    </div>
  );
};

export default DailyEncouragement;