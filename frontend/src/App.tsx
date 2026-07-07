import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore }        from './store/authStore'

// Auth
import LoginPage               from './pages/LoginPage'
import NotFound                from './pages/NotFound'

// Admin
import AdminDashboard          from './pages/admin/Dashboard'
import AdminAttendance         from './pages/admin/Attendance'
import AdminStudents           from './pages/admin/Students'
import AdminClasses            from './pages/admin/Classes'
import AdminAssignments        from './pages/admin/AdminAssignments'
import AdminReports            from './pages/admin/AdminReports'
import AdminSettings           from './pages/admin/Settings'

// Teacher
import TeacherDashboard        from './pages/teacher/Dashboard'
import TeacherAttendance       from './pages/teacher/Attendance'
import TeacherAssignments      from './pages/teacher/Assignments'
import TeacherGradeBook        from './pages/teacher/GradeBook'
import TeacherReportCards      from './pages/teacher/ReportCards'

// Parent
import ParentDashboard         from './pages/parent/Dashboard'
import ParentAttendance        from './pages/parent/Attendance'
import ParentAssignments       from './pages/parent/Assignments'
import ParentGrades            from './pages/parent/Grades'
import ParentReportCards       from './pages/parent/ReportCards'

// Shared
import AnnouncementsPage       from './pages/shared/Announcements'

function ProtectedRoute({ children, roles }: { children: JSX.Element; roles: string[] }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

const A = ['ADMIN']
const T = ['TEACHER']
const P = ['PARENT']

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* ── Admin ── */}
        <Route path="/admin"                element={<ProtectedRoute roles={A}><AdminDashboard   /></ProtectedRoute>} />
        <Route path="/admin/students"       element={<ProtectedRoute roles={A}><AdminStudents     /></ProtectedRoute>} />
        <Route path="/admin/classes"        element={<ProtectedRoute roles={A}><AdminClasses      /></ProtectedRoute>} />
        <Route path="/admin/attendance"     element={<ProtectedRoute roles={A}><AdminAttendance   /></ProtectedRoute>} />
        <Route path="/admin/assignments"    element={<ProtectedRoute roles={A}><AdminAssignments  /></ProtectedRoute>} />
        <Route path="/admin/reports"        element={<ProtectedRoute roles={A}><AdminReports      /></ProtectedRoute>} />
        <Route path="/admin/announcements"  element={<ProtectedRoute roles={A}><AnnouncementsPage /></ProtectedRoute>} />
        <Route path="/admin/settings"       element={<ProtectedRoute roles={A}><AdminSettings     /></ProtectedRoute>} />

        {/* ── Teacher ── */}
        <Route path="/teacher"              element={<ProtectedRoute roles={T}><TeacherDashboard   /></ProtectedRoute>} />
        <Route path="/teacher/attendance"   element={<ProtectedRoute roles={T}><TeacherAttendance  /></ProtectedRoute>} />
        <Route path="/teacher/assignments"  element={<ProtectedRoute roles={T}><TeacherAssignments /></ProtectedRoute>} />
        <Route path="/teacher/grades"       element={<ProtectedRoute roles={T}><TeacherGradeBook   /></ProtectedRoute>} />
        <Route path="/teacher/reports"      element={<ProtectedRoute roles={T}><TeacherReportCards /></ProtectedRoute>} />
        <Route path="/teacher/announcements"element={<ProtectedRoute roles={T}><AnnouncementsPage  /></ProtectedRoute>} />

        {/* ── Parent ── */}
        <Route path="/parent"               element={<ProtectedRoute roles={P}><ParentDashboard    /></ProtectedRoute>} />
        <Route path="/parent/attendance"    element={<ProtectedRoute roles={P}><ParentAttendance   /></ProtectedRoute>} />
        <Route path="/parent/assignments"   element={<ProtectedRoute roles={P}><ParentAssignments  /></ProtectedRoute>} />
        <Route path="/parent/grades"        element={<ProtectedRoute roles={P}><ParentGrades       /></ProtectedRoute>} />
        <Route path="/parent/reports"       element={<ProtectedRoute roles={P}><ParentReportCards  /></ProtectedRoute>} />
        <Route path="/parent/announcements" element={<ProtectedRoute roles={P}><AnnouncementsPage  /></ProtectedRoute>} />

        {/* ── Fallback ── */}
        <Route path="404" element={<NotFound />} />
        <Route path="*"   element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}