import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { classesService } from '../services/classes.service'
import toast from 'react-hot-toast'

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn:  classesService.getAll,
  })
}

export function useClassRoster(classId: string) {
  return useQuery({
    queryKey: ['classes', classId, 'roster'],
    queryFn:  () => classesService.getRoster(classId),
    enabled:  !!classId,
  })
}

export function useCreateClass() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: classesService.create,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['classes'] })
      toast.success('Class created successfully!')
    },
    onError: () => toast.error('Failed to create class.'),
  })
}