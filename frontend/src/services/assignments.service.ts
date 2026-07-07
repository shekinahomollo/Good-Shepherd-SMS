import { api } from '../lib/api'

export const assignmentsService = {
  getAll: (params?: { classId?: string; termId?: string }) =>
    api.get('/assignments', { params }).then(r => r.data),

  getTeacherAssignments: () =>
    api.get('/assignments/teacher').then(r => r.data),

  create: (data: {
    title: string; description?: string; classId: string
    subjectId: string; termId: string; dueDate: string
    maxScore?: number; assignmentType: string
  }) => api.post('/assignments', data).then(r => r.data),

  update: (id: string, data: Partial<{
    title: string; description: string; dueDate: string; maxScore: number
  }>) => api.put(`/assignments/${id}`, data).then(r => r.data),

  togglePublish: (id: string) =>
    api.patch(`/assignments/${id}/publish`).then(r => r.data),

  getSubmissions: (assignmentId: string) =>
    api.get(`/assignments/${assignmentId}/submissions`).then(r => r.data),

  submit: (assignmentId: string, data: {
    studentId: string; notes?: string
    files?: { fileName: string; fileUrl: string; fileType: string }[]
  }) => api.post(`/assignments/${assignmentId}/submit`, data).then(r => r.data),

  gradeSubmission: (submissionId: string, data: {
    score: number; remarks: string
  }) => api.patch(`/assignments/submissions/${submissionId}/grade`, data).then(r => r.data),
}