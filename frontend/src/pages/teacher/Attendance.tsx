import { useState, useEffect } from 'react'
import AppShell                from '../../components/layout/AppShell'
import { api }                 from '../../lib/api'
import toast                   from 'react-hot-toast'

// Status options with colors
const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Present', color: 'bg-teal/10 text-teal-dark border-teal/30'    },
  { value: 'ABSENT',  label: 'Absent',  color: 'bg-red-50 text-red-500 border-red-200'        },
  { value: 'LATE',    label: 'Late',    color: 'bg-gold/15 text-[#7a5f00] border-gold/30'     },
  { value: 'EXCUSED', label: 'Excused', color: 'bg-sky/20 text-ocean border-sky/40'           },
]

// Demo students — replace with real API call once students module is built
const DEMO_STUDENTS = [
  { id: 's1', firstName: 'Amara',   lastName: 'Mutua'    },
  { id: 's2', firstName: 'Brian',   lastName: 'Kiplagat' },
  { id: 's3', firstName: 'Cynthia', lastName: 'Njoroge'  },
  { id: 's4', firstName: 'Daniel',  lastName: 'Otieno'   },
  { id: 's5', firstName: 'Eunice',  lastName: 'Wambui'   },
  { id: 's6', firstName: 'Felix',   lastName: 'Kamau'    },
]

export default function TeacherAttendance() {
  const today = new Date().toISOString().split('T')[0]

  const [date,     setDate]     = useState(today)
  const [records,  setRecords]  = useState<Record<string, string>>(() =>
    Object.fromEntries(DEMO_STUDENTS.map(s => [s.id, 'PRESENT']))
  )
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  // Mark all present
  const markAllPresent = () => {
    setRecords(Object.fromEntries(DEMO_STUDENTS.map(s => [s.id, 'PRESENT'])))
  }

  const setStatus = (studentId: string, status: string) => {
    setRecords(prev => ({ ...prev, [studentId]: status }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // In production replace 'demo-class-id' with the teacher's real classId
      await api.post('/attendance/sessions', {
        classId:     'demo-class-id',
        sessionDate: date,
        sessionType: 'FULL_DAY',
        records:     DEMO_STUDENTS.map(s => ({
          studentId: s.id,
          status:    records[s.id],
        })),
      })
      setSaved(true)
      toast.success('Attendance saved successfully!')
    } catch {
      toast.error('Failed to save attendance. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const presentCount = Object.values(records).filter(s => s === 'PRESENT').length
  const absentCount  = Object.values(records).filter(s => s === 'ABSENT').length
  const lateCount    = Object.values(records).filter(s => s === 'LATE').length

  return (
    <AppShell pageTitle="Mark Attendance">

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ocean">Grade 4 Maple</h2>
          <p className="font-body text-sm text-[var(--text-muted)] mt-0.5">
            {DEMO_STUDENTS.length} students enrolled
          </p>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            max={today}
            onChange={e => { setDate(e.target.value); setSaved(false) }}
            className="px-4 py-2 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean bg-white"
          />
          <button
            onClick={markAllPresent}
            className="px-4 py-2 bg-teal/10 text-teal-dark border border-teal/30 rounded-lg font-display text-sm hover:bg-teal/20 transition-colors"
          >
            ✅ All Present
          </button>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 mb-6">
        {[
          { label: 'Present', count: presentCount,                          color: 'bg-teal/10 text-teal-dark border-teal/30'  },
          { label: 'Absent',  count: absentCount,                           color: 'bg-red-50 text-red-500 border-red-200'     },
          { label: 'Late',    count: lateCount,                             color: 'bg-gold/15 text-[#7a5f00] border-gold/30'  },
          { label: 'Total',   count: DEMO_STUDENTS.length,                  color: 'bg-ocean/8 text-ocean border-ocean/20'     },
        ].map(pill => (
          <div key={pill.label} className={`px-5 py-2 rounded-full border font-display text-sm font-semibold ${pill.color}`}>
            {pill.count} {pill.label}
          </div>
        ))}
      </div>

      {/* Student list */}
      <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-ocean/8 bg-ocean/3">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-1 font-display text-xs text-[var(--text-muted)]">#</div>
            <div className="col-span-5 font-display text-xs text-[var(--text-muted)]">Student</div>
            <div className="col-span-6 font-display text-xs text-[var(--text-muted)]">Status</div>
          </div>
        </div>

        {DEMO_STUDENTS.map((student, index) => (
          <div
            key={student.id}
            className="px-6 py-4 border-b border-ocean/6 last:border-0 hover:bg-ocean/2 transition-colors"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Number */}
              <div className="col-span-1 font-body text-sm text-[var(--text-muted)]">
                {index + 1}
              </div>

              {/* Student name */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky/40 flex items-center justify-center font-display text-sm font-semibold text-ocean-dark flex-shrink-0">
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <div>
                  <div className="font-body text-sm font-semibold text-[var(--text-body)]">
                    {student.firstName} {student.lastName}
                  </div>
                </div>
              </div>

              {/* Status buttons */}
              <div className="col-span-6 flex gap-2">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(student.id, opt.value)}
                    className={`px-3 py-1.5 rounded-lg border font-display text-xs font-semibold transition-all
                      ${records[student.id] === opt.value
                        ? opt.color + ' shadow-sm scale-105'
                        : 'bg-white text-[var(--text-muted)] border-ocean/15 hover:border-ocean/30'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between bg-white rounded-sms border border-ocean/10 px-6 py-4">
        <div className="font-body text-sm text-[var(--text-muted)]">
          {saved
            ? '✅ Attendance saved for ' + new Date(date).toLocaleDateString('en-KE', { dateStyle: 'long' })
            : 'Unsaved changes — click Save when done'
          }
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="px-6 py-2.5 bg-ocean hover:bg-ocean-dark text-white font-display text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Attendance'}
        </button>
      </div>

    </AppShell>
  )
}