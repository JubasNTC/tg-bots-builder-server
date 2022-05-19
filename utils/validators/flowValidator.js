'use strict';

const yup = require('yup');
const { isUUIDv4 } = require('./commonValidator');

const initialFlowCreationSchema = yup
  .object({
    name: yup
      .string()
      .max(30, 'Максимальная длина 30 символов')
      .required('Обязательное поле'),
    description: yup
      .string()
      .defined()
      .max(50, 'Максимальная длина 50 символов')
      .default(''),
    triggers: yup
      .string()
      .max(300, 'Максимальная длина 300 символов')
      .required('Должен быть минимум один триггер'),
    botsAttachment: yup.array().of(yup.string()).required('Обязательное поле'),
  })
  .noUnknown(true);

const flowSettingEnableSchema = yup
  .object({
    enabled: yup.boolean().required('Обязательное поле'),
  })
  .noUnknown(true);

const taskFlowCreationSchema = yup
  .object({
    prevTaskId: yup.string().defined().default(''),
    taskType: yup.string().required('Обязательное поле'),
    taskData: yup.object().required('Обязательное поле'),
  })
  .noUnknown(true);

const taskFlowEditSchema = yup
  .object({
    taskData: yup.object().required('Обязательное поле'),
  })
  .noUnknown(true);

const taskFlowFiltersSchema = yup
  .object({
    filters: yup.object().nullable(true),
  })
  .noUnknown(true);

module.exports = {
  initialFlowCreationSchema,
  flowSettingEnableSchema,
  taskFlowCreationSchema,
  taskFlowEditSchema,
  taskFlowFiltersSchema,
};
