'use strict';

const FlowsService = require('services/FlowsService');

const getUserFlows = async (userId) => FlowsService.getUserFlows(userId);

const getUserFlowForForm = async (userId, flowId) =>
  FlowsService.getUserFlowForForm(userId, flowId);

const createFlow = async (userId, initialFlowData) =>
  FlowsService.createFlow(userId, initialFlowData);

const updateFlow = async (userId, flowId, flowData) =>
  FlowsService.updateFlow(userId, flowId, flowData);

const setFlowEnabled = async (userId, flowId, enabled) =>
  FlowsService.setFlowEnabled(userId, flowId, enabled);

const deleteFlow = async (userId, flowId) =>
  FlowsService.deleteFlow(userId, flowId);

module.exports = {
  getUserFlows,
  getUserFlowForForm,
  createFlow,
  updateFlow,
  setFlowEnabled,
  deleteFlow,
};
