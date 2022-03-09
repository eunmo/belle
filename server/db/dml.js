const { dml } = require('@eunmo/mysql');

async function addWork(title, type, released, done, detail) {
  return dml(
    'INSERT INTO work (title, type, released, done, detail) VALUES (?)',
    [[title, type, released, done, JSON.stringify(detail)]]
  );
}

async function editWork(id, title, type, released, done, detail) {
  return dml(
    'UPDATE work SET title = ?, type = ?, released = ?, done = ?, detail = ? WHERE id = ?',
    [title, type, released, done, JSON.stringify(detail), id]
  );
}

async function addAgent(name, type, detail) {
  return dml('INSERT INTO agent (name, type, detail) VALUES (?)', [
    [name, type, JSON.stringify(detail)],
  ]);
}

async function editAgent(id, name, type, detail) {
  return dml('UPDATE agent SET name = ?, type = ?, detail = ? WHERE id = ?', [
    name,
    type,
    JSON.stringify(detail),
    id,
  ]);
}

async function removeAgent(id) {
  return dml('DELETE FROM agent WHERE id = ?', [id]);
}

async function addLinks(workId, agentIds) {
  return dml('INSERT INTO link (workId, agentId, detail) VALUES ?', [
    agentIds.map(({ agentId, detail }) => [
      workId,
      agentId,
      JSON.stringify(detail),
    ]),
  ]);
}

async function removeLink(workId, agentId) {
  return dml('DELETE FROM link WHERE workId = ? and agentId = ?', [
    workId,
    agentId,
  ]);
}

module.exports = {
  addWork,
  editWork,
  addAgent,
  editAgent,
  removeAgent,
  addLinks,
  removeLink,
};
