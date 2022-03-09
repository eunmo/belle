const { query } = require('@eunmo/mysql');

function parseRows(rows) {
  return rows.map(({ detail, ...rest }) => ({
    ...JSON.parse(detail),
    ...rest,
  }));
}

async function getWorksByType(type) {
  const rows = await query('SELECT * FROM work WHERE type = ?', [type]);
  return parseRows(rows);
}

async function getWork(id) {
  const rows = await query('SELECT * FROM work WHERE id = ?', [id]);
  const [row] = parseRows(rows);
  return row ?? null;
}

async function getAgentsByWorkId(id) {
  const rows = await query(
    `
    SELECT a.id, a.name, a.type, l.detail
    FROM link l
    JOIN agent a ON a.id = l.agentId
    WHERE l.workId = ?
    `,
    [id]
  );
  return parseRows(rows);
}

module.exports = {
  getWorksByType,
  getWork,
  getAgentsByWorkId,
};
