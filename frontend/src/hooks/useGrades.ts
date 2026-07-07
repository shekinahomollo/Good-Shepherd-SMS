import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gradesService } from '../services/grades.service'
import toast from 'react-hot-toast'

export function useStudentGrades(studentId: string, termId?: string) {
  return useQuery({
    queryKey: ['grades', 'student', studentId, termId],
    queryFn:  () => gradesService.getStudentGrades(studentId, termId),
    enabled:  !!studentId,
  })
}

export function useClassGrades(classId: string, termId?: string) {
  return useQuery({
    queryKey: ['grades', 'class', classId, termId],
    queryFn:  () => gradesService.getClassGrades(classId, termId),
    enabled:  !!classId,
  })
}

export function useCreateGrade() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: gradesService.createGrade,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['grades'] })
      toast.success('Grade saved!')
    },
    onError: () => toast.error('Failed to save grade.'),
  })
}