import React from 'react';

const SupportingText = ({ text }) => {
  if (!text) return null;
  return <p className="hero-supporting-text">{text}</p>;
};

export default SupportingText;