/**
 * Mom's room data — the first example of the generic Room object shape.
 * Nothing here is read directly by UI components; they only ever consume
 * whatever room object is passed to RoomDetailPage as a prop.
 *
 * Shape reference:
 * room = {
 *   id, name, icon, quote, updatedAt,
 *   assets: { hero, recommendation },
 *   recommendation: { badge, title, description, primaryAction, secondaryAction },
 *   actions: [ { id, type, icon, title, subtitle, count } ],
 *   alwaysHere: { title, icon, description, items: [...], moreLabel },
 *   footer: { icon, lines }
 * }
 */

const momRoom = {
  id: 'mom',
  name: "Mom's Room",
  icon: '🌸',
  quote: 'Some love never waits to be asked for. 💗',
  updatedAt: '3 days ago',

  assets: {
    hero: '/src/assets/rooms/mom/hero/hero-room.webp',
    recommendation: '/src/assets/rooms/mom/recommendation/recommendation-envelope.webp',
  },

  recommendation: {
    badge: 'Waiting for you 💗',
    title: 'I thought this might help today. 💗',
    description: 'A little comfort from Mom, just for this moment.',
    primaryAction: { type: 'play', label: 'Play' },
    secondaryAction: { type: 'open', label: 'Open' },
  },

  actions: [
    {
      id: 'hear',
      type: 'hear',
      icon: '🎧',
      title: 'I want to hear',
      subtitle: 'Her voice always knows how to comfort me.',
      count: 5,
    },
    {
      id: 'read',
      type: 'read',
      icon: '📖',
      title: 'I want to read',
      subtitle: 'Letters and words that feel like a warm hug.',
      count: 3,
    },
    {
      id: 'see',
      type: 'see',
      icon: '🖼️',
      title: 'I want to see',
      subtitle: 'Moments that make me smile every time.',
      count: 8,
    },
    {
      id: 'memory',
      type: 'memory',
      icon: '⭐',
      title: 'Sit with a memory',
      subtitle: 'Beautiful memories to visit whenever I miss her.',
      count: 14,
    },
  ],

  alwaysHere: {
    title: 'Always Here',
    icon: '🌿',
    description: 'The things that are always here for you, no matter what.',
    items: [
      { id: 'lullaby', title: 'Her Lullaby', duration: '2:34', thumbnail: null },
      { id: 'enough', title: 'You are enough', duration: '1:48', thumbnail: null },
      { id: 'proud', title: "I'm always proud of you", duration: '2:12', thumbnail: null },
    ],
    moreLabel: 'More comfort',
  },

  footer: {
    icon: '💗',
    lines: ['You can always come back here.', "There's always something waiting for you."],
  },
};

export default momRoom;