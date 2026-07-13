import comfortMessages from '../mock/comfortMessages';

/**
 * Returns today's comfort message.
 * Currently deterministic (first entry) to match the approved design.
 * Backend will later decide this message per user/day.
 */
export function getComfortMessage() {
  return comfortMessages[0];
}

/**
 * Optional helper for future use: picks a random comfort message
 * from the local mock set. Not used by default.
 */
export function getRandomComfortMessage() {
  const index = Math.floor(Math.random() * comfortMessages.length);
  return comfortMessages[index];
}