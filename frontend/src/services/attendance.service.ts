import { api } from '../lib/api'

export const attendanceService = {
  markAttendance: (data: {
    classId: string
    sessionDate: string
    sessionType?: string
    records: { studentId: string; status: string; notes?: string }[]
  }) => api.post('/attendance/sessions', data).then((r) => r.data),

  getSession: (classId: string, date: string, sessionType = 'FULL_DAY') =>
    api.get('/attendance/sessions', {
      params: { classId, date, sessionType },
    }).then((r) => r.data),

  getClassReport: (classId: string, month: number, year: number) =>
    api.get(`/attendance/class/${classId}`, {
      params: { month, year },
    }).then((r) => r.data),

  getStudentSummary: (studentId: string, termStart: string, termEnd: string) =>
    api.get(`/attendance/student/${studentId}/summary`, {
      params: { termStart, termEnd },
    }).then((r) => r.data),
}
