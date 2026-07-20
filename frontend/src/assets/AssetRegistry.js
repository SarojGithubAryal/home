/**
 * AssetRegistry.js
 *
 * The single resolver between backend semantic identifiers and local
 * frontend assets.
 *
 * Per 08_ASSET_ARCHITECTURE.md:
 *  - The backend never returns filenames — only semantic identifiers
 *    (e.g. heroVariant, paperStyle, decorationPack, palette).
 *  - This file is the ONLY place semantic identifiers are mapped to real
 *    asset paths.
 *  - This file provides fallback behavior when a specific identifier has
 *    no matching asset (room-specific -> room default -> global default).
 *  - This file contains NO business logic and NO backend vocabulary
 *    definitions — it does not validate or restrict which identifiers the
 *    backend is "allowed" to send. It simply attempts to resolve whatever
 *    string it receives, and falls back gracefully if it can't.
 *
 * Bundled assets live outside src/ per 08_ASSET_ARCHITECTURE.md section 2
 * (HOME/assets/frontend/...). The path constants below are placeholders
 * describing the expected directory shape; update them to match the real
 * asset directory once it is provided. No page-level code should ever
 * import a path directly — only through the resolver functions below.
 */
/**
 * Temporary: the only hero asset currently in the project. Imported
 * statically so Vite bundles it correctly (it lives inside src/, so it
 * must be an ES import, not a raw URL string). This is used as the
 * global hero fallback below until dedicated Home/theme-specific hero
 * assets exist. No component imports this directly — only
 * AssetRegistry does, per the asset architecture rule that components
 * never know asset filenames.
 */

import { getPath } from '../utils/helpers';

/**
 * Real, statically-imported per-room assets. Mom is currently the only
 * room with actual asset files in the project — this is a content-
 * availability fact, not a frontend assumption about which room matters.
 * Every other room (Dad, Me, Grandfather, Friend, Pet, future rooms)
 * automatically renders correctly the moment its own assets are added
 * here; until then, resolveRoomHero()/resolveRoomRecommendationArtwork()
 * fall through cleanly to GLOBAL_FALLBACKS.hero for any unregistered
 * room slug — never a broken/missing image, never a crash.
 */
import momHeroRoomAsset from './rooms/mom/hero/hero-room.webp';
import momRecommendationEnvelopeAsset from './rooms/mom/recommendation/recommendation-envelope.webp';

// ---------------------------------------------------------------------------
// Root asset path
// Per 08_ASSET_ARCHITECTURE.md section 2: assets live outside frontend/src.
// Vite serves this via the public/ or an aliased static path — update this
// root if the actual build configuration differs.
// ---------------------------------------------------------------------------

const ASSET_ROOT = '/assets';

// ---------------------------------------------------------------------------
// Category path builders
// Mirrors 08_ASSET_ARCHITECTURE.md section 3 (asset categories).
// Each builder only constructs a path shape — it does not guarantee the
// file exists. Existence/fallback is handled by resolveAsset().
// ---------------------------------------------------------------------------

const CATEGORY_PATHS = {
  room: (roomSlug, variant) => `${ASSET_ROOT}/rooms/${roomSlug}/${variant}`,
  roomDefault: (roomSlug, variant) => `${ASSET_ROOT}/rooms/${roomSlug}/default/${variant}`,
  theme: (variant) => `${ASSET_ROOT}/themes/${variant}`,
  paper: (variant) => `${ASSET_ROOT}/papers/${variant}`,
  decoration: (variant) => `${ASSET_ROOT}/decorations/${variant}`,
  icon: (variant) => `${ASSET_ROOT}/icons/${variant}`,
  overlay: (variant) => `${ASSET_ROOT}/overlays/${variant}`,
  shared: (variant) => `${ASSET_ROOT}/shared/${variant}`,
  audio: (variant) => `${ASSET_ROOT}/audio/${variant}`,
};

// ---------------------------------------------------------------------------
// Global fallback assets
// Per 08_ASSET_ARCHITECTURE.md section 12: the last link in every fallback
// chain is a global default. These must always exist in the bundled asset
// directory.
// ---------------------------------------------------------------------------

