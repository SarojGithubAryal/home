import React from 'react';
import Greeting from './Greeting';
import WelcomeTitle from './WelcomeTitle';
import SupportingText from './SupportingText';
import DailyEncouragement from './DailyEncouragement';

const HeroSection = ({ greetingText, supportingText, comfortMessage, backgroundImage }) => {
  const heroStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined;

  return (
    <section className="hero-section" style={heroStyle} aria-label="Welcome">
      <div className="hero-overlay">
        <Greeting text={greetingText} />
        <WelcomeTitle />

        <div className="hero-divider" aria-hidden="true">
          <span className="hero-divider-line"></span>
          <span className="hero-divider-heart">♥</span>
          <span className="hero-divider-line"></span>
        </div>

        <SupportingText text={supportingText} />
        <DailyEncouragement message={comfortMessage} />
      </div>
    </section>
  );
};

export default HeroSection;