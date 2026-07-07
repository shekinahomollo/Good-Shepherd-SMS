import { useState }  from 'react'
import AppShell      from '../../components/layout/AppShell'

const DEMO = [
  { id: '1', title: 'Mathematics Holiday Pack',  subject: 'Mathematics', dueDate: '2025-07-10', status: 'SUBMITTED', grade: '85/100', feedback: 'Excellent work! Very neat.' },
  { id: '2', title: 'English Reading Journal',   subject: 'English',     dueDate: '2025-07-08', status: 'PENDING',   grade: null,     feedback: null },
  { id: '3', title: 'Social Studies Project',    subject: 'SST',         dueDate: '2025-07-15', status: 'PENDING',   grade: null,     feedback: null },
]

const STATUS_STYLE: Record<string, string> = {
  SUBMITTED: 'bg-teal/10 text-teal-dark border-teal/30',
  PENDING:   'bg-gold/15 text-[#7a5f00] border-gold/30',
  GRADED:    'bg-ocean/8 text-ocean border-ocean/20',
  LATE:      'bg-red-50 text-red-500 border-red-200',
}

export default function ParentAssignments() {
  const [selected, setSelected] = useState<string | null>(null)
  const assignment = DEMO.find(a => a.id === selected)

  return (
    <AppShell pageTitle="Assignments">

      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ocean">Aisha's Assignments</h2>
        <p className="font-body text-sm text-[var(--text-muted)]">Grade 3 Cedar · Term 2</p>
      </div>

      <div className="space-y-4">
        {DEMO.map(a => (
          <div
            key={a.id}
            onClick={() => setSelected(a.id)}
            className="bg-white rounded-sms border border-ocean/10 p-5 cursor-pointer hover:border-ocean/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-body text-xs text-[var(--text-muted)]">{a.subject}</span>
                </div>
                <h3 className="font-display text-base font-semibold text-ocean">{a.title}</h3>
                <p className="font-body text-xs text-[var(--text-muted)] mt-1">
                  📅 Due {new Date(a.dueDate).toLocaleDateString('en-KE', { dateStyle: 'medium' })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full border font-display text-xs font-semibold ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
                {a.grade && (
                  <span className="font-display text-sm font-semibold text-ocean">{a.grade}</span>
                )}
              </div>
            </div>

            {a.feedback && (
              <div className="mt-3 p-3 bg-teal/5 border border-teal/15 rounded-lg">
                <p className="font-body text-xs text-teal-dark">💬 {a.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail drawer */}
      {selected && assignment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-white rounded-sms-lg w-full max-w-lg shadow-xl">
            <div className="px-6 py-5 border-b border-ocean/8 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ocean">{assignment.title}</h3>
              <button onClick={() => setSelected(null)} className="text-[var(--text-muted)] hover:text-ocean text-xl">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <span className="font-body text-sm text-[var(--text-muted)]">Subject:</span>
                <span className="font-body text-sm font-semibold">{assignment.subject}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-body text-sm text-[var(--text-muted)]">Due:</span>
                <span className="font-body text-sm font-semibold">
                  {new Date(assignment.dueDate).toLocaleDateString('en-KE', { dateStyle: 'full' })}
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-body text-sm text-[var(--text-muted)]">Status:</span>
                <span className={`px-3 py-1 rounded-full border font-display text-xs font-semibold ${STATUS_STYLE[assignment.status]}`}>
                  {assignment.status}
                </span>
              </div>

              {assignment.grade && (
                <div className="p-4 bg-teal/5 border border-teal/20 rounded-lg">
                  <div className="font-display text-sm font-semibold text-teal-dark mb-1">Grade: {assignment.grade}</div>
                  {assignment.feedback && (
                    <div className="font-body text-sm text-[var(--text-muted)]">{assignment.feedback}</div>
                  )}
                </div>
              )}

              {assignment.status === 'PENDING' && (
                <div className="pt-2 space-y-3">
                  <div className="p-4 bg-ocean/5 border border-ocean/15 rounded-lg">
                    <p className="font-body text-sm text-ocean font-semibold mb-1">📎 Download Assignment</p>
                    <p className="font-body text-xs text-[var(--text-muted)]">Tap below to download the assignment materials.</p>
                    <button className="mt-2 px-4 py-2 bg-ocean text-white font-display text-xs rounded-lg hover:bg-ocean-dark transition-colors">
                      Download Materials
                    </button>
                  </div>
                  <div className="p-4 bg-gold/8 border border-gold/20 rounded-lg">
                    <p className="font-body text-sm font-semibold text-[#7a5f00] mb-1">📤 Submit Completed Work</p>
                    <p className="font-body text-xs text-[var(--text-muted)]">Upload a photo or PDF of the completed work.</p>
                    <button className="mt-2 px-4 py-2 bg-gold text-[#3a2e00] font-display text-xs rounded-lg hover:bg-gold-dark transition-colors">
                      Upload Submission
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}