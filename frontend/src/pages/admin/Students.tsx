import { useState }            from 'react'
import AppShell                from '../../components/layout/AppShell'
import LoadingSpinner          from '../../components/ui/LoadingSpinner'
import EmptyState              from '../../components/ui/EmptyState'
import { useStudents, useCreateStudent, useToggleStudentActive } from '../../hooks/useStudents'

export default function AdminStudents() {
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', admissionNumber: '',
    dateOfBirth: '', gender: 'FEMALE', gradeLevelId: '', classId: '',
  })

  const { data, isLoading }  = useStudents({ search })
  const createMutation       = useCreateStudent()
  const toggleMutation       = useToggleStudentActive()

  const students = data?.students || []

  const filtered = students.filter((s: any) => {
    if (filter === 'ALL')      return true
    if (filter === 'ACTIVE')   return s.isActive
    if (filter === 'INACTIVE') return !s.isActive
    return s.enrollments?.[0]?.class?.gradeLevel?.name === filter
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync(form)
    setShowForm(false)
    setForm({ firstName:'', lastName:'', admissionNumber:'', dateOfBirth:'', gender:'FEMALE', gradeLevelId:'', classId:'' })
  }

  const getClassName = (s: any) =>
    s.enrollments?.[0]?.class?.name || '—'

  const getGrade = (s: any) =>
    s.enrollments?.[0]?.class?.gradeLevel?.name || '—'

  const grades = ['ALL','ACTIVE','INACTIVE','Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6']

  return (
    <AppShell pageTitle="Students">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total Students', value: students.length,                              accent:'border-ocean'   },
          { label:'Active',         value: students.filter((s:any) => s.isActive).length, accent:'border-teal'  },
          { label:'Inactive',       value: students.filter((s:any) =>!s.isActive).length, accent:'border-red-400'},
          { label:'Classes',        value: 14,                                             accent:'border-gold'  },
        ].map(stat => (
          <div key={stat.label} className={`bg-white rounded-sms border border-ocean/10 border-t-4 ${stat.accent} p-5`}>
            <div className="font-display text-xs text-[var(--text-muted)] mb-1">{stat.label}</div>
            <div className="font-display text-3xl font-semibold text-ocean">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or admission number..."
          className="flex-1 min-w-[220px] px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean bg-white"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean bg-white"
        >
          {grades.map(g => <option key={g} value={g}>{g === 'ALL' ? 'All grades' : g}</option>)}
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-ocean hover:bg-ocean-dark text-white font-display text-sm rounded-lg transition-colors"
        >
          + Add Student
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner message="Loading students..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🎒"
          title="No students found"
          message="Try a different search or add your first student."
          action={{ label: '+ Add Student', onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
          <div className="px-6 py-3 bg-ocean/3 border-b border-ocean/8 grid grid-cols-12 gap-4">
            {['Student','Admission No.','Class','Grade','Gender','Status','Actions'].map((h, i) => (
              <div key={h} className={`font-display text-xs text-[var(--text-muted)]
                ${i===0?'col-span-3':i===6?'col-span-2':'col-span-1'}`}>{h}</div>
            ))}
          </div>

          {filtered.map((s: any) => (
            <div key={s.id} className="px-6 py-4 border-b border-ocean/6 last:border-0 grid grid-cols-12 gap-4 items-center hover:bg-ocean/2 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky/40 flex items-center justify-center font-display text-sm font-semibold text-ocean-dark flex-shrink-0">
                  {s.firstName[0]}{s.lastName[0]}
                </div>
                <span className="font-body text-sm font-semibold text-[var(--text-body)]">
                  {s.firstName} {s.lastName}
                </span>
              </div>
              <div className="col-span-2 font-body text-xs text-[var(--text-muted)]">{s.admissionNumber}</div>
              <div className="col-span-2 font-body text-xs text-[var(--text-body)]">{getClassName(s)}</div>
              <div className="col-span-1 font-body text-xs text-[var(--text-muted)]">{getGrade(s)}</div>
              <div className="col-span-1 font-body text-xs text-[var(--text-muted)] capitalize">{s.gender.toLowerCase()}</div>
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded-full font-display text-xs font-semibold border
                  ${s.isActive
                    ? 'bg-teal/10 text-teal-dark border-teal/30'
                    : 'bg-red-50 text-red-500 border-red-200'}`}>
                  {s.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="col-span-2 flex gap-2">
                <button
                  onClick={() => toggleMutation.mutate(s.id)}
                  disabled={toggleMutation.isPending}
                  className={`px-3 py-1.5 font-display text-xs rounded-lg border transition-colors
                    ${s.isActive
                      ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                      : 'bg-teal/10 text-teal-dark border-teal/30 hover:bg-teal/20'}`}
                >
                  {s.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sms-lg w-full max-w-md shadow-xl">
            <div className="px-6 py-5 border-b border-ocean/8 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ocean">Add New Student</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-ocean text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">First Name</label>
                  <input required value={form.firstName}
                    onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean"
                    placeholder="First name" />
                </div>
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Last Name</label>
                  <input required value={form.lastName}
                    onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean"
                    placeholder="Last name" />
                </div>
              </div>
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Admission Number</label>
                <input required value={form.admissionNumber}
                  onChange={e => setForm(p => ({ ...p, admissionNumber: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean"
                  placeholder="e.g. GSS/2025/006" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Date of Birth</label>
                  <input type="date" required value={form.dateOfBirth}
                    onChange={e => setForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean" />
                </div>
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Gender</label>
                  <select value={form.gender}
                    onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean bg-white">
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-ocean/20 text-[var(--text-muted)] font-display text-sm rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={createMutation.isPending}
                  className="flex-1 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors disabled:opacity-50">
                  {createMutation.isPending ? 'Creating...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}