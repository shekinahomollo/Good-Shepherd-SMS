import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assignmentsService } from '../services/assignments.service'
import toast from 'react-hot-toast'

export function useTeacherAssignments() {
  return useQuery({
    queryKey: ['assignments', 'teacher'],
    queryFn:  assignmentsService.getTeacherAssignments,
  })
}

export function useAssignments(params?: { classId?: string; termId?: string }) {
  return useQuery({
    queryKey: ['assignments', params],
    queryFn:  () => assignmentsService.getAll(params),
  })
}

export function useSubmissions(assignmentId: string) {
  return useQuery({
    queryKey: ['submissions', assignmentId],
    queryFn:  () => assignmentsService.getSubmissions(assignmentId),
    enabled:  !!assignmentId,
  })
}

export function useCreateAssignment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: assignmentsService.create,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['assignments'] })
      toast.success('Assignment created!')
    },
    onError: () => toast.error('Failed to create assignment.'),
  })
}

export function useTogglePublish() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: assignmentsService.togglePublish,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['assignments'] })
      toast.success('Assignment updated!')
    },
  })
}

export function useGradeSubmission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { score: number; remarks: string } }) =>
      assignmentsService.gradeSubmission(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submissions'] })
      toast.success('Grade saved!')
    },
    onError: () => toast.error('Failed to save grade.'),
  })
}