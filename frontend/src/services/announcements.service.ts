import { api } from '../lib/api'

export const announcementsService = {
  getAll: (params?: { audience?: string; classId?: string }) =>
    api.get('/announcements', { params }).then(r => r.data),

  create: (data: {
    title: string; body: string; audience: string
    targetClassId?: string; publishAt?: string
    expiresAt?: string; isPublished?: boolean
  }) => api.post('/announcements', data).then(r => r.data),

  markRead: (id: string) =>
    api.patch(`/announcements/${id}/read`).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/announcements/${id}`).then(r => r.data),
}