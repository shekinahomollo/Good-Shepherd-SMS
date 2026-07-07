import { useNavigate }  from 'react-router-dom'
import AppShell         from '../../components/layout/AppShell'
import { useAuthStore } from '../../store/authStore'
import { useStudents }  from '../../hooks/useStudents'
import { useClasses }   from '../../hooks/useClasses'
import { useAnnouncements } from '../../hooks/useAnnouncements'

export default function AdminDashboard() {
  const { user }    = useAuthStore()
  const navigate    = useNavigate()

  const { data: studentsData } = useStudents({})
  const { data: classesData  } = useClasses()
  const { data: announcementsData } = useAnnouncements()

  const students      = studentsData?.students      || []
  const classes       = classesData?.classes        || []
  const announcements = announcementsData?.announcements || []

  const firstName = user?.firstName || 'Admin'

  return (
    <AppShell pageTitle="Dashboard">

      {/* Greeting banner */}
      <div className="bg-ocean rounded-[20px] p-7 flex items-center justify-between mb-7 relative overflow-hidden">
        <div className="absolute w-56 h-56 rounded-full bg-white/5 -top-16 -right-10" />
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">
            Good morning, {firstName}! 🌤️
          </h2>
          <p className="text-sky text-sm mt-1">
            Here's what's happening at Good Shepherd School today.
          </p>
        </div>
        <div className="bg-white/12 rounded-[14px] px-5 py-3 text-center z-10">
          <div className="font-display text-4xl text-gold leading-none">{new Date().getDate()}</div>
          <div className="font-body text-white/70 text-xs mt-1">
            {new Date().toLocaleDateString('en-KE', { month:'long', year:'numeric' })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { icon:'🎒', label:'Total Students',    value: students.length || '—',  sub:'Across all classes',    accent:'border-ocean' },
          { icon:'🏫', label:'Classes',           value: classes.length  || '—',  sub:'Academic year 2024/25', accent:'border-teal'  },
          { icon:'✅', label:'Attendance Today',  value:'94%',                    sub:'395 of 420 present',    accent:'border-gold'  },
          { icon:'📢', label:'Announcements',     value: announcements.length||'—',sub:'Published notices',    accent:'border-sky'   },
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
          { icon:'🎒', label:'Add Student',        bg:'bg-ocean/10', path:'/admin/students'      },
          { icon:'📢', label:'Post Announcement',  bg:'bg-teal/10',  path:'/admin/announcements' },
          { icon:'📄', label:'View Reports',       bg:'bg-gold/15',  path:'/admin/reports'       },
          { icon:'✅', label:'View Attendance',    bg:'bg-sky/25',   path:'/admin/attendance'    },
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

        {/* Announcements */}
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-ocean/8 flex items-center justify-between">
            <span className="font-display text-base font-semibold text-ocean">📢 Recent Announcements</span>
            <button onClick={() => navigate('/admin/announcements')}
              className="font-display text-xs text-teal hover:underline">View all</button>
          </div>
          <div className="px-5 py-2">
            {announcements.length === 0 ? (
              <p className="font-body text-sm text-[var(--text-muted)] py-4 text-center">No announcements yet</p>
            ) : announcements.slice(0, 3).map((a: any) => (
              <div key={a.id} className="flex gap-3 py-3 border-b border-ocean/6 last:border-0">
                <div className="w-2.5 h-2.5 rounded-full bg-teal mt-1.5 flex-shrink-0" />
                <div>
                  <div className="font-body text-sm text-[var(--text-body)] leading-snug">{a.title}</div>
                  <div className="font-body text-xs text-[var(--text-muted)] mt-0.5">
                    {new Date(a.createdAt).toLocaleDateString('en-KE', { dateStyle:'medium' })} · {a.audience}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classes overview */}
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-ocean/8 flex items-center justify-between">
            <span className="font-display text-base font-semibold text-ocean">🏫 Classes Overview</span>
            <button onClick={() => navigate('/admin/classes')}
              className="font-display text-xs text-teal hover:underline">View all</button>
          </div>
          <div className="px-5 py-2">
            {classes.length === 0 ? (
              <p className="font-body text-sm text-[var(--text-muted)] py-4 text-center">No classes yet</p>
            ) : classes.slice(0, 4).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3 py-2.5 border-b border-ocean/6 last:border-0">
                <div className="w-8 h-8 rounded-full bg-sky/40 flex items-center justify-center font-display text-xs font-semibold text-ocean-dark flex-shrink-0">
                  {c.name.slice(0,2)}
                </div>
                <span className="flex-1 font-body text-sm font-semibold text-[var(--text-body)]">{c.name}</span>
                <span className="font-body text-xs text-[var(--text-muted)]">
                  {c.enrollments?.length || 0} students
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </AppShell>
  )
}