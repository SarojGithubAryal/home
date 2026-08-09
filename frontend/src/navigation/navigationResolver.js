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
 * Map from content-list experiences to their detail page when a
 * contentId is present. The backend sends `READ` + contentId for a
 * specific letter, but the frontend has distinct list vs. detail pages.
 */
const CONTENT_DETAIL_MAP = {
  HEAR: PAGES.AUDIO_PLAYER,
  READ: PAGES.LETTER_VIEWER,
  SEE: PAGES.PHOTO_VIEWER,
  MEMORY: PAGES.MEMORY_VIEWER,
};

/**
 * Resolves a backend navigation object into a frontend page.
 *
 * @param {object|null} navigation
 * @returns {{page:string, props:object}|null}
 */
export function resolveNavigation(navigation) {
  if (!navigation) {
    return null;
  }

  const {
    experience,
    params = {},
  } = navigation;

  // If the backend sends a contentId, it's a content detail navigation.
  // Override the experience to the corresponding detail viewer.
  const hasContentId = Boolean(params?.contentId);
  const resolvedExperience = hasContentId && CONTENT_DETAIL_MAP[experience]
    ? CONTENT_DETAIL_MAP[experience]
    : experience;

  const page = EXPERIENCE_MAP[resolvedExperience];

  if (!page) {
    console.warn(`Unknown experience: ${resolvedExperience}`);
    return null;
  }

  return {
    page,
    props: params,
  };
}
export default resolveNavigation;