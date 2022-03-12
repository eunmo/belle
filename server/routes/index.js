const express = require('express');

const crud = require('./crud');
const work = require('./work');

const router = express.Router();
router.use('/crud', crud);
router.use('/work', work);

module.exports = router;
