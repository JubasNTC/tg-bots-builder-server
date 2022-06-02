'use strict';

const yup = require('yup');
const validator = require('validator');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

const dateSchema = yup
  .string()
  .test('date-schema', 'Дата должна быть в формате: DD-MM-YYYY', (value) =>
    dayjs(value, 'DD-MM-YYYY', true).isValid()
  )
  .required();

const dateTimeHoursMinutesSchema = yup
  .string()
  .test(
    'date-time-hours-minutes-schema',
    'Дата должна быть в формате: DD-MM-YYYY HH:mm',
    (value) => dayjs(value, 'DD-MM-YYYY HH:mm', true).isValid()
  )
  .required();

const dateTimeHoursMinutesSecondsSchema = yup
  .string()
  .test(
    'date-time-hours-minutes-seconds-schema',
    'Дата должна быть в формате: DD-MM-YYYY HH:mm:ss',
    (value) => dayjs(value, 'DD-MM-YYYY HH:mm:ss', true).isValid()
  )
  .required();

const emailSchema = yup
  .string()
  .email('Email должен быть в формате: example@domain.com')
  .required();

const phoneSchema = yup
  .string()
  .test('phone-schema', 'Номер должен быть в формате: +XYYYZZZZZZZ', (value) =>
    validator.isMobilePhone(value, 'ru-RU', { strictMode: true })
  )
  .required();

const integerSchema = yup
  .string()
  .trim()
  .matches(/^[-]?[0-9]+$/, 'Число должно быть в формате: целое число')
  .required();

const positiveIntegerSchema = yup
  .string()
  .trim()
  .matches(/^[0-9]+$/, 'Число должно быть в формате: целое положительное число')
  .required();

const negativeIntegerSchema = yup
  .string()
  .trim()
  .matches(
    /^-[0-9]+$/,
    'Число должно быть в формате: целое отрицательное число'
  )
  .required();

const decimalSchema = yup
  .string()
  .trim()
  .matches(
    /^[-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
    'Число должно быть в формате: десятичная дробь через точку'
  )
  .required();

const positiveDecimalSchema = yup
  .string()
  .trim()
  .matches(
    /^([0-9]+\.?[0-9]*|\.[0-9]+)$/,
    'Число должно быть в формате: положительная десятичная дробь через точку'
  )
  .required();

const negativeDecimalSchema = yup
  .string()
  .trim()
  .matches(
    /^-([0-9]+\.?[0-9]*|\.[0-9]+)$/,
    'Число должно быть в формате: отрицательная десятичная дробь через точку'
  )
  .required();

const validatorMapping = {
  date: dateSchema,
  dateTimeHoursMinutes: dateTimeHoursMinutesSchema,
  dateTimeHoursMinutesSeconds: dateTimeHoursMinutesSecondsSchema,
  email: emailSchema,
  phone: phoneSchema,
  integer: integerSchema,
  positiveInteger: positiveIntegerSchema,
  negativeInteger: negativeIntegerSchema,
  decimal: decimalSchema,
  positiveDecimal: positiveDecimalSchema,
  negativeDecimal: negativeDecimalSchema,
};

// try {
//   const v = dateTimeHoursMinutesSchema.validateSync('21-03-2022 23:54');
//   console.dir(v, { depth: 10 });
// } catch (e) {
//   console.dir(e, { depth: 10 });
// }

// const test1 = schema.validateSync({ date: '21-02-2018' });
// const test2 = schema.validateSync({ date: '21-02-2018' });
//
// console.dir({ test1, test2 }, { depth: 10 });

module.exports = { validatorMapping };
