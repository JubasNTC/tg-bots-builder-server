'use strict';

const yup = require('yup');

const registrationSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(12).max(64).required(),
});

module.exports = { registrationSchema };
