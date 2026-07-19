import React from 'react';
import MoodBadge from '../mood/MoodBadge';

const Header = ({ variant = 'home', onBack, mood, roomIcon }) => {
  if (variant === 'mood') {
    return (
      <header className="app-header app-header--mood">
        <button
          className="header-icon-button header-back-button"
          type="button"
          onClick={onBack}
          aria-label="Go back"
        >
          <span className="header-back-icon" aria-hidden="true">←</span>
        </button>

        <MoodBadge mood={mood} />
      </header>
    );
  }

  if (variant === 'room') {
    return (
      <header className="app-header app-header--room">
        <button
          className="header-icon-button header-icon-button--round"
          type="button"
          onClick={onBack}
          aria-label="Go back"
        >
          <span aria-hidden="true">←</span>
        </button>

        <span className="header-icon-button header-icon-button--round" aria-hidden="true">
          {roomIcon}
        </span>
      </header>
    );
  }

  return (
    <header className="app-header">
      <button className="header-icon-button" type="button" aria-label="Open menu">
        <span className="header-menu-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <button
        className="header-icon-button header-icon-button--round"
        type="button"
        aria-label="Open sound settings"
      >
        <span className="header-note-icon" aria-hidden="true">♪</span>
      </button>
    </header>
  );
};

export default Header;