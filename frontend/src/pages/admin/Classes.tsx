import { useState }   from 'react'
import AppShell       from '../../components/layout/AppShell'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState     from '../../components/ui/EmptyState'
import { useClasses, useCreateClass } from '../../hooks/useClasses'

export default function AdminClasses() {
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)
  const [form, setForm] = useState({
    name: '', gradeLevelId: '', academicYearId: '',
    classTeacherId: '', capacity: '30', roomNumber: '',
  })

  const { data, isLoading } = useClasses()
  const createMutation      = useCreateClass()

  const classes = data?.classes || []

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync({
      ...form,
      capacity: parseInt(form.capacity),
    })
    setShowForm(false)
    setForm({ name:'', gradeLevelId:'', academicYearId:'', classTeacherId:'', capacity:'30', roomNumber:'' })
  }

  return (
    <AppShell pageTitle="Classes">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ocean">Class Management</h2>
          <p className="font-body text-sm text-[var(--text-muted)]">
            {classes.length} classes · Academic Year 2024/25
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-ocean hover:bg-ocean-dark text-white font-display text-sm rounded-lg transition-colors">
          + Create Class
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading classes..." />
      ) : classes.length === 0 ? (
        <EmptyState
          icon="🏫"
          title="No classes yet"
          message="Create your first class to get started."
          action={{ label: '+ Create Class', onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="grid grid-cols-3 gap-5">
          {classes.map((c: any) => {
            const studentCount = c.enrollments?.length || 0
            const capacity     = c.capacity || 30
            const pct          = Math.round((studentCount / capacity) * 100)

            return (
              <div key={c.id}
                onClick={() => setSelected(c)}
                className="bg-white rounded-sms border border-ocean/10 p-5 cursor-pointer hover:border-ocean/30 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl bg-ocean/8 flex items-center justify-center text-lg">🏫</div>
                  <span className="px-2 py-1 bg-sky/20 text-ocean border border-sky/30 rounded font-display text-xs font-semibold">
                    {c.gradeLevel?.name || '—'}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-ocean mb-1">{c.name}</h3>
                <p className="font-body text-xs text-[var(--text-muted)] mb-1">
                  👩‍🏫 {c.classTeacher?.firstName} {c.classTeacher?.lastName}
                </p>
                <p className="font-body text-xs text-[var(--text-muted)] mb-3">
                  🚪 {c.roomNumber || 'No room assigned'}
                </p>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex-1 h-1.5 bg-ocean/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct>90?'bg-red-400':pct>75?'bg-gold':'bg-teal'}`}
                      style={{ width: pct + '%' }}
                    />
                  </div>
                  <span className="font-display text-xs text-[var(--text-muted)]">{studentCount}/{capacity}</span>
                </div>
                <p className="font-body text-xs text-[var(--text-muted)]">{capacity - studentCount} seats available</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Class detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sms-lg w-full max-w-md shadow-xl">
            <div className="px-6 py-5 border-b border-ocean/8 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ocean">{selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-[var(--text-muted)] hover:text-ocean text-xl">✕</button>
            </div>
            <div className="p-6 space-y-3">
              {[
                ['Grade Level',    selected.gradeLevel?.name || '—'],
                ['Class Teacher',  `${selected.classTeacher?.firstName} ${selected.classTeacher?.lastName}`],
                ['Room',           selected.roomNumber || '—'],
                ['Students',       `${selected.enrollments?.length || 0} / ${selected.capacity || 30}`],
                ['Grading Type',   selected.gradeLevel?.gradingType === 'DESCRIPTIVE' ? '📋 Descriptive (KG)' : '📊 Numerical'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-ocean/6 last:border-0">
                  <span className="font-display text-sm text-[var(--text-muted)]">{k}</span>
                  <span className="font-body text-sm font-semibold text-[var(--text-body)]">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sms-lg w-full max-w-md shadow-xl">
            <div className="px-6 py-5 border-b border-ocean/8 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ocean">Create New Class</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-ocean text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="p-4 bg-gold/8 border border-gold/20 rounded-lg">
                <p className="font-body text-xs text-[#7a5f00]">
                  💡 To create a class you need the IDs for the grade level, academic year, and class teacher from the database. Use Prisma seed data IDs or connect this form to the API dropdowns in the next step.
                </p>
              </div>
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Class Name</label>
                <input required value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean"
                  placeholder="e.g. Grade 5 Acacia" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Capacity</label>
                  <input type="number" value={form.capacity}
                    onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean" />
                </div>
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Room</label>
                  <input value={form.roomNumber}
                    onChange={e => setForm(p => ({ ...p, roomNumber: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean"
                    placeholder="e.g. Room 8" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-ocean/20 text-[var(--text-muted)] font-display text-sm rounded-lg">Cancel</button>
                <button type="submit" disabled={createMutation.isPending}
                  className="flex-1 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors disabled:opacity-50">
                  {createMutation.isPending ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}