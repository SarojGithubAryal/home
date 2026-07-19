import React from 'react';

const FooterComfort = ({ icon = '❤', lines }) => {
  const content = lines && lines.length > 0 ? lines : ["Take your time. I'm here."];

  return (
    <footer className="footer-comfort">
      <div className="footer-divider" aria-hidden="true">
        <span className="footer-divider-line"></span>
        <span className="footer-divider-leaf">❧</span>
        <span className="footer-divider-line"></span>
      </div>
      <p className="footer-comfort-text">
        {content.map((line, index) => (
          <span key={index} className="footer-comfort-line">
            {line}
            {index === content.length - 1 && (
              <span aria-hidden="true"> {icon}</span>
            )}
          </span>
        ))}
      </p>
    </footer>
  );
};

export default FooterComfort;