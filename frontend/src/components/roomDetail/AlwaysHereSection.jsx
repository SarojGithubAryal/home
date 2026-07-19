import React from 'react';
import AlwaysHereCard from './AlwaysHereCard';

const AlwaysHereSection = ({ alwaysHere, onSelectItem, onSelectMore }) => {
  if (!alwaysHere) return null;

  const handleMore = () => {
    if (onSelectMore) onSelectMore();
  };

  return (
    <section className="always-here-section" aria-labelledby="always-here-title">
      <div className="always-here-header">
        <h2 id="always-here-title" className="always-here-title-heading">
          {alwaysHere.title} <span aria-hidden="true">{alwaysHere.icon}</span>
        </h2>
        {alwaysHere.description && (
          <p className="always-here-description">{alwaysHere.description}</p>
        )}
      </div>

      <div className="always-here-scroll" role="group" aria-label={alwaysHere.title}>
        {alwaysHere.items.map((item) => (
          <AlwaysHereCard key={item.id} item={item} onSelect={onSelectItem} />
        ))}

        {alwaysHere.moreLabel && (
          <button type="button" className="always-here-more-card" onClick={handleMore}>
            <span className="always-here-more-icon" aria-hidden="true">💗</span>
            <span className="always-here-more-label">{alwaysHere.moreLabel}</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default AlwaysHereSection;