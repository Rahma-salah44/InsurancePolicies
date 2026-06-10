import { api } from './api';

export const policiesApi = {
  getAll: () =>
    api.get('/api/policies'),

  getById: (id) =>
    api.get(`/api/policies/${id}`),

  getByIdWithClaims: (id) =>
    api.get(`/api/policies/${id}/with-claims`),

  getByClientId: (clientId) =>
    api.get(`/api/policies/by-client/${clientId}`),

  create: (dto) =>
    api.post('/api/policies', dto),

  update: (id, dto) =>
    api.put(`/api/policies/${id}`, dto),

  delete: (id) =>
    api.delete(`/api/policies/${id}`),
};
