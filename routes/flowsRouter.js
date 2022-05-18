'use strict';

const express = require('express');

const authMiddleware = require('middlewares/authMiddleware');
const asyncHandler = require('utils/asyncHandler');
const {
  getUserFlows,
  getUserFlowForForm,
  getUserFlowTasks,
  createFlow,
  createUserFlowTask,
  getUserFlowTask,
  updateUserFlowTask,
  updateFlow,
  setFlowEnabled,
  deleteFlow,
  deleteUserFlowTask,
} = require('controllers/flowController');
const {
  initialFlowCreationSchema,
  flowSettingEnableSchema,
  taskFlowCreationSchema,
  taskFlowEditSchema,
} = require('utils/validators/flowValidator');
const { isUUIDv4 } = require('utils/validators/commonValidator');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
    } = req;

    const flows = await getUserFlows(id);

    res.json({ flows });
  })
);

router.get(
  '/:flowId/front',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId },
    } = req;

    isUUIDv4.validateSync(flowId);
    const flow = await getUserFlowForForm(id, flowId);

    res.json({ flow });
  })
);

router.get(
  '/:flowId/tasks',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId },
    } = req;

    isUUIDv4.validateSync(flowId);
    const tasks = await getUserFlowTasks(id, flowId);

    res.json({ tasks });
  })
);

router.get(
  '/:flowId/tasks/:taskId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId, taskId },
    } = req;

    isUUIDv4.validateSync(flowId);
    isUUIDv4.validateSync(taskId);
    const task = await getUserFlowTask(id, flowId, taskId);

    res.json({ task });
  })
);

router.post(
  '/',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      body,
    } = req;

    const flowData = initialFlowCreationSchema.validateSync(body);
    const flow = await createFlow(id, flowData);

    res.json({ flow });
  })
);

router.post(
  '/:flowId/tasks',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId },
      body,
    } = req;

    const { prevTaskId, taskType, taskData } =
      taskFlowCreationSchema.validateSync(body);
    const taskId = await createUserFlowTask(
      id,
      flowId,
      prevTaskId,
      taskType,
      taskData
    );

    res.json({ taskId });
  })
);

router.put(
  '/:flowId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId },
      body,
    } = req;

    isUUIDv4.validateSync(flowId);
    const flowData = initialFlowCreationSchema.validateSync(body);
    await updateFlow(id, flowId, flowData);

    res.status(200).end();
  })
);

router.put(
  '/:flowId/enabled',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId },
      body,
    } = req;

    isUUIDv4.validateSync(flowId);
    const { enabled } = flowSettingEnableSchema.validateSync(body);
    await setFlowEnabled(id, flowId, enabled);

    res.status(200).end();
  })
);

router.put(
  '/:flowId/tasks/:taskId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId, taskId },
      body,
    } = req;

    isUUIDv4.validateSync(flowId);
    isUUIDv4.validateSync(taskId);
    const { taskData } = taskFlowEditSchema.validateSync(body);
    await updateUserFlowTask(id, flowId, taskId, taskData);

    res.status(200).end();
  })
);

router.delete(
  '/:flowId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId },
    } = req;

    isUUIDv4.validateSync(flowId);
    await deleteFlow(id, flowId);

    res.status(200).end();
  })
);

router.delete(
  '/:flowId/tasks/:taskId',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      user: { id },
      params: { flowId, taskId },
    } = req;

    isUUIDv4.validateSync(flowId);
    isUUIDv4.validateSync(taskId);

    await deleteUserFlowTask(id, flowId, taskId);

    res.status(200).end();
  })
);

module.exports = router;
