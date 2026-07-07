import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore }             from '../../store/authStore'

interface NavItem {
  key:   string
  icon:  string
  label: string
  path:  string
}

interface NavSection {
  section: string
  items:   NavItem[]
}

const adminNav: NavSection[] = [
  {
    section: 'Overview',
    items: [
      { key: 'dashboard',     icon: '🏠', label: 'Dashboard',       path: '/admin' },
      { key: 'students',      icon: '🎒', label: 'Students',         path: '/admin/students' },
      { key: 'classes',       icon: '🏫', label: 'Classes',          path: '/admin/classes' },
    ],
  },
  {
    section: 'Academic',
    items: [
      { key: 'reports',       icon: '📊', label: 'Reports & Grades', path: '/admin/reports' },
      { key: 'assignments',   icon: '📝', label: 'Assignments',       path: '/admin/assignments' },
      { key: 'attendance',    icon: '✅', label: 'Attendance',        path: '/admin/attendance' },
    ],
  },
  {
    section: 'School',
    items: [
      { key: 'announcements', icon: '📢', label: 'Announcements',    path: '/admin/announcements' },
      { key: 'settings',      icon: '⚙️', label: 'Settings',         path: '/admin/settings' },
    ],
  },
]

const teacherNav: NavSection[] = [
  {
    section: 'My Classroom',
    items: [
      { key: 'dashboard',     icon: '🏠', label: 'Dashboard',        path: '/teacher' },
      { key: 'attendance',    icon: '✅', label: 'Mark Attendance',   path: '/teacher/attendance' },
      { key: 'assignments',   icon: '📝', label: 'Assignments',       path: '/teacher/assignments' },
    ],
  },
  {
    section: 'Grading',
    items: [
      { key: 'grades',        icon: '📊', label: 'Grade Book',        path: '/teacher/grades' },
      { key: 'reports',       icon: '📄', label: 'Report Cards',      path: '/teacher/reports' },
    ],
  },
  {
    section: 'School',
    items: [
      { key: 'announcements', icon: '📢', label: 'Announcements',    path: '/teacher/announcements' },
    ],
  },
]

const parentNav: NavSection[] = [
  {
    section: 'My Child',
    items: [
      { key: 'dashboard',     icon: '🏠', label: 'Home',             path: '/parent' },
      { key: 'assignments',   icon: '📝', label: 'Assignments',       path: '/parent/assignments' },
      { key: 'attendance',    icon: '📅', label: 'Attendance',        path: '/parent/attendance' },
    ],
  },
  {
    section: 'Results',
    items: [
      { key: 'reports',       icon: '📄', label: 'Report Cards',      path: '/parent/reports' },
      { key: 'grades',        icon: '📊', label: 'Grades',            path: '/parent/grades' },
    ],
  },
  {
    section: 'Updates',
    items: [
      { key: 'announcements', icon: '📢', label: 'Announcements',    path: '/parent/announcements' },
    ],
  },
]

const navByRole: Record<string, NavSection[]> = {
  ADMIN:   adminNav,
  TEACHER: teacherNav,
  PARENT:  parentNav,
}

const roleLabel: Record<string, string> = {
  ADMIN:   'Administrator',
  TEACHER: 'Teacher',
  PARENT:  'Parent',
}

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate         = useNavigate()
  const location         = useLocation()

  if (!user) return null

  const nav      = navByRole[user.role] || []
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[240px] bg-ocean flex flex-col z-50 overflow-y-auto">

      {/* Header */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-xl flex-shrink-0">
            🌟
          </div>
          <div>
            <div className="font-display text-white font-semibold text-sm leading-tight">
              Good Shepherd
            </div>
            <div className="font-body text-sky text-xs">School Portal</div>
          </div>
        </div>

        {/* Role badge */}
        <div className="mt-3 px-3 py-1.5 bg-white/10 rounded-full text-center">
          <span className="font-body text-sky text-xs font-semibold">
            {roleLabel[user.role]}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {nav.map((section) => (
          <div key={section.section} className="mb-2">
            <div className="font-display text-[10px] font-medium uppercase tracking-widest text-sky/60 px-3 py-2">
              {section.section}
            </div>
            {section.items.map((item) => {
              const isActive = location.pathname === item.path ||
                (item.path !== '/admin' && item.path !== '/teacher' && item.path !== '/parent' &&
                  location.pathname.startsWith(item.path))

              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all font-body text-sm font-semibold text-left
                    ${isActive
                      ? 'bg-teal text-white'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer — user info */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/8 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center font-display text-sm font-semibold text-[#3a2e00] flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-white text-sm truncate">
              {user.firstName} {user.lastName}
            </div>
            <div className="font-body text-sky text-xs">{roleLabel[user.role]}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-white/40 hover:text-white transition-colors text-sm"
          >
            ⏏
          </button>
        </div>
      </div>
    </aside>
  )
}