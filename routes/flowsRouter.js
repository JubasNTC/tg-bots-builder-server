'use strict';

const express = require('express');

const authMiddleware = require('middlewares/authMiddleware');
const asyncHandler = require('utils/asyncHandler');
const {
  getUserFlows,
  getUserFlowForForm,
  createFlow,
  updateFlow,
  setFlowEnabled,
  deleteFlow,
} = require('controllers/flowController');
const {
  initialFlowCreationSchema,
  flowSettingEnableSchema,
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

module.exports = router;
