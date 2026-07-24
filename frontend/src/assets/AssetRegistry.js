/**
 * AssetRegistry
 *
 * Version 1
 *
 * A single source of truth for all bundled frontend assets.
 *
 * No component should import images directly.
 * Components only ask AssetRegistry for what they need.
 *
 * TIME-VARIANT THEMES: theme.timeVariant is now returned by the
 * backend (morning / day / evening / night) and is the SINGLE source
 * of truth for time — this file never calculates time itself. Each
 * page (Home, Mood Landing, Room) passes the backend's timeVariant
 * into the corresponding getter below; every getter falls back to
 * 'day' if timeVariant is missing or unrecognized.
 *
 * ROOM THEME CONFIG: each room theme still returns { image, position }
 * — position (background-position) is independent of timeVariant and
 * stays fixed per room regardless of which time-of-day image is
 * showing.
 */

/* --------------------------
   HOME
   NOTE: the existing day image on disk is "welcome_theme.webp" (not
   "home_theme.webp" as referenced in some naming docs) — kept as-is
   per "do not rename existing files." New variants are added as
   siblings of that same base name. If your actual files are instead
   named "home_theme_morning.webp" etc., only these three import lines
   need to change.
--------------------------- */

import WelcomeTheme from "./home/welcome_theme.webp";
import WelcomeThemeMorning from "./home/welcome_theme_morning.webp";
import WelcomeThemeEvening from "./home/welcome_theme_evening.webp";
import WelcomeThemeNight from "./home/welcome_theme_night.webp";

/* --------------------------
   MOOD LANDING
--------------------------- */

import MoodLandingTheme from "./home/mood_landing_theme.webp";
import MoodLandingThemeMorning from "./home/mood_landing_theme_morning.webp";
import MoodLandingThemeEvening from "./home/mood_landing_theme_evening.webp";
import MoodLandingThemeNight from "./home/mood_landing_theme_night.webp";

/* --------------------------
   EXPERIENCE ICONS
--------------------------- */

import HearIcon from "./experience/hear_icon.webp";
import ReadIcon from "./experience/read_icon.webp";
import SeeIcon from "./experience/see_icon.webp";
import MemoryIcon from "./experience/memory_icon.webp";

/* --------------------------
   EXPERIENCE LAYOUTS
--------------------------- */

import ReadLayout from "./experience/read_layout.webp";
import SeeLayout from "./experience/see_layout.webp";
import MemoryLayout from "./experience/memory_layout.webp";

/* --------------------------
   ROOM THEMES
--------------------------- */

import MomTheme from "./rooms/mom/mom_theme.webp";
import MomThemeMorning from "./rooms/mom/mom_theme_morning.webp";
import MomThemeEvening from "./rooms/mom/mom_theme_evening.webp";
import MomThemeNight from "./rooms/mom/mom_theme_night.webp";

import DadTheme from "./rooms/dad/dad_theme.webp";
import DadThemeMorning from "./rooms/dad/dad_theme_morning.webp";
import DadThemeEvening from "./rooms/dad/dad_theme_evening.webp";
import DadThemeNight from "./rooms/dad/dad_theme_night.webp";

import MeTheme from "./rooms/me/me_theme.webp";
import MeThemeMorning from "./rooms/me/me_theme_morning.webp";
import MeThemeEvening from "./rooms/me/me_theme_evening.webp";
import MeThemeNight from "./rooms/me/me_theme_night.webp";

import MemoryTheme from "./rooms/memory/memory_theme.webp";
import MemoryThemeMorning from "./rooms/memory/memory_theme_morning.webp";
import MemoryThemeEvening from "./rooms/memory/memory_theme_evening.webp";
import MemoryThemeNight from "./rooms/memory/memory_theme_night.webp";
// import GrandfatherTheme from "./rooms/grandfather/grandfather_theme.webp";

/* --------------------------
   ROOM CARDS
--------------------------- */

import MomCard from "./rooms/mom/mom_card.webp";
import DadCard from "./rooms/dad/dad_card.webp";
import MeCard from "./rooms/me/me_card.webp";
import MemoryCard from "./rooms/memory/memory_card.webp";

/**
 * Grandfather card is optional.
 * Remove the comment once the file exists.
 */
// import GrandfatherCard from "./rooms/grandfather/grandfather_card.webp";

