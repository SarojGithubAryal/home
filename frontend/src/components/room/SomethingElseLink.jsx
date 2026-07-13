import React from 'react';

const SomethingElseLink = ({ onClick }) => {
  return (
    <button type="button" className="something-else-link" onClick={onClick}>
      <span className="something-else-icon" aria-hidden="true">✨</span>
      <span className="something-else-text">I'm looking for something else</span>
      <span className="something-else-chevron" aria-hidden="true">›</span>
    </button>
  );
};

export default SomethingElseLink;