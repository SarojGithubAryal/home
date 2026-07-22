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
 * Later versions can replace these mappings with
 * mood, weather, season and time aware logic
 * without changing any page/component code.
 *
 * ROOM THEME CONFIG: each room theme is now an object of
 * { image, position } rather than a bare image reference. Position is
 * per-image visual composition data (equivalent to CSS
 * background-position), and it lives here — not in RoomPage.css or
 * RoomPage.jsx — because only AssetRegistry knows how each individual
 * image is framed. This also means a future time-of-day system
 * (morning/day/evening/night, each with its own image + position) can
 * be added entirely inside getRoomTheme()'s implementation later
 * without RoomPage ever changing, since RoomPage only ever consumes
 * whatever { image, position } shape getRoomTheme() currently returns.
 */

/* --------------------------
   HOME
--------------------------- */

import WelcomeTheme from "./home/welcome_theme.webp";
import MoodLandingTheme from "./home/mood_landing_theme.webp";

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
import DadTheme from "./rooms/dad/dad_theme.webp";
import MeTheme from "./rooms/me/me_theme.webp";
import MemoryTheme from "./rooms/memory/memory_theme.webp";
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

const HOME = {
  welcome: WelcomeTheme,
  moodLanding: MoodLandingTheme,
};

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
 * Each room's `theme` is { image, position }. `position` is a
 * placeholder value per room for now — final numbers will be tuned
 * later, this only establishes the architecture.
 */
const ROOMS = {
  mom: {
    theme: {
      image: MomTheme,
      position: "center 200%",
    },
    card: MomCard,
  },

  dad: {
    theme: {
      image: DadTheme,
      position: "center 225%",
    },
    card: DadCard,
  },

  me: {
    theme: {
      image: MeTheme,
      position: "center 280%",
    },
    card: MeCard,
  },

  memory: {
    theme: {
      image: MemoryTheme,
      position: "center 250%",
    },
    card: MemoryCard,
  },

  grandfather: {
    // theme: {
    //   image: GrandfatherTheme,
    //   position: "center 50%",
    // },
    // card: GrandfatherCard,
  },
};

const AssetRegistry = {
  /**
   * Home
   */

  getHomeTheme() {
    return HOME.welcome;
  },

  getMoodLandingTheme() {
    return HOME.moodLanding;
  },

  /**
   * Room cards
   */

  getRoomCard(room) {
    return ROOMS[room]?.card ?? null;
  },

  /**
   * Room themes
   *
   * Returns { image, position } for the given room, or null if the
   * room or its theme isn't configured. Callers should never assume
   * position defaults to anything — always read it from here.
   */

  getRoomTheme(room) {
    return ROOMS[room]?.theme ?? null;
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