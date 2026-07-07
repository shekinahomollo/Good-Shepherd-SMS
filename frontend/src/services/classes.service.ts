import { api } from '../lib/api'

export const classesService = {
  getAll: () =>
    api.get('/classes').then(r => r.data),

  getOne: (id: string) =>
    api.get(`/classes/${id}`).then(r => r.data),

  getRoster: (classId: string) =>
    api.get(`/classes/${classId}/students`).then(r => r.data),

  create: (data: {
    name: string; gradeLevelId: string; academicYearId: string
    classTeacherId: string; roomNumber?: string; capacity?: number
  }) => api.post('/classes', data).then(r => r.data),

  update: (id: string, data: Partial<{
    name: string; roomNumber: string; capacity: number; classTeacherId: string
  }>) => api.put(`/classes/${id}`, data).then(r => r.data),
}