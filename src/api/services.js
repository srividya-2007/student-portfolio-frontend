import api from './axios';

// Auth
export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const forgotPassword = (email) => api.post('/api/auth/forgot-password', { email });
export const resetPassword = (data) => api.post('/api/auth/reset-password', data);

// Student / Profile
export const getStudent = (id) => api.get(`/api/students/${id}`);
export const updateStudent = (id, data) => api.put(`/api/students/${id}`, data);
export const getPortfolio = (id) => api.get(`/api/students/${id}/portfolio`);
export const updatePortfolio = (id, data) => api.put(`/api/students/${id}/portfolio`, data);

// Projects
export const getProjects = (params) => api.get('/api/projects', { params });
export const getMyProjects = () => api.get('/api/projects/my');
export const getStudentProjects = (userId) => api.get(`/api/projects/student/${userId}`);
export const getProject = (id) => api.get(`/api/projects/${id}`);
export const createProject = (data) => api.post('/api/projects', data);
export const updateProject = (id, data) => api.put(`/api/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/api/projects/${id}`);

// Milestones
export const addMilestone = (projectId, data) => api.post(`/api/projects/${projectId}/milestones`, data);
export const updateMilestone = (projectId, milestoneId, data) =>
  api.put(`/api/projects/${projectId}/milestones/${milestoneId}`, data);

// File upload
export const uploadImage = (formData) =>
  api.post('/api/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadFile = (formData) =>
  api.post('/api/upload/file', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadProjectMedia = (projectId, formData) =>
  api.post(`/api/upload/project/${projectId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Notifications
export const getNotifications = () => api.get('/api/notifications');
export const getUnreadCount = () => api.get('/api/notifications/unread-count');
export const markAsRead = (id) => api.put(`/api/notifications/${id}/read`);

// Admin
export const getAdminDashboard = () => api.get('/api/admin/dashboard');
export const reviewProject = (id, status, comment) =>
  api.put(`/api/admin/projects/${id}/review`, null, { params: { status, comment } });
export const addFeedback = (id, data) => api.post(`/api/admin/projects/${id}/feedback`, data);
export const getAllStudents = () => api.get('/api/admin/users');
export const toggleUserStatus = (id) => api.put(`/api/admin/users/${id}/status`);
export const sendNotification = (data) => api.post('/api/admin/notifications', data);
