/**
 * navigationResolver.js
 *
 * Converts a backend navigation instruction into a frontend page
 * instruction.
 *
 * The backend owns navigation decisions.
 * The frontend never guesses where to go.
 *
 * Input:
 *
 * {
 *   experience: "ROOM",
 *   params: {
 *     roomSlug: "mom"
 *   }
 * }
 *
 * Output:
 *
 * {
 *   page: PAGES.ROOM,
 *   props: {
 *     roomSlug: "mom"
 *   }
 * }
 *
 * This file contains NO React.
 * NO rendering.
 * NO API calls.
 * NO state.
 * It is a pure mapping function.
 */

import PAGES from './pages';

const EXPERIENCE_MAP = Object.freeze({
  HOME: PAGES.HOME,
  MOOD_LANDING: PAGES.MOOD_LANDING,

  ROOM: PAGES.ROOM,
  HEAR: PAGES.HEAR,
  READ: PAGES.READ,
  SEE: PAGES.SEE,
  MEMORY: PAGES.MEMORY,

  AUDIO_PLAYER: PAGES.AUDIO_PLAYER,
  LETTER_VIEWER: PAGES.LETTER_VIEWER,
  PHOTO_VIEWER: PAGES.PHOTO_VIEWER,
  MEMORY_VIEWER: PAGES.MEMORY_VIEWER,

  SETTINGS: PAGES.SETTINGS,
  PROFILE: PAGES.PROFILE,
});

/**
 * Resolves a backend navigation object into a frontend page.
 *
 * @param {object|null} navigation
 * @returns {{page:string, props:object}|null}
 */
export function resolveNavigation(navigation) {
  console.log("========== RESOLVER ==========");
  console.log("Resolver input:", navigation);

  if (!navigation) {
    console.warn("No navigation object.");
    return null;
  }

  const {
    experience,
    params = {},
  } = navigation;

  const page = EXPERIENCE_MAP[experience];

  if (!page) {
    console.warn(`Unknown experience: ${experience}`);
    return null;
  }

  return {
    page,
    props: params,
  };
}
export default resolveNavigation;