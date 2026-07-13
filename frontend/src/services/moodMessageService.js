import moodMessages from '../mock/moodMessages';

/**
 * Returns the intro message (title/icon/subtitle) for a given mood id.
 * Backend will later generate this dynamically per user/day.
 */
export function getMoodMessage(moodId) {
  return moodMessages[moodId] || moodMessages.unknown;
}