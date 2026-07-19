/**
 * MoodSelector.jsx
 *
 * Consumes the Mood Experience (GET /api/moods) through the existing,
 * already-built useMoods() hook — no new architecture, no bypassing the
 * Hooks -> Services -> apiClient -> Backend flow. Renders a real,
 * backend-driven grid of moods plus the fixed "I don't know" affordance.
 *
 * On selection, calls the hook's selectMood() (POST /api/moods/select).
 * Navigation to the next experience is not yet wired, since no routing
 * library has been introduced in this phase (routing must remain
 * unchanged per project instructions).
 */

import React from 'react';
import Section from '../common/Section';
import Loading from '../common/Loading';
import ErrorState from '../common/ErrorState';
import MoodGrid from '../mood/MoodGrid';
import UnknownMoodTile from '../mood/UnknownMoodTile';
import { useMoods } from '../../hooks/useMoods';
import { getPath } from '../../utils/helpers';
import './MoodSelector.css';

function MoodSelector({ onMoodSelected }) {
  const { moods, moodsLoading, moodsError, refetchMoods, selectMood, selecting } = useMoods();

  const moodList = Array.isArray(moods) ? moods : getPath(moods, 'items', []) || [];

  const handleSelect = async (mood) => {
    const success = await selectMood({ moodId: mood.id });
    if (success && onMoodSelected) onMoodSelected(mood);
  };

  {/* "How are you feeling today?" / "It's okay to feel any of it." are
          UI chrome, not backend content — GET /api/moods (per
          06_API_CONTRACTS.md) documents only the mood list itself, no
          heading/subtitle field. Same precedent as WelcomeMark and the
          "I don't know" tile's fixed copy. */}
          
  return (
    <Section title="How are you feeling today?" subtitle="It's okay to feel any of it.">
      {moodsLoading && <Loading variant="inline" message="Loading moods" />}

      {!moodsLoading && moodsError && (
        <ErrorState error={moodsError} onRetry={refetchMoods} />
      )}

      {!moodsLoading && !moodsError && (
        <div className="mood-selector-body">
          <MoodGrid moods={moodList} onSelect={handleSelect} />
          <UnknownMoodTile onSelect={handleSelect} />
        </div>
      )}

      {selecting && <Loading variant="inline" message="Saving your mood" />}
    </Section>
  );
}

export default MoodSelector;