import { useState }             from 'react'
import AppShell                 from '../../components/layout/AppShell'
import { useAuthStore }         from '../../store/authStore'
import { useAnnouncements, useCreateAnnouncement, useMarkRead } from '../../hooks/useAnnouncements'

export default function AnnouncementsPage() {
  const { user }         = useAuthStore()
  const isAdminOrTeacher = user?.role === 'ADMIN' || user?.role === 'TEACHER'

  const { data, isLoading }   = useAnnouncements()
  const createMutation        = useCreateAnnouncement()
  const markReadMutation      = useMarkRead()

  const announcements: Array<{
    id: string
    title: string
    body: string
    audience: string
    author: string
    date: string
    isRead?: boolean
    reads?: Array<{ userId: string }>
  }> = data?.announcements || []
  const unreadCount = announcements.filter((a) =>
    !a.reads?.some((r) => r.userId === user?.id)
  ).length

  const [selected,  setSelected]  = useState<string | null>(null)
  const [showForm,  setShowForm]  = useState(false)
  const [form, setForm] = useState({ title:'', body:'', audience:'ALL' })

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync({
      title:       form.title,
      body:        form.body,
      audience:    form.audience as any,
      isPublished: true,
    })
    setShowForm(false)
    setForm({ title:'', body:'', audience:'ALL' })
  }

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id)
    setSelected(id)
  }

  const selected_ann = announcements.find((a) => a.id === selected)

  if (isLoading) {
    return (
      <AppShell pageTitle="Announcements">
        <div className="flex items-center justify-center py-20">
          <div className="font-display text-ocean text-lg">Loading announcements...</div>
        </div>
      </AppShell>
    )
  }

  // ... rest of the JSX stays exactly the same as before
  // just replace DEMO_ANNOUNCEMENTS with announcements
  // and replace setAnnouncements calls with the mutations
  return (
    <AppShell pageTitle="Announcements">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ocean">
            Announcements
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-teal text-white font-display text-xs rounded-full">
                {unreadCount} new
              </span>
            )}
          </h2>
          <p className="font-body text-sm text-[var(--text-muted)]">School and class notices</p>
        </div>
        {isAdminOrTeacher && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-ocean hover:bg-ocean-dark text-white font-display text-sm rounded-lg transition-colors"
          >
            + Post Announcement
          </button>
        )}
      </div>

      {/* Post form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sms-lg w-full max-w-lg shadow-xl">
            <div className="px-6 py-5 border-b border-ocean/8 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ocean">New Announcement</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-ocean text-xl">✕</button>
            </div>
            <form onSubmit={handlePost} className="p-6 space-y-4">
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Title</label>
                <input
                  required value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean"
                  placeholder="Announcement title"
                />
              </div>
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Message</label>
                <textarea
                  required rows={5} value={form.body}
                  onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean resize-none"
                  placeholder="Write your announcement..."
                />
              </div>
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Audience</label>
                <select
                  value={form.audience}
                  onChange={e => setForm(p => ({ ...p, audience: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean bg-white"
                >
                  <option value="ALL">Everyone</option>
                  <option value="PARENTS">Parents only</option>
                  <option value="TEACHERS">Teachers only</option>
                  <option value="CLASS">My class only</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-ocean/20 text-[var(--text-muted)] font-display text-sm rounded-lg">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors">
                  Post Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcement list */}
      <div className="space-y-3">
        {announcements.map((a) => (
          <div
            key={a.id}
            onClick={() => handleMarkRead(a.id)}
            className={`bg-white rounded-sms border p-5 cursor-pointer transition-all hover:shadow-sm
              ${!a.isRead ? 'border-ocean/30 border-l-4 border-l-teal' : 'border-ocean/10'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {!a.isRead && (
                    <span className="w-2 h-2 rounded-full bg-teal flex-shrink-0" />
                  )}
                  <span className={`px-2 py-0.5 rounded font-display text-xs font-semibold
                    ${a.audience === 'ALL'     ? 'bg-ocean/8 text-ocean'          :
                      a.audience === 'PARENTS' ? 'bg-teal/10 text-teal-dark'     :
                      a.audience === 'CLASS'   ? 'bg-gold/15 text-[#7a5f00]'     :
                                                 'bg-sky/20 text-ocean'}`}>
                    {a.audience === 'ALL' ? '🌍 Everyone' :
                     a.audience === 'PARENTS' ? '👨‍👧 Parents' :
                     a.audience === 'CLASS' ? '🏫 Class' : '📚 Teachers'}
                  </span>
                  <span className="font-body text-xs text-[var(--text-muted)]">
                    by {a.author} · {new Date(a.date).toLocaleDateString('en-KE', { dateStyle: 'medium' })}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-ocean">{a.title}</h3>
                <p className="font-body text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{a.body}</p>
              </div>
              <span className="font-body text-xs text-[var(--text-muted)] flex-shrink-0">
                {a.isRead ? '✓ Read' : 'New'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && selected_ann && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sms-lg w-full max-w-lg shadow-xl">
            <div className="px-6 py-5 border-b border-ocean/8 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ocean">{selected_ann.title}</h3>
              <button onClick={() => setSelected(null)} className="text-[var(--text-muted)] hover:text-ocean text-xl">✕</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-body text-sm text-[var(--text-muted)]">
                  By {selected_ann.author} · {new Date(selected_ann.date).toLocaleDateString('en-KE', { dateStyle: 'full' })}
                </span>
              </div>
              <p className="font-body text-sm text-[var(--text-body)] leading-relaxed">
                {selected_ann.body}
              </p>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}