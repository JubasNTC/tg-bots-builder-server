'use strict';

const yup = require('yup');
const validator = require('validator');
// const mapValues = require('lodash/mapValues');

const isUUIDv4 = yup
  .string()
  .test('uuidv4-schema', 'Строка должна быть в формате в uuid v4', (value) => {
    return validator.isUUID(value, 4);
  })
  .required();

module.exports = { isUUIDv4 };
