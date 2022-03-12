const {
  addWork,
  editWork,
  addAgent,
  editAgent,
  removeAgent,
  addLinks,
  removeLink,
} = require('./dml');
const { getWorksByType, getWork, getAgentsByWorkId } = require('./query');

module.exports = {
  addWork,
  editWork,
  addAgent,
  editAgent,
  removeAgent,
  addLinks,
  removeLink,
  getWorksByType,
  getWork,
  getAgentsByWorkId,
};
