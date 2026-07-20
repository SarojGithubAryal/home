/**
 * pages.js
 *
 * Single source of truth for every frontend-renderable experience.
 *
 * The backend never knows React components. It only returns an
 * experience identifier (see 12_NAVIGATION_CONTRACT.md).
 *
 * navigationResolver.js maps backend experiences to these constants.
 * App.jsx then renders the matching page.
 *
 * Every new page added to the project should be registered here.
 */

export const PAGES = Object.freeze({
  HOME: 'HOME',
  MOOD_LANDING: 'MOOD_LANDING',

  // Future experiences
  ROOM: 'ROOM',
  HEAR: 'HEAR',
  READ: 'READ',
  SEE: 'SEE',
  MEMORY: 'MEMORY',

  AUDIO_PLAYER: 'AUDIO_PLAYER',
  LETTER_VIEWER: 'LETTER_VIEWER',
  PHOTO_VIEWER: 'PHOTO_VIEWER',
  MEMORY_VIEWER: 'MEMORY_VIEWER',

  SETTINGS: 'SETTINGS',
  PROFILE: 'PROFILE',
});

export default PAGES;