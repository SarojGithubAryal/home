import React from 'react';

const RecommendationCard = ({ recommendation, artwork, onPrimaryAction, onSecondaryAction }) => {
  if (!recommendation) return null;

  const artworkStyle = artwork ? { backgroundImage: `url(${artwork})` } : undefined;

  const handlePrimary = () => {
    if (onPrimaryAction) onPrimaryAction(recommendation.primaryAction);
  };

  const handleSecondary = () => {
    if (onSecondaryAction) onSecondaryAction(recommendation.secondaryAction);
  };

  return (
    <div className="recommendation-card">
      <div className="recommendation-artwork" style={artworkStyle} aria-hidden="true"></div>

      <div className="recommendation-content">
        {recommendation.badge && (
          <span className="recommendation-badge">{recommendation.badge}</span>
        )}

        <p className="recommendation-title">{recommendation.title}</p>

        {recommendation.description && (
          <p className="recommendation-description">{recommendation.description}</p>
        )}
      </div>

      <div className="recommendation-actions">
        {recommendation.primaryAction && (
          <button
            type="button"
            className="recommendation-play-button"
            onClick={handlePrimary}
            aria-label={recommendation.primaryAction.label || 'Play'}
          >
            <span aria-hidden="true">▶</span>
          </button>
        )}

        {recommendation.secondaryAction && (
          <button type="button" className="recommendation-open-button" onClick={handleSecondary}>
            {recommendation.secondaryAction.label || 'Open'}
            <span aria-hidden="true">›</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;