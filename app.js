'use strict';

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const createError = require('http-errors');

const apiRouter = require('routes/apiRouter');
const errorsMiddleware = require('middlewares/errorsMiddleware');

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use(errorsMiddleware);

module.exports = app;