const GLOBAL_FALLBACKS = {
  // TEMPORARY: using the only hero asset that currently exists as the
  // universal fallback, until dedicated global/theme default assets are
  // added. Update this back to a real shared default path once one
  // exists — no calling code needs to change when that happens.
  hero: momHeroRoomAsset,
  // TEMPORARY: theme/overlay imagery doesn't matter for now, so this
  // reuses the same real, statically-imported Mom hero asset rather
  // than a constructed-but-unverified path — guaranteed to render
  // instead of silently breaking. Replace with a dedicated theme/
  // overlay default asset once one exists; no calling code changes
  // when that happens.
  overlay: momHeroRoomAsset,
  paper: `${ASSET_ROOT}/shared/paper-default`,
  decoration: `${ASSET_ROOT}/shared/decoration-default`,
  icon: `${ASSET_ROOT}/shared/icon-default`,
  audio: `${ASSET_ROOT}/shared/audio-default`,
  loading: `${ASSET_ROOT}/shared/loading-default`,
  empty: `${ASSET_ROOT}/shared/empty-default`,
  error: `${ASSET_ROOT}/shared/error-default`,
};

// ---------------------------------------------------------------------------
// Internal resolution helper
//
// Attempts each candidate path in order and returns the first that the
// registry considers resolvable. Since the registry cannot perform a real
// filesystem check at runtime for arbitrary paths, "resolvable" here means
// "a non-empty candidate was produced" — actual missing-file handling
// (e.g. broken image) is left to the browser/img onError in consuming
// components, which should always pass a fallback via this registry
// rather than hardcoding one inline.
// ---------------------------------------------------------------------------

