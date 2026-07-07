import { api } from '../lib/api'

export const studentsService = {
  getAll: (params?: { search?: string; gradeLevel?: string }) =>
    api.get('/students', { params }).then(r => r.data),

  getOne: (id: string) =>
    api.get(`/students/${id}`).then(r => r.data),

  create: (data: {
    firstName: string; lastName: string; admissionNumber: string
    dateOfBirth: string; gender: string; gradeLevelId: string; classId: string
  }) => api.post('/students', data).then(r => r.data),

  update: (id: string, data: Partial<{
    firstName: string; lastName: string; phone: string; isActive: boolean
  }>) => api.put(`/students/${id}`, data).then(r => r.data),

  toggleActive: (id: string) =>
    api.patch(`/students/${id}/toggle`).then(r => r.data),
}