import { api } from './api';

export const clientsApi = {
  getAll: () =>
    api.get('/api/clients'),

  getById: (id) =>
    api.get(`/api/clients/${id}`),

  getByIdWithPolicies: (id) =>
    api.get(`/api/clients/${id}/with-policies`),

  create: (dto) =>
    api.post('/api/clients', dto),

  update: (id, dto) =>
    api.put(`/api/clients/${id}`, dto),

  delete: (id) =>
    api.delete(`/api/clients/${id}`),
};
