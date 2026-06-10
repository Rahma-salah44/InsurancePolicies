import { api } from './api';

export const claimsApi = {
  getAll: () =>
    api.get('/api/claims'),

  getById: (id) =>
    api.get(`/api/claims/${id}`),

  getByPolicyId: (policyId) =>
    api.get(`/api/claims/by-policy/${policyId}`),

  getByStatus: (status) =>
    api.get(`/api/claims/by-status/${status}`),

  create: (dto) =>
    api.post('/api/claims', dto),

  updateStatus: (id, status) =>
    api.patch(`/api/claims/${id}/status`, { status }),

  delete: (id) =>
    api.delete(`/api/claims/${id}`),
};
