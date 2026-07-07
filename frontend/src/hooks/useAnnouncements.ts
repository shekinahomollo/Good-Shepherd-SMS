import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { announcementsService } from '../services/announcements.service'
import toast from 'react-hot-toast'

export function useAnnouncements(params?: { audience?: string; classId?: string }) {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn:  () => announcementsService.getAll(params),
  })
}

export function useCreateAnnouncement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: announcementsService.create,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['announcements'] })
      toast.success('Announcement posted!')
    },
    onError: () => toast.error('Failed to post announcement.'),
  })
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: announcementsService.markRead,
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['announcements'] }),
  })
}