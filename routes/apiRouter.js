'use strict';

const express = require('express');

const usersRouter = require('./usersRouter');
const botsRouter = require('./botsRouter');

const router = express.Router();

router.use('/users', usersRouter);

router.use('/bots', botsRouter);

router.get('/favicon.ico', (req, res) => res.sendStatus(200));

module.exports = router;
