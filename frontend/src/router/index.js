/**
 * router/index.js
 *
 * Central route definitions. This file only defines the route table —
 * it does not render pages itself (no page components exist yet in this
 * phase, per project instructions) and contains no data-fetching logic.
 *
 * Route paths mirror the backend's Experience structure from
 * 06_API_CONTRACTS.md so that frontend URLs map predictably onto the
 * Experiences they request (e.g. /rooms/:roomSlug -> GET /api/rooms/:roomSlug).
 *
 * Page components will be assigned to these routes in a later phase.
 * For now, `element` is intentionally left undefined — wiring an actual
 * router library (e.g. react-router) and page components is out of scope
 * for Phase F1 per project instructions ("No visual pages").
 */

export const ROUTES = {
  HOME: {
    path: '/',
    name: 'home',
  },
  MOOD_SELECT: {
    path: '/mood',
    name: 'mood-select',
  },
  ROOM: {
    path: '/rooms/:roomSlug',
    name: 'room',
  },
  ROOM_HEAR: {
    path: '/rooms/:roomSlug/hear',
    name: 'room-hear',
  },
  ROOM_READ: {
    path: '/rooms/:roomSlug/read',
    name: 'room-read',
  },
  ROOM_SEE: {
    path: '/rooms/:roomSlug/see',
    name: 'room-see',
  },
  ROOM_MEMORY: {
    path: '/rooms/:roomSlug/memory',
    name: 'room-memory',
  },
};

/**
 * Builds a concrete Room-family path by substituting :roomSlug.
 * Mirrors the dynamic endpoint builder pattern already used in
 * API_ENDPOINTS (constants.js), keeping route-building and
 * endpoint-building consistent in style.
 *
 * @param {{path: string}} route - one of the ROOM_* entries above
 * @param {string} roomSlug
 * @returns {string}
 */
export function buildRoomPath(route, roomSlug) {
  return route.path.replace(':roomSlug', roomSlug);
}

const router = { ROUTES, buildRoomPath };

export default router;