const EXPERIENCE = {
  icons: {
    hear: HearIcon,
    read: ReadIcon,
    see: SeeIcon,
    memory: MemoryIcon,
  },

  layouts: {
    read: ReadLayout,
    see: SeeLayout,
    memory: MemoryLayout,
  },
};

/**
 * Each room's `position` (background-position) stays fixed regardless
 * of timeVariant — only the image changes by time of day, not the
 * framing. Position values are the manually-tuned ones already in
 * use; unchanged by this refactor.
 */
const ROOM_POSITIONS = {
  mom: "center 200%",
  dad: "center 225%",
  me: "center 280%",
  memory: "center 250%",
  grandfather: "center center",
};

/**
 * ROOM CARDS — unrelated to timeVariant, unchanged.
 */
const ROOM_CARDS = {
  mom: MomCard,
  dad: DadCard,
  me: MeCard,
  memory: MemoryCard,
  // grandfather: GrandfatherCard,
};

/* --------------------------
   TIME-VARIANT THEME ASSETS
   (home, moodLanding, mom, dad, me, memory)
--------------------------- */
const TIME_THEME_ASSETS = {
  home: {
    morning: WelcomeThemeMorning,
    day: WelcomeTheme,
    evening: WelcomeThemeEvening,
    night: WelcomeThemeNight,
  },
  moodLanding: {
    morning: MoodLandingThemeMorning,
    day: MoodLandingTheme,
    evening: MoodLandingThemeEvening,
    night: MoodLandingThemeNight,
  },
  mom: {
    morning: MomThemeMorning,
    day: MomTheme,
    evening: MomThemeEvening,
    night: MomThemeNight,
  },
  dad: {
    morning: DadThemeMorning,
    day: DadTheme,
    evening: DadThemeEvening,
    night: DadThemeNight,
  },
  me: {
    morning: MeThemeMorning,
    day: MeTheme,
    evening: MeThemeEvening,
    night: MeThemeNight,
  },
  memory: {
    morning: MemoryThemeMorning,
    day: MemoryTheme,
    evening: MemoryThemeEvening,
    night: MemoryThemeNight,
  },
};

/**
 * Resolves the time-sensitive theme asset for the given asset group key
 * and variant. Falls back to 'day' if the variant is missing/invalid,
 * and falls back to the group's own day image if the requested variant
 * somehow isn't in the map (defensive — should not normally happen).
 *
 * @param {string} groupKey  – 'home' | 'moodLanding' | 'mom' | 'dad' | 'me' | 'memory'
 * @param {string} variant   – 'morning' | 'day' | 'evening' | 'night'
 * @returns {*}               the imported image module, or null if the group is unknown
 */
function resolveTimeThemedAsset(groupKey, variant) {
  const group = TIME_THEME_ASSETS[groupKey];
  if (!group) return null;

  const safeVariant = variant && group[variant] ? variant : 'day';
  return group[safeVariant] ?? group.day ?? null;
}

const AssetRegistry = {
  /**
   * Home
   */

  getHomeTheme(timeVariant = 'day') {
    return resolveTimeThemedAsset('home', timeVariant);
  },

  /**
   * Mood Landing — its own asset group, independent of Home.
   */

  getMoodLandingTheme(timeVariant = 'day') {
    return resolveTimeThemedAsset('moodLanding', timeVariant);
  },

  /**
   * Room cards — unrelated to timeVariant.
   */

  getRoomCard(room) {
    return ROOM_CARDS[room] ?? null;
  },

  /**
   * Room themes
   *
   * Returns { image, position } for the given room and timeVariant, or
   * an object with a null image if the room isn't configured. Position
   * is always the room's fixed, manually-tuned framing — it does not
   * vary by timeVariant.
   */

  getRoomTheme(room, timeVariant = 'day') {
    const image = resolveTimeThemedAsset(room, timeVariant);
    const position = ROOM_POSITIONS[room] ?? 'center center';
    return { image, position };
  },

  /**
   * Experience icons
   */

  getExperienceIcon(type) {
    return EXPERIENCE.icons[type] ?? null;
  },

  /**
   * Experience layouts
   */

  getExperienceLayout(type) {
    return EXPERIENCE.layouts[type] ?? null;
  },

  resolveEmptyStateAsset(type = 'default') {
    return null;
  },
};

export default AssetRegistry;