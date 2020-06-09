const express = require('express');
const users = require('./users');

const router = new express.Router();

router.get('/:city', users.getResults);

module.exports = router;