import api from './axios';

export const getTasksAPI   = ()         => api.get('/tasks');
export const createTaskAPI = (data)     => api.post('/tasks', data);
export const updateTaskAPI = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTaskAPI = (id)       => api.delete(`/tasks/${id}`);