const express = require('express');
const {
  addWork,
  editWork,
  addAgent,
  editAgent,
  removeAgent,
  addLinks,
  removeLink,
} = require('../db');

const router = express.Router();

router.post('/work', async (req, res) => {
  const { title, type, stars, released, done, detail } = req.body;
  const { insertId: id } = await addWork(
    title,
    type,
    stars,
    released,
    done,
    detail
  );
  res.json({ id });
});

router.put('/work', async (req, res) => {
  const { id, title, type, stars, released, done, detail } = req.body;
  await editWork(id, title, type, stars, released, done, detail);
  res.sendStatus(200);
});

module.exports = router;
