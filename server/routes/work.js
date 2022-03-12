const express = require('express');
const { getWorksByType, getWork, getAgentsByWorkId } = require('../db');

const router = express.Router();

router.get('/type/:type', async (req, res) => {
  const { type } = req.params;
  const works = await getWorksByType(type);
  res.json(works);
});

router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  const work = await getWork(id);
  const agents = await getAgentsByWorkId(id);
  res.json({ work, agents });
});

module.exports = router;
