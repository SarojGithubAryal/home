import React from 'react';

const RoomIntro = ({ title, icon, subtitle }) => {
  return (
    <div className="mood-intro">
      <h1 className="mood-intro-title">
        {title}
        {icon && <span className="mood-intro-icon" aria-hidden="true">{icon}</span>}
      </h1>

      {subtitle && <p className="mood-intro-subtitle">{subtitle}</p>}

      <div className="mood-intro-divider" aria-hidden="true">
        <span className="mood-intro-divider-line"></span>
        <span className="mood-intro-divider-leaf">»»»</span>
        <span className="mood-intro-divider-line"></span>
      </div>
    </div>
  );
};

export default RoomIntro;