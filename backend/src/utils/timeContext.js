/**
 * Returns both the greeting time-of-day and the theme time variant
 * based on the server's local hour.
 *
 * timeOfDay:    used for greeting selection ('morning','afternoon','evening','night')
 * timeVariant:  used for time‑sensitive artwork ('morning','day','evening','night')
 *
 * Mapping:
 *   05:00–09:59 → morning
 *   10:00–16:59 → afternoon (greeting) / day (artwork)
 *   17:00–19:59 → evening
 *   20:00–04:59 → night
 */
function getTimeContext(date = new Date()) {
  const hour = date.getHours();
  let timeOfDay, timeVariant;

  if (hour >= 5 && hour < 10) {
    timeOfDay = 'morning';
    timeVariant = 'morning';
  } else if (hour >= 10 && hour < 17) {
    timeOfDay = 'afternoon';
    timeVariant = 'day';
  } else if (hour >= 17 && hour < 20) {
    timeOfDay = 'evening';
    timeVariant = 'evening';
  } else {
    timeOfDay = 'night';
    timeVariant = 'night';
  }

  return { timeOfDay, timeVariant };
}

module.exports = getTimeContext;