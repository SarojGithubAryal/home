/**
 * Placeholder admin authentication middleware.
 * In v1, it simply allows all requests (single‑owner, no login).
 * Future: integrate with a real authentication mechanism.
 */
module.exports = function adminAuth(req, res, next) {
  // Allow all requests for now
  next();
};