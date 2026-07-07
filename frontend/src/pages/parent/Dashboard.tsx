import { useNavigate }    from 'react-router-dom'
import AppShell           from '../../components/layout/AppShell'
import { useAuthStore }   from '../../store/authStore'
import { useAssignments } from '../../hooks/useAssignments'
import { useAnnouncements } from '../../hooks/useAnnouncements'

export default function ParentDashboard() {
  const { user }  = useAuthStore()
  const navigate  = useNavigate()

  const { data: assignmentsData }   = useAssignments()
  const { data: announcementsData } = useAnnouncements()

  const assignments   = assignmentsData?.assignments   || []
  const announcements = announcementsData?.announcements || []

  const pending   = assignments.filter((a:any) =>
    !a.submissions?.some((s:any) => s.status === 'SUBMITTED' || s.status === 'GRADED')
  ).length

  const unread = announcements.filter((a:any) =>
    !a.reads?.some((r:any) => r.userId === user?.id)
  ).length

  return (
    <AppShell pageTitle="Home">
      <div className="bg-ocean rounded-[20px] p-7 flex items-center justify-between mb-7 relative overflow-hidden">
        <div className="absolute w-56 h-56 rounded-full bg-white/5 -top-16 -right-10" />
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">
            Hello, {user?.firstName}! 👋
          </h2>
          <p className="text-sky text-sm mt-1">
            Welcome to the Good Shepherd School portal.
          </p>
        </div>
        <div className="bg-white/12 rounded-[14px] px-5 py-3 text-center z-10">
          <div className="font-display text-4xl text-gold leading-none">{new Date().getDate()}</div>
          <div className="font-body text-white/70 text-xs mt-1">
            {new Date().toLocaleDateString('en-KE', { month:'long', year:'numeric' })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { icon:'📝', label:'Assignments',        value: assignments.length, sub:'This term',          accent:'border-ocean' },
          { icon:'⏳', label:'Pending',             value: pending,            sub:'Not yet submitted',  accent:'border-gold'  },
          { icon:'📢', label:'Unread Notices',      value: unread,             sub:'New announcements',  accent:'border-teal'  },
          { icon:'📄', label:'Report Cards',        value:'Ready',             sub:'Term 2 published',   accent:'border-sky'   },
        ].map(stat => (
          <div key={stat.label} className={`bg-white rounded-sms border border-ocean/10 border-t-4 ${stat.accent} p-5`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-display text-xs text-[var(--text-muted)] mb-1">{stat.label}</div>
            <div className="font-display text-3xl font-semibold text-ocean leading-none">{stat.value}</div>
            <div className="font-body text-xs text-[var(--text-muted)] mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3 mb-7">
        {[
          { icon:'📥', label:'Download Work',  bg:'bg-ocean/10', path:'/parent/assignments' },
          { icon:'📤', label:'Submit Work',    bg:'bg-teal/10',  path:'/parent/assignments' },
          { icon:'📄', label:'Report Card',   bg:'bg-gold/15',  path:'/parent/reports'     },
          { icon:'📅', label:'Attendance',    bg:'bg-sky/25',   path:'/parent/attendance'  },
        ].map(action => (
          <button key={action.label} onClick={() => navigate(action.path)}
            className="bg-white border border-ocean/10 rounded-sms p-4 flex flex-col items-center gap-2 hover:border-ocean hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className={`w-11 h-11 ${action.bg} rounded-xl flex items-center justify-center text-xl`}>
              {action.icon}
            </div>
            <span className="font-display text-xs text-[var(--text-body)]">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Two col */}
      <div className="grid grid-cols-2 gap-5">

        {/* Assignments */}
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-ocean/8 flex items-center justify-between">
            <span className="font-display text-base font-semibold text-ocean">📝 Assignments</span>
            <button onClick={() => navigate('/parent/assignments')}
              className="font-display text-xs text-teal hover:underline">View all</button>
          </div>
          <div className="px-5 py-2">
            {assignments.length === 0 ? (
              <p className="font-body text-sm text-[var(--text-muted)] py-4 text-center">No assignments yet</p>
            ) : assignments.slice(0,3).map((a: any) => (
              <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-ocean/6 last:border-0">
                <div className="flex-1">
                  <div className="font-body text-sm font-semibold text-[var(--text-body)]">{a.title}</div>
                  <div className="font-body text-xs text-[var(--text-muted)]">
                    Due {new Date(a.dueDate).toLocaleDateString('en-KE', { dateStyle:'medium' })}
                  </div>
                </div>
                <span className="px-2 py-1 bg-gold/15 text-[#7a5f00] border border-gold/30 rounded font-display text-xs">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-ocean/8 flex items-center justify-between">
            <span className="font-display text-base font-semibold text-ocean">
              📢 Notices
              {unread > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-teal text-white font-display text-xs rounded-full">{unread}</span>
              )}
            </span>
            <button onClick={() => navigate('/parent/announcements')}
              className="font-display text-xs text-teal hover:underline">See all</button>
          </div>
          <div className="px-5 py-2">
            {announcements.length === 0 ? (
              <p className="font-body text-sm text-[var(--text-muted)] py-4 text-center">No notices yet</p>
            ) : announcements.slice(0,3).map((a: any) => (
              <div key={a.id} className="flex gap-3 py-3 border-b border-ocean/6 last:border-0">
                <div className="w-2.5 h-2.5 rounded-full bg-teal mt-1.5 flex-shrink-0" />
                <div>
                  <div className="font-body text-sm text-[var(--text-body)] leading-snug">{a.title}</div>
                  <div className="font-body text-xs text-[var(--text-muted)] mt-0.5">
                    {new Date(a.createdAt).toLocaleDateString('en-KE', { dateStyle:'medium' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}