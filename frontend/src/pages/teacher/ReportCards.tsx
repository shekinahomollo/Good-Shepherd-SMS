import { useState } from 'react'
import AppShell     from '../../components/layout/AppShell'
import toast        from 'react-hot-toast'

interface StudentReport {
  id:       string
  name:     string
  initials: string
  grades:   { subject: string; score: number; max: number; grade: string }[]
  avg:      number
  comment:  string
  published:boolean
}

function getGrade(pct: number) {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 75) return 'B+'
  if (pct >= 70) return 'B'
  if (pct >= 65) return 'C+'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  return 'E'
}

const GRADE_COLOR: Record<string,string> = {
  'A+':'text-teal-dark','A':'text-teal-dark','B+':'text-ocean','B':'text-ocean',
  'C+':'text-[#7a5f00]','C':'text-[#7a5f00]','D':'text-red-500','E':'text-red-600',
}

const SUBJECTS = ['Mathematics','English','Science','Social Studies','Creative Arts']

const INIT_STUDENTS: StudentReport[] = [
  { id:'s1', name:'Amara Mutua',     initials:'AM', avg:85, comment:'', published:false,
    grades: SUBJECTS.map((s,i) => ({ subject:s, score:[85,78,92,81,88][i], max:100, grade:getGrade([85,78,92,81,88][i]) })) },
  { id:'s2', name:'Brian Kiplagat',  initials:'BK', avg:72, comment:'', published:false,
    grades: SUBJECTS.map((s,i) => ({ subject:s, score:[72,68,75,70,74][i], max:100, grade:getGrade([72,68,75,70,74][i]) })) },
  { id:'s3', name:'Cynthia Njoroge', initials:'CN', avg:91, comment:'Excellent!', published:true,
    grades: SUBJECTS.map((s,i) => ({ subject:s, score:[95,88,96,90,85][i], max:100, grade:getGrade([95,88,96,90,85][i]) })) },
]

