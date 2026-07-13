import greetings from '../mock/greetings';

/**
 * Returns the greeting for the current (or given) time of day.
 * Backend can later replace this with a real API call and even
 * inject a user's name / timezone-aware logic.
 */
export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  let timeOfDay = 'morning';

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }

  return {
    text: greetings[timeOfDay] || greetings.evening,
    timeOfDay,
  };
}