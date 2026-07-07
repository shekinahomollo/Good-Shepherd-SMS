import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { attendanceService } from '../services/attendance.service'
import toast from 'react-hot-toast'

export function useAttendanceSession(classId: string, date: string) {
  return useQuery({
    queryKey: ['attendance', 'session', classId, date],
    queryFn:  () => attendanceService.getSession(classId, date),
    enabled:  !!classId && !!date,
  })
}

export function useStudentAttendanceSummary(
  studentId: string,
  termStart: string,
  termEnd:   string
) {
  return useQuery({
    queryKey: ['attendance', 'summary', studentId],
    queryFn:  () => attendanceService.getStudentSummary(studentId, termStart, termEnd),
    enabled:  !!studentId,
  })
}

export function useMarkAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: attendanceService.markAttendance,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['attendance'] })
      toast.success('Attendance saved!')
    },
    onError: () => toast.error('Failed to save attendance.'),
  })
}