export default function TeacherReportCards() {
  const [students,  setStudents]  = useState(INIT_STUDENTS)
  const [selected,  setSelected]  = useState<StudentReport | null>(null)
  const [preview,   setPreview]   = useState<StudentReport | null>(null)

  const updateComment = (id: string, comment: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, comment } : s))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, comment } : null)
  }

  const handleSubmit = (id: string) => {
    const s = students.find(st => st.id === id)
    if (!s?.comment.trim()) { toast.error('Please write a comment before submitting.'); return }
    setStudents(prev => prev.map(st => st.id === id ? { ...st, published:true } : st))
    toast.success('Report submitted for admin approval!')
  }

  // ── PDF PREVIEW ─────────────────────────────────────────────
  if (preview) {
    const totalScore = preview.grades.reduce((s,g) => s + g.score, 0)
    const totalMax   = preview.grades.reduce((s,g) => s + g.max, 0)
    const overall    = Math.round((totalScore / totalMax) * 100)

    return (
      <AppShell pageTitle="Report Card Preview">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => setPreview(null)}
            className="flex items-center gap-2 font-display text-sm text-ocean hover:underline">
            ← Back to report cards
          </button>
          <button
            onClick={() => { window.print(); toast.success('Sending to printer...') }}
            className="px-5 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors"
          >
            🖨️ Print / Save as PDF
          </button>
        </div>

        {/* Report card — print-ready layout */}
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden max-w-2xl mx-auto" id="report-card">

          {/* Header */}
          <div className="bg-ocean px-8 py-6 text-center">
            <div className="text-4xl mb-2">🌟</div>
            <h1 className="font-display text-2xl font-semibold text-white">Good Shepherd School</h1>
            <p className="font-body text-sky text-sm mt-1">Nurturing minds. Growing futures.</p>
            <div className="mt-3 inline-block bg-white/15 px-4 py-1.5 rounded-full">
              <span className="font-display text-white text-sm">Term 2 Report Card — 2024/2025</span>
            </div>
          </div>

          {/* Student info */}
          <div className="px-8 py-5 bg-ocean/3 border-b border-ocean/10 grid grid-cols-3 gap-4">
            {[
              ['Student Name', preview.name],
              ['Class',        'Grade 4 Maple'],
              ['Academic Year','2024/2025'],
            ].map(([k,v]) => (
              <div key={k}>
                <div className="font-display text-xs text-[var(--text-muted)] mb-0.5">{k}</div>
                <div className="font-body text-sm font-semibold text-[var(--text-body)]">{v}</div>
              </div>
            ))}
          </div>

          {/* Grades table */}
          <div className="px-8 py-5">
            <h2 className="font-display text-base font-semibold text-ocean mb-3">Academic Performance</h2>
            <table className="w-full">
              <thead>
                <tr className="bg-ocean/5 border border-ocean/10">
                  <th className="px-4 py-2.5 text-left font-display text-xs text-[var(--text-muted)]">Subject</th>
                  <th className="px-4 py-2.5 text-center font-display text-xs text-[var(--text-muted)]">Score</th>
                  <th className="px-4 py-2.5 text-center font-display text-xs text-[var(--text-muted)]">Out of</th>
                  <th className="px-4 py-2.5 text-center font-display text-xs text-[var(--text-muted)]">%</th>
                  <th className="px-4 py-2.5 text-center font-display text-xs text-[var(--text-muted)]">Grade</th>
                </tr>
              </thead>
              <tbody>
                {preview.grades.map((g, i) => {
                  const pct = Math.round((g.score / g.max) * 100)
                  return (
                    <tr key={i} className={`border border-ocean/8 ${i%2===0?'bg-white':'bg-ocean/2'}`}>
                      <td className="px-4 py-2.5 font-body text-sm text-[var(--text-body)]">{g.subject}</td>
                      <td className="px-4 py-2.5 text-center font-body text-sm font-semibold text-[var(--text-body)]">{g.score}</td>
                      <td className="px-4 py-2.5 text-center font-body text-sm text-[var(--text-muted)]">{g.max}</td>
                      <td className="px-4 py-2.5 text-center font-body text-sm text-[var(--text-body)]">{pct}%</td>
                      <td className={`px-4 py-2.5 text-center font-display text-sm font-semibold ${GRADE_COLOR[g.grade]}`}>{g.grade}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-ocean/8 border border-ocean/15">
                  <td className="px-4 py-3 font-display text-sm font-semibold text-ocean">TOTAL</td>
                  <td className="px-4 py-3 text-center font-display text-sm font-semibold text-ocean">{totalScore}</td>
                  <td className="px-4 py-3 text-center font-display text-sm font-semibold text-ocean">{totalMax}</td>
                  <td className="px-4 py-3 text-center font-display text-sm font-semibold text-ocean">{overall}%</td>
                  <td className={`px-4 py-3 text-center font-display text-sm font-semibold ${GRADE_COLOR[getGrade(overall)]}`}>
                    {getGrade(overall)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Summary */}
          <div className="px-8 pb-5">
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label:'Term Average', value: overall + '%', color:'text-ocean' },
                { label:'Overall Grade', value: getGrade(overall), color: GRADE_COLOR[getGrade(overall)] },
                { label:'Subjects',      value: preview.grades.length.toString(), color:'text-ocean' },
              ].map(s => (
                <div key={s.label} className="bg-ocean/5 border border-ocean/10 rounded-lg p-3 text-center">
                  <div className="font-display text-xs text-[var(--text-muted)] mb-1">{s.label}</div>
                  <div className={`font-display text-2xl font-semibold ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Teacher comment */}
            <div className="border border-ocean/15 rounded-lg p-4 mb-5">
              <div className="font-display text-sm font-semibold text-ocean mb-2">Class Teacher's Comment</div>
              <p className="font-body text-sm text-[var(--text-body)] leading-relaxed min-h-[48px]">
                {preview.comment || 'No comment added yet.'}
              </p>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-ocean/8">
                <div>
                  <div className="font-body text-xs text-[var(--text-muted)]">Class Teacher</div>
                  <div className="font-display text-sm font-semibold text-ocean">Mr. David Omondi</div>
                </div>
                <div className="text-right">
                  <div className="font-body text-xs text-[var(--text-muted)]">Date Issued</div>
                  <div className="font-display text-sm font-semibold text-ocean">
                    {new Date().toLocaleDateString('en-KE', { dateStyle:'long' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-ocean/10 pt-4">
              <p className="font-body text-xs text-[var(--text-muted)]">
                Good Shepherd School · info@goodshepherd.ac.ke · Nairobi, Kenya
              </p>
              <p className="font-body text-xs text-[var(--text-muted)] mt-0.5">
                This is an official school report card for Term 2, Academic Year 2024/2025
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  // ── REPORT LIST VIEW ────────────────────────────────────────
  return (
    <AppShell pageTitle="Report Cards">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ocean">Grade 4 Maple — Term 2</h2>
          <p className="font-body text-sm text-[var(--text-muted)]">Write comments then preview and submit each report card</p>
        </div>
        <div className="flex gap-3">
          <span className="px-4 py-2 bg-teal/10 text-teal-dark border border-teal/30 rounded-full font-display text-xs font-semibold">
            {students.filter(s=>s.published).length}/{students.length} submitted
          </span>
          <button
            onClick={() => { students.forEach(s => { if (s.comment.trim()) handleSubmit(s.id) }) }}
            className="px-5 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors"
          >
            Submit All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {students.map(s => (
          <div key={s.id} className="bg-white rounded-sms border border-ocean/10 p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-sky/40 flex items-center justify-center font-display text-sm font-semibold text-ocean-dark flex-shrink-0">
                {s.initials}
              </div>
              <div className="flex-1">
                <div className="font-display text-base font-semibold text-ocean">{s.name}</div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="font-body text-xs text-[var(--text-muted)]">Average: {s.avg}%</span>
                  <span className={`font-display text-xs font-semibold px-2 py-0.5 rounded ${GRADE_COLOR[getGrade(s.avg)]} bg-ocean/5`}>
                    {getGrade(s.avg)}
                  </span>
                  <span className={`font-display text-xs font-semibold px-2 py-0.5 rounded
                    ${s.published ? 'bg-teal/10 text-teal-dark' : 'bg-ocean/8 text-ocean'}`}>
                    {s.published ? '✓ Submitted' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreview(s)}
                  className="px-4 py-2 bg-gold/15 text-[#7a5f00] border border-gold/30 font-display text-xs rounded-lg hover:bg-gold/25 transition-colors"
                >
                  👁️ Preview PDF
                </button>
                {!s.published && (
                  <button
                    onClick={() => handleSubmit(s.id)}
                    className="px-4 py-2 bg-teal/10 text-teal-dark border border-teal/30 font-display text-xs rounded-lg hover:bg-teal/20 transition-colors"
                  >
                    Submit →
                  </button>
                )}
              </div>
            </div>

            {/* Mini grades preview */}
            <div className="flex gap-2 mb-3 flex-wrap">
              {s.grades.map(g => (
                <div key={g.subject} className="flex items-center gap-1.5 px-2 py-1 bg-ocean/4 border border-ocean/10 rounded-lg">
                  <span className="font-body text-xs text-[var(--text-muted)]">{g.subject}:</span>
                  <span className="font-display text-xs font-semibold text-ocean">{g.score}</span>
                  <span className={`font-display text-xs font-semibold ${GRADE_COLOR[g.grade]}`}>({g.grade})</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block font-display text-xs font-semibold text-[var(--text-muted)] mb-1.5">
                Class Teacher's Comment
              </label>
              <textarea
                rows={2}
                value={s.comment}
                onChange={e => updateComment(s.id, e.target.value)}
                placeholder={`Write a comment for ${s.name.split(' ')[0]}...`}
                disabled={s.published}
                className="w-full px-4 py-2.5 rounded-lg border border-ocean/15 font-body text-sm focus:outline-none focus:border-ocean resize-none disabled:bg-ocean/3 disabled:text-[var(--text-muted)]"
              />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}