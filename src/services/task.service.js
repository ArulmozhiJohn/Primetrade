const prisma = require('../config/prisma');

// Create task
const createTask = async (userId, data) => {
  return await prisma.task.create({
    data: { ...data, userId },
  });
};

// Get all tasks - users see own tasks, admins see all
const getAllTasks = async (user) => {
  if (user.role === 'ADMIN') {
    return await prisma.task.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
  return await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
};

// Get single task
const getTaskById = async (taskId, user) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // Users can only view their own tasks
  if (user.role !== 'ADMIN' && task.userId !== user.id) {
    const error = new Error('You do not have permission to view this task');
    error.statusCode = 403;
    throw error;
  }

  return task;
};

// Update task
const updateTask = async (taskId, user, data) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'ADMIN' && task.userId !== user.id) {
    const error = new Error('You do not have permission to update this task');
    error.statusCode = 403;
    throw error;
  }

  return await prisma.task.update({
    where: { id: taskId },
    data,
  });
};

// Delete task
const deleteTask = async (taskId, user) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'ADMIN' && task.userId !== user.id) {
    const error = new Error('You do not have permission to delete this task');
    error.statusCode = 403;
    throw error;
  }

  await prisma.task.delete({ where: { id: taskId } });
  return { message: 'Task deleted successfully' };
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };