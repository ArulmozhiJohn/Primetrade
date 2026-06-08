const taskService = require('../services/task.service');
const { successResponse } = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return successResponse(res, 201, 'Task created successfully', task);
  } catch (err) { next(err); }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAllTasks(req.user);
    return successResponse(res, 200, 'Tasks fetched successfully', tasks);
  } catch (err) { next(err); }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(Number(req.params.id), req.user);
    return successResponse(res, 200, 'Task fetched successfully', task);
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.user, req.body);
    return successResponse(res, 200, 'Task updated successfully', task);
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(Number(req.params.id), req.user);
    return successResponse(res, 200, result.message, null);
  } catch (err) { next(err); }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };