import React from 'react';
import './EmptyExperience.css';

function EmptyExperience({
  icon = '✨',
  title,
  subtitle,
}) {
  return (
    <div className="empty-experience">
      <div className="empty-experience-icon">
        {icon}
      </div>

      <h2 className="empty-experience-title">
        {title}
      </h2>

      {subtitle && (
        <p className="empty-experience-subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default EmptyExperience;