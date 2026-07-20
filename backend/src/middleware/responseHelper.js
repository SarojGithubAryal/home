/**
 * Standardised response helpers enforcing the Navigation Contract.
 *
 * Every success response: { success: true, navigation: { experience, params } | null, data }
 * Every error response:   { success: false, navigation: null, error: { code, message } }
 */

/**
 * @param {Response} res
 * @param {*} data
 * @param {{ experience: string, params: Object }} [destination]
 */
function sendSuccess(res, data, destination = null) {
  const payload = {
    success: true,
    navigation: destination
      ? { experience: destination.experience, params: destination.params }
      : null,
    data,
  };
  res.json(payload);
}

/**
 * @param {Response} res
 * @param {number} statusCode
 * @param {string} code
 * @param {string} message
 */
function sendError(res, statusCode, code, message) {
  const payload = {
    success: false,
    navigation: null,
    error: { code, message },
  };
  res.status(statusCode).json(payload);
}

module.exports = { sendSuccess, sendError };