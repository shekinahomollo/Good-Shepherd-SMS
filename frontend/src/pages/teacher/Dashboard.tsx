import { useNavigate }       from 'react-router-dom'
import AppShell              from '../../components/layout/AppShell'
import { useAuthStore }      from '../../store/authStore'
import { useTeacherAssignments } from '../../hooks/useAssignments'
import { useClasses }        from '../../hooks/useClasses'

export default function TeacherDashboard() {
  const { user }    = useAuthStore()
  const navigate    = useNavigate()

  const { data: assignmentsData } = useTeacherAssignments()
  const { data: classesData     } = useClasses()

  const assignments   = assignmentsData?.assignments || []
  const classes       = classesData?.classes         || []
  const myClass       = classes[0]

  const pendingSubmissions = assignments.reduce((total: number, a: any) => {
    const pending = a.submissions?.filter((s: any) =>
      s.status === 'SUBMITTED' || s.status === 'LATE'
    ).length || 0
    return total + pending
  }, 0)

  return (
    <AppShell pageTitle="Dashboard">
      <div className="bg-ocean rounded-[20px] p-7 flex items-center justify-between mb-7 relative overflow-hidden">
        <div className="absolute w-56 h-56 rounded-full bg-white/5 -top-16 -right-10" />
        <div>
          <h2 className="font-display text-2xl font-semibold text-white">
            Good morning, {user?.firstName}! 📚
          </h2>
          <p className="text-sky text-sm mt-1">
            {myClass ? `${myClass.name} · Term 2` : 'Welcome to your dashboard'}
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
          { icon:'🏫', label:'My Classes',          value: classes.length,          sub:'Assigned to you',        accent:'border-ocean' },
          { icon:'📝', label:'Active Assignments',  value: assignments.filter((a:any) => a.isPublished).length, sub:'Published',  accent:'border-teal'  },
          { icon:'📥', label:'Pending Submissions', value: pendingSubmissions,       sub:'Awaiting grading',       accent:'border-gold'  },
          { icon:'📋', label:'Total Assignments',   value: assignments.length,       sub:'All this term',          accent:'border-sky'   },
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
          { icon:'✅', label:'Mark Attendance', bg:'bg-teal/10',  path:'/teacher/attendance'  },
          { icon:'➕', label:'New Assignment',  bg:'bg-ocean/10', path:'/teacher/assignments' },
          { icon:'✏️', label:'Enter Grades',   bg:'bg-gold/15',  path:'/teacher/grades'      },
          { icon:'📄', label:'Report Cards',   bg:'bg-sky/25',   path:'/teacher/reports'     },
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

      {/* Recent assignments */}
      <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-ocean/8 flex items-center justify-between">
          <span className="font-display text-base font-semibold text-ocean">📝 Recent Assignments</span>
          <button onClick={() => navigate('/teacher/assignments')}
            className="font-display text-xs text-teal hover:underline">View all</button>
        </div>
        <div className="px-5 py-2">
          {assignments.length === 0 ? (
            <p className="font-body text-sm text-[var(--text-muted)] py-4 text-center">No assignments yet</p>
          ) : assignments.slice(0, 4).map((a: any) => {
            const submitted = a.submissions?.filter((s:any) => s.status !== 'DRAFT').length || 0
            return (
              <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-ocean/6 last:border-0">
                <div className="flex-1">
                  <div className="font-body text-sm font-semibold text-[var(--text-body)]">{a.title}</div>
                  <div className="font-body text-xs text-[var(--text-muted)]">
                    {a.subject?.name} · Due {new Date(a.dueDate).toLocaleDateString('en-KE', { dateStyle:'medium' })}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full font-display text-xs font-semibold border
                  ${a.isPublished ? 'bg-teal/10 text-teal-dark border-teal/30' : 'bg-ocean/8 text-ocean border-ocean/20'}`}>
                  {submitted} submitted
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}