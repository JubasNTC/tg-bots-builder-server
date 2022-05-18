'use strict';

const yup = require('yup');

const botSchema = yup
  .object({
    name: yup
      .string()
      .max(30, 'Максимальная длина 30 символов')
      .required('Обязательное поле'),
    description: yup
      .string()
      .max(50, 'Максимальная длина 50 символов')
      .default(''),
    startText: yup
      .string()
      .max(300, 'Максимальная длина 300 символов')
      .default(''),
    helpText: yup
      .string()
      .max(300, 'Максимальная длина 300 символов')
      .default(''),
    settingsText: yup
      .string()
      .max(300, 'Максимальная длина 300 символов')
      .default(''),
    botUsername: yup
      .string()
      .min(5, 'Минимальная длина 5 символов')
      .max(32, 'Максимальная длина 32 символов')
      .required('Обязательное поле'),
    botToken: yup
      .string()
      .length(46, 'Токен должен имеет длину в 46 символов')
      .required('Обязательное поле'),
  })
  .noUnknown(true);

module.exports = { botSchema };
