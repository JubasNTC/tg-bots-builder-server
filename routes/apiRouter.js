'use strict';

const express = require('express');

const usersRouter = require('./usersRouter');
const botsRouter = require('./botsRouter');
const flowsRouter = require('./flowsRouter');

const router = express.Router();

router.use('/users', usersRouter);

router.use('/bots', botsRouter);

router.use('/flows', flowsRouter);

router.get('/favicon.ico', (req, res) => res.sendStatus(200));

module.exports = router;
