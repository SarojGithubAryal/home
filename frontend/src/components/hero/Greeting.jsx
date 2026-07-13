import React from 'react';

const Greeting = ({ text }) => {
  if (!text) return null;
  return <p className="hero-greeting">{text}</p>;
};

export default Greeting;