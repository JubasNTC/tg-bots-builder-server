'use strict';

const FlowsService = require('services/FlowsService');

const getUserFlows = async (userId) => FlowsService.getUserFlows(userId);

const getUserFlowForForm = async (userId, flowId) =>
  FlowsService.getUserFlowForForm(userId, flowId);

const getUserFlowTasks = async (userId, flowId) =>
  FlowsService.getUserFlowTasks(userId, flowId);

const createFlow = async (userId, initialFlowData) =>
  FlowsService.createFlow(userId, initialFlowData);

const createUserFlowTask = async (
  userId,
  flowId,
  prevTaskId,
  taskType,
  taskData
) =>
  FlowsService.createUserFlowTask(
    userId,
    flowId,
    prevTaskId,
    taskType,
    taskData
  );

const getUserFlowTask = async (userId, flowId, taskId) =>
  FlowsService.getUserFlowTask(userId, flowId, taskId);

const updateUserFlowTask = async (userId, flowId, taskId, taskData) =>
  FlowsService.updateUserFlowTask(userId, flowId, taskId, taskData);

const updateFlow = async (userId, flowId, flowData) =>
  FlowsService.updateFlow(userId, flowId, flowData);

const setFlowEnabled = async (userId, flowId, enabled) =>
  FlowsService.setFlowEnabled(userId, flowId, enabled);

const deleteFlow = async (userId, flowId) =>
  FlowsService.deleteFlow(userId, flowId);

const deleteUserFlowTask = async (userId, flowId, taskId) =>
  FlowsService.deleteUserFlowTask(userId, flowId, taskId);

module.exports = {
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
};
