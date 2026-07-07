import { useState } from 'react'
import AppShell     from '../../components/layout/AppShell'

const STUDENTS = [
  { id: 's1', name: 'Amara Mutua'     },
  { id: 's2', name: 'Brian Kiplagat'  },
  { id: 's3', name: 'Cynthia Njoroge' },
  { id: 's4', name: 'Daniel Otieno'   },
  { id: 's5', name: 'Eunice Wambui'   },
]

const SUBJECTS = ['Mathematics', 'English', 'Science', 'SST', 'Creative Arts']

function getGradeLabel(pct: number) {
  if (pct >= 90) return { label: 'A+', color: 'text-teal-dark' }
  if (pct >= 80) return { label: 'A',  color: 'text-teal-dark' }
  if (pct >= 75) return { label: 'B+', color: 'text-ocean'     }
  if (pct >= 70) return { label: 'B',  color: 'text-ocean'     }
  if (pct >= 60) return { label: 'C+', color: 'text-[#7a5f00]' }
  if (pct >= 50) return { label: 'C',  color: 'text-[#7a5f00]' }
  return           { label: 'D',  color: 'text-red-500'   }
}

export default function TeacherGradeBook() {
  const [grades, setGrades] = useState<Record<string, Record<string, string>>>(() => {
    const init: Record<string, Record<string, string>> = {}
    STUDENTS.forEach(s => {
      init[s.id] = {}
      SUBJECTS.forEach(sub => { init[s.id][sub] = '' })
    })
    return init
  })

  const setGrade = (studentId: string, subject: string, value: string) => {
    const num = Math.min(100, Math.max(0, parseInt(value) || 0))
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], [subject]: value === '' ? '' : String(num) },
    }))
  }

  const getAverage = (studentId: string) => {
    const vals = SUBJECTS.map(s => parseInt(grades[studentId][s]) || 0)
    const filled = vals.filter((_, i) => grades[studentId][SUBJECTS[i]] !== '')
    if (!filled.length) return null
    return Math.round(vals.reduce((a, b) => a + b, 0) / SUBJECTS.length)
  }

  return (
    <AppShell pageTitle="Grade Book">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ocean">Grade 4 Maple — Term 2</h2>
          <p className="font-body text-sm text-[var(--text-muted)]">Enter scores out of 100</p>
        </div>
        <button className="px-5 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors">
          Save All Grades
        </button>
      </div>

      <div className="bg-white rounded-sms border border-ocean/10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ocean/8 bg-ocean/3">
              <th className="px-5 py-3 text-left font-display text-xs text-[var(--text-muted)] min-w-[160px]">Student</th>
              {SUBJECTS.map(sub => (
                <th key={sub} className="px-3 py-3 text-center font-display text-xs text-[var(--text-muted)] min-w-[100px]">
                  {sub}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-display text-xs text-[var(--text-muted)] min-w-[100px]">Average</th>
              <th className="px-4 py-3 text-center font-display text-xs text-[var(--text-muted)]">Grade</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((student, i) => {
              const avg   = getAverage(student.id)
              const grade = avg !== null ? getGradeLabel(avg) : null

              return (
                <tr key={student.id} className={`border-b border-ocean/6 last:border-0 ${i % 2 === 0 ? '' : 'bg-ocean/1'}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sky/40 flex items-center justify-center font-display text-xs font-semibold text-ocean-dark flex-shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-body text-sm font-semibold text-[var(--text-body)]">{student.name}</span>
                    </div>
                  </td>
                  {SUBJECTS.map(sub => (
                    <td key={sub} className="px-3 py-2 text-center">
                      <input
                        type="number"
                        min={0} max={100}
                        value={grades[student.id][sub]}
                        onChange={e => setGrade(student.id, sub, e.target.value)}
                        className="w-16 px-2 py-1.5 rounded-lg border border-ocean/15 font-body text-sm text-center focus:outline-none focus:border-ocean bg-white"
                        placeholder="—"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <span className="font-display text-sm font-semibold text-ocean">
                      {avg !== null ? avg + '%' : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-display text-sm font-semibold ${grade?.color || 'text-[var(--text-muted)]'}`}>
                      {grade?.label || '—'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* KG Skill Checklist note */}
      <div className="mt-6 p-4 bg-sky/15 border border-sky/30 rounded-sms">
        <p className="font-display text-sm font-semibold text-ocean mb-1">
          🌱 Kindergarten classes use a Skill Checklist instead
        </p>
        <p className="font-body text-xs text-[var(--text-muted)]">
          For KG classes, the grade book switches to a descriptive skill rating view
          (Not Yet / Developing / Achieved / Exceeding) automatically based on the class grade level.
        </p>
      </div>
    </AppShell>
  )
}