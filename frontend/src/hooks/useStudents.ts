import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsService } from '../services/students.service'
import toast from 'react-hot-toast'

export function useStudents(params?: { search?: string; gradeLevel?: string }) {
  return useQuery({
    queryKey: ['students', params],
    queryFn:  () => studentsService.getAll(params),
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: ['students', id],
    queryFn:  () => studentsService.getOne(id),
    enabled:  !!id,
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: studentsService.create,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student created successfully!')
    },
    onError: () => toast.error('Failed to create student.'),
  })
}

export function useToggleStudentActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: studentsService.toggleActive,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student status updated!')
    },
    onError: () => toast.error('Failed to update student.'),
  })
}