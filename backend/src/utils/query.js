/**
 * Utility helper for building dynamic WHERE clauses.
 *
 * Example:
 *   const { whereClause, params } = buildWhere({ is_active: true, mood_id: 'abc-123' });
 *   // whereClause = 'WHERE "is_active" = $1 AND "mood_id" = $2'
 *   // params = [true, 'abc-123']
 *
 * @param {Object} conditions - column-value pairs (undefined/null values are skipped)
 * @param {number} startIndex - starting placeholder index (default 1)
 * @returns {{ whereClause: string, params: Array }}
 */
function buildWhere(conditions = {}, startIndex = 1) {
  const keys = Object.keys(conditions).filter(
    (k) => conditions[k] !== undefined && conditions[k] !== null
  );
  if (keys.length === 0) {
    return { whereClause: '', params: [] };
  }

  const params = [];
  const clauses = keys.map((key, i) => {
    params.push(conditions[key]);
    return `"${key}" = $${startIndex + i}`;
  });

  return {
    whereClause: `WHERE ${clauses.join(' AND ')}`,
    params,
  };
}

module.exports = { buildWhere };