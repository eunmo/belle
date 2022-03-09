const { dml } = require('@eunmo/mysql');

async function addWork(title, released, done) {
  return dml('INSERT INTO work (title, released, done) VALUES (?)', [
    [title, released, done],
  ]);
}

async function editWork(id, title, released, done) {
  return dml('UPDATE work SET title = ?, released = ?, done = ? WHERE id = ?', [
    title,
    released,
    done,
    id,
  ]);
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
  return dml('INSERT INTO link (workId, agentId) VALUES ?', [
    agentIds.map((agentId) => [workId, agentId]),
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