function firstResolvable(candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Room hero resolution
//
// Fallback chain per 08_ASSET_ARCHITECTURE.md section 12 example:
//   room + variant  ->  room default  ->  global default
// ---------------------------------------------------------------------------

/**
 * Manifest of real, statically-imported room assets, keyed by roomSlug.
 * Only rooms with actual bundled asset files belong here — currently
 * only "mom". Adding a new room's real assets later is purely additive:
 * import the file(s) above, add one new key below, and
 * resolveRoomHero()/resolveRoomRecommendationArtwork() pick it up
 * automatically with no other code changes.
 *
 * This guard exists to prevent a class of bug where a
 * constructed-but-nonexistent path (e.g. built from a backend-sent
 * roomSlug/variant string) gets treated as "resolvable" simply because
 * it's a non-empty string — firstResolvable() cannot verify a path
 * actually points to a real bundled file. Only a genuine ES import,
 * guaranteed to exist at build time, may be registered here.
 */
const ROOM_ASSETS = {
  mom: {
    hero: {
      default: momHeroRoomAsset,
    },
    recommendation: {
      default: momRecommendationEnvelopeAsset,
    },
  },
};

/**
 * Resolves a room's hero background asset. Any roomSlug not present in
 * ROOM_ASSETS (e.g. "dad", "grandfather" before their assets exist)
 * falls through cleanly to the global default — every room renders
 * something correct today, and automatically renders its own content
 * the moment it's registered above.
 *
 * @param {string} roomSlug - e.g. "mom", "dad"
 * @param {string} [heroVariant] - semantic identifier from backend, e.g. "rain"
 * @returns {string} resolved asset path
 */
export function resolveRoomHero(roomSlug, heroVariant) {
  const candidates = [];
  const roomManifest = roomSlug ? ROOM_ASSETS[roomSlug]?.hero : null;

  if (roomManifest && heroVariant && roomManifest[heroVariant]) {
    candidates.push(roomManifest[heroVariant]);
  }
  if (roomManifest?.default) {
    candidates.push(roomManifest.default);
  }
  candidates.push(GLOBAL_FALLBACKS.hero);

  return firstResolvable(candidates);
}

/**
 * Resolves a room's recommendation/featured artwork asset. Same
 * per-room fallback behavior as resolveRoomHero() above.
 *
 * @param {string} roomSlug
 * @param {string} [artworkVariant] - semantic identifier from backend
 * @returns {string} resolved asset path
 */
export function resolveRoomRecommendationArtwork(roomSlug, artworkVariant) {
  const candidates = [];
  const roomManifest = roomSlug ? ROOM_ASSETS[roomSlug]?.recommendation : null;

  if (roomManifest && artworkVariant && roomManifest[artworkVariant]) {
    candidates.push(roomManifest[artworkVariant]);
  }
  if (roomManifest?.default) {
    candidates.push(roomManifest.default);
  }
  candidates.push(GLOBAL_FALLBACKS.hero);

  return firstResolvable(candidates);
}

/**
 * Resolves an arbitrary named section artwork asset within a room
 * (per 08_ASSET_ARCHITECTURE.md section 4: "Section artwork").
 *
 * @param {string} roomSlug
 * @param {string} sectionName - e.g. "hear", "read", "see", "memory"
 * @param {string} [variant] - semantic identifier from backend
 * @returns {string} resolved asset path
 */
export function resolveRoomSectionArtwork(roomSlug, sectionName, variant) {
  const candidates = [];

  if (roomSlug && sectionName && variant) {
    candidates.push(CATEGORY_PATHS.room(roomSlug, `${sectionName}-${variant}`));
  }
  if (roomSlug && sectionName) {
    candidates.push(CATEGORY_PATHS.roomDefault(roomSlug, sectionName));
  }
  candidates.push(GLOBAL_FALLBACKS.hero);

  return firstResolvable(candidates);
}

// ---------------------------------------------------------------------------
// Home hero resolution
//
// The Home Experience is not room-scoped, so resolveRoomHero() does not
// apply. Per 08_ASSET_ARCHITECTURE.md section 5, Home hero variants are
// weather/time-of-day/seasonal identifiers — the same vocabulary as the
// Theme asset category — so this resolver draws from the theme category,
// but (unlike resolveTheme(), whose fallback is an overlay asset meant
// for scrim/backdrop use) falls back to the hero-specific global default,
// since this resolver's output is used as an actual hero background.
// ---------------------------------------------------------------------------

/**
 * Manifest of theme-variant hero assets that are actually real,
 * statically-imported files. Until dedicated per-variant hero images
 * exist in the project, this stays empty and resolveHomeHero() always
 * falls through to the guaranteed global fallback below.
 *
 * This exists specifically to prevent a class of bug where a
 * constructed-but-nonexistent path (e.g. built from a backend-sent
 * heroVariant string) gets treated as "resolvable" simply because it's
 * a non-empty string — firstResolvable() cannot verify a path actually
 * points to a real bundled file. Registering a real variant here (a
 * genuine ES import, guaranteed to exist at build time) is the only
 * way a variant-specific hero should ever be added.
 */
const HOME_HERO_VARIANTS = {
  // e.g. rain: rainHeroAsset,
};

/**
 * Resolves the Home page's hero background asset.
 *
 * @param {string} [heroVariant] - semantic identifier from backend, e.g. "rain"
 * @returns {string} resolved asset path
 */
export function resolveHomeHero(heroVariant) {
  const candidates = [];

  if (heroVariant && HOME_HERO_VARIANTS[heroVariant]) {
    candidates.push(HOME_HERO_VARIANTS[heroVariant]);
  }
  candidates.push(GLOBAL_FALLBACKS.hero);

  return firstResolvable(candidates);
}

// ---------------------------------------------------------------------------
// Theme resolution
// Per 08_ASSET_ARCHITECTURE.md section 5.
// ---------------------------------------------------------------------------

/**
 * Resolves a theme/atmosphere asset (e.g. ambient overlay or background
 * texture representing the theme).
 *
 * @param {string} [themeVariant] - semantic identifier from backend, e.g. "warm"
 * @returns {string} resolved asset path
 */
export function resolveTheme(themeVariant) {
  const candidates = [];

  if (themeVariant) {
    candidates.push(CATEGORY_PATHS.theme(themeVariant));
  }
  candidates.push(GLOBAL_FALLBACKS.overlay);

  return firstResolvable(candidates);
}

// ---------------------------------------------------------------------------
// Paper resolution
// Per 08_ASSET_ARCHITECTURE.md section 6.
// ---------------------------------------------------------------------------

/**
 * Resolves a paper-style texture/background asset.
 *
 * @param {string} [paperStyle] - semantic identifier from backend, e.g. "notebook"
 * @returns {string} resolved asset path
 */
export function resolvePaper(paperStyle) {
  const candidates = [];

  if (paperStyle) {
    candidates.push(CATEGORY_PATHS.paper(paperStyle));
  }
  candidates.push(GLOBAL_FALLBACKS.paper);

  return firstResolvable(candidates);
}

// ---------------------------------------------------------------------------
// Decoration resolution
// Per 08_ASSET_ARCHITECTURE.md section 7. Decorations are optional, so
// callers should treat a null return as "render nothing" rather than an
// error.
// ---------------------------------------------------------------------------

/**
 * Resolves a decoration asset. Returns null if no decoration identifier
 * was supplied, since decorations are optional and absence is valid.
 *
 * @param {string} [decorationPack] - semantic identifier from backend, e.g. "flowers"
 * @returns {string|null} resolved asset path, or null if none requested
 */
export function resolveDecoration(decorationPack) {
  if (!decorationPack) return null;

  const candidates = [CATEGORY_PATHS.decoration(decorationPack), GLOBAL_FALLBACKS.decoration];

  return firstResolvable(candidates);
}

// ---------------------------------------------------------------------------
// Icon resolution
// Per 08_ASSET_ARCHITECTURE.md section 8. Icons never carry business
// meaning — they are resolved purely by their functional name.
// ---------------------------------------------------------------------------

/**
 * Resolves a reusable icon asset.
 *
 * @param {string} iconName - e.g. "hear", "read", "see", "memory", "back", "home"
 * @returns {string} resolved asset path
 */
export function resolveIcon(iconName) {
  const candidates = [];

  if (iconName) {
    candidates.push(CATEGORY_PATHS.icon(iconName));
  }
  candidates.push(GLOBAL_FALLBACKS.icon);

  return firstResolvable(candidates);
}

// ---------------------------------------------------------------------------
// Shared asset resolution
// Per 08_ASSET_ARCHITECTURE.md section 9.
// ---------------------------------------------------------------------------

/**
 * Resolves the shared loading illustration/animation asset.
 * @returns {string} resolved asset path
 */
export function resolveLoadingAsset() {
  return GLOBAL_FALLBACKS.loading;
}

/**
 * Resolves the shared empty-state illustration asset.
 * @returns {string} resolved asset path
 */
export function resolveEmptyStateAsset() {
  return GLOBAL_FALLBACKS.empty;
}

/**
 * Resolves the shared error-state illustration asset.
 * @returns {string} resolved asset path
 */
export function resolveErrorStateAsset() {
  return GLOBAL_FALLBACKS.error;
}

// ---------------------------------------------------------------------------
// Audio resolution
// ---------------------------------------------------------------------------

/**
 * Resolves an ambient/audio asset.
 *
 * @param {string} [audioVariant] - semantic identifier from backend
 * @returns {string} resolved asset path
 */
export function resolveAudio(audioVariant) {
  const candidates = [];

  if (audioVariant) {
    candidates.push(CATEGORY_PATHS.audio(audioVariant));
  }
  candidates.push(GLOBAL_FALLBACKS.audio);

  return firstResolvable(candidates);
}

// ---------------------------------------------------------------------------
// Generic experience-level resolver
//
// Many backend experience payloads (Home, Room, Hear/Read/See/Memory) will
// bundle several semantic identifiers together under a "theme" or "assets"
// object. This helper resolves a whole such object at once, using getPath()
// so a missing individual field degrades to that field's own fallback
// rather than throwing.
// ---------------------------------------------------------------------------

/**
 * Resolves a full theme bundle as commonly returned inside an Experience
 * payload, e.g. { heroVariant, paperStyle, decorationPack }.
 *
 * @param {object} themeData - raw theme-related fields from an API response
 * @param {object} [context] - optional context for room-scoped resolution
 * @param {string} [context.roomSlug]
 * @returns {{ hero: string, paper: string, decoration: string|null, theme: string }}
 */
export function resolveExperienceAssets(themeData = {}, context = {}) {
  const heroVariant = getPath(themeData, 'heroVariant', null);
  const paperStyle = getPath(themeData, 'paperStyle', null);
  const decorationPack = getPath(themeData, 'decorationPack', null);
  const palette = getPath(themeData, 'palette', null);

  return {
    hero: context.roomSlug
      ? resolveRoomHero(context.roomSlug, heroVariant)
      : resolveTheme(heroVariant),
    paper: resolvePaper(paperStyle),
    decoration: resolveDecoration(decorationPack),
    theme: resolveTheme(palette),
  };
}

const AssetRegistry = {
  resolveRoomHero,
  resolveRoomRecommendationArtwork,
  resolveRoomSectionArtwork,
  resolveHomeHero,
  resolveTheme,
  resolvePaper,
  resolveDecoration,
  resolveIcon,
  resolveLoadingAsset,
  resolveEmptyStateAsset,
  resolveErrorStateAsset,
  resolveAudio,
  resolveExperienceAssets,
};

export default AssetRegistry;