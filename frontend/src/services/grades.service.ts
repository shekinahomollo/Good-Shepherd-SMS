import { api } from '../lib/api'

export const gradesService = {
  getClassGrades: (classId: string, termId?: string) =>
    api.get(`/grades/class/${classId}`, {
      params: termId ? { termId } : {},
    }).then(r => r.data),

  createGrade: (data: {
    studentId: string; subjectId: string; classId: string
    termId: string; gradeType: string; rawScore: number
    maxScore: number; remarks?: string; assignmentId?: string
  }) => api.post('/grades', data).then(r => r.data),

  updateGrade: (id: string, data: {
    rawScore: number; maxScore: number; remarks?: string
  }) => api.put(`/grades/${id}`, data).then(r => r.data),

  getStudentGrades: (studentId: string, termId?: string) =>
    api.get(`/grades/student/${studentId}`, {
      params: termId ? { termId } : {},
    }).then(r => r.data),

  getSkillAssessments: (studentId: string, termId?: string) =>
    api.get(`/grades/skill-assessments/${studentId}`, {
      params: termId ? { termId } : {},
    }).then(r => r.data),

  saveSkillAssessment: (data: {
    studentId: string; skillDescriptorId: string
    termId: string; rating: string; remarks?: string
  }) => api.post('/grades/skill-assessments', data).then(r => r.data),
}