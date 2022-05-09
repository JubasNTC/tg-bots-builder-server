'use strict';

const yup = require('yup');

const ApiError = require('utils/errors/ApiError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof yup.ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Непредвиденная ошибка' });
};
