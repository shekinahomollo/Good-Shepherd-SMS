import AppShell from '../../components/layout/AppShell'

const DEMO_GRADES = [
  { subject: 'Mathematics',  score: 85, max: 100, grade: 'A',  remarks: 'Excellent performance in fractions.' },
  { subject: 'English',      score: 78, max: 100, grade: 'B+', remarks: 'Good reading comprehension.'         },
  { subject: 'Science',      score: 92, max: 100, grade: 'A+', remarks: 'Outstanding! Top of the class.'      },
  { subject: 'SST',          score: 71, max: 100, grade: 'B',  remarks: 'Good understanding of maps.'         },
  { subject: 'Creative Arts', score: 88, max: 100, grade: 'A', remarks: 'Very creative and expressive.'       },
]

const GRADE_COLOR: Record<string, string> = {
  'A+': 'bg-teal/10 text-teal-dark border-teal/30',
  'A':  'bg-teal/10 text-teal-dark border-teal/30',
  'B+': 'bg-ocean/8 text-ocean border-ocean/20',
  'B':  'bg-ocean/8 text-ocean border-ocean/20',
  'C+': 'bg-gold/15 text-[#7a5f00] border-gold/30',
  'C':  'bg-gold/15 text-[#7a5f00] border-gold/30',
  'D':  'bg-red-50 text-red-500 border-red-200',
}

export default function ParentGrades() {
  const avg = Math.round(DEMO_GRADES.reduce((s, g) => s + g.score, 0) / DEMO_GRADES.length)

  return (
    <AppShell pageTitle="Grades">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ocean">Aisha's Grades — Term 2</h2>
        <p className="font-body text-sm text-[var(--text-muted)]">Grade 3 Cedar</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <div className="bg-white rounded-sms border-t-4 border-ocean border border-ocean/10 p-5">
          <div className="font-display text-xs text-[var(--text-muted)] mb-1">Term Average</div>
          <div className="font-display text-3xl font-semibold text-ocean">{avg}%</div>
        </div>
        <div className="bg-white rounded-sms border-t-4 border-teal border border-ocean/10 p-5">
          <div className="font-display text-xs text-[var(--text-muted)] mb-1">Overall Grade</div>
          <div className="font-display text-3xl font-semibold text-teal-dark">A</div>
        </div>
        <div className="bg-white rounded-sms border-t-4 border-gold border border-ocean/10 p-5">
          <div className="font-display text-xs text-[var(--text-muted)] mb-1">Subjects</div>
          <div className="font-display text-3xl font-semibold text-ocean">{DEMO_GRADES.length}</div>
        </div>
      </div>

      {/* Grades table */}
      <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-ocean/8">
          <span className="font-display text-base font-semibold text-ocean">📊 Subject Results</span>
        </div>
        {DEMO_GRADES.map((g, i) => (
          <div key={i} className="px-6 py-4 border-b border-ocean/6 last:border-0">
            <div className="flex items-center gap-4 mb-2">
              <span className="flex-1 font-body text-sm font-semibold text-[var(--text-body)]">{g.subject}</span>
              <span className="font-display text-sm font-semibold text-ocean">{g.score}/{g.max}</span>
              <span className="font-display text-sm font-semibold text-ocean">{Math.round((g.score/g.max)*100)}%</span>
              <span className={`px-3 py-1 rounded-full border font-display text-xs font-semibold ${GRADE_COLOR[g.grade]}`}>
                {g.grade}
              </span>
            </div>
            <div className="h-1.5 bg-ocean/8 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-ocean to-teal transition-all"
                style={{ width: (g.score / g.max * 100) + '%' }}
              />
            </div>
            {g.remarks && (
              <p className="font-body text-xs text-[var(--text-muted)]">💬 {g.remarks}</p>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  )
}