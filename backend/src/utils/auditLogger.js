/**
 * Simple audit logger.
 * Logs admin actions to the console. In future, can write to DB or file.
 */

function log(action, resource, resourceId = null) {
  const entry = {
    action,
    resource,
    resourceId,
    timestamp: new Date().toISOString(),
  };
  console.log('[AUDIT]', JSON.stringify(entry));
  return entry;
}

module.exports = { log };