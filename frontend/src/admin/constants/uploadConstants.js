/**
 * Admin Upload Constants
 *
 * Stable UUIDs for room and content types (taken from the seed data).
 * These are safe to hardcode because the admin panel is not user‑facing.
 * If the seed data ever changes, update this file.
 */

export const ROOMS = Object.freeze({
  mom:  'a7a83745-9c1f-4748-92a7-fda52bca154d',
  dad:  '3a4bfee8-f445-424c-b824-48646e3b78cc',
  me:   '5c6110a7-adbc-4c53-b5c6-9f3e23bc23be',   // "My Room" / "Me"
  memory: '68e22340-13eb-43a6-a98e-e369b118b4b6',
});

export const CONTENT_TYPES = Object.freeze({
  letter: '40db2614-8e80-4f71-a072-24ecfd1e504a',
  // audio and photo UUIDs need to be extracted from the database.
  // For now we provide the letter type and leave others as placeholders.
  audio: null,
  photo: null,
});