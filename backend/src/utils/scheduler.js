/**
 * Scheduling helpers for content publishing.
 * No cron implementation; just utility functions.
 */

function isExpired(expiryDate) {
  return new Date(expiryDate) < new Date();
}

function isAvailable(releaseDate) {
  return new Date(releaseDate) <= new Date();
}

function formatSchedule(releaseDate, expiryDate) {
  return {
    releaseAt: releaseDate,
    expiresAt: expiryDate,
    isReleased: releaseDate ? isAvailable(releaseDate) : true,
    isExpired: expiryDate ? isExpired(expiryDate) : false,
  };
}

module.exports = { isExpired, isAvailable, formatSchedule };