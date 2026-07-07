import { useState } from 'react'
import AppShell     from '../../components/layout/AppShell'
import toast        from 'react-hot-toast'

type AssignType = 'HOLIDAY' | 'CLASSWORK' | 'PROJECT' | 'TEST'
type View = 'list' | 'submissions' | 'grade'

interface Submission {
  id:        string
  student:   string
  initials:  string
  status:    'SUBMITTED' | 'PENDING' | 'LATE' | 'GRADED'
  file:      string | null
  fileType:  string | null
  score:     number | null
  remarks:   string
  submitted: string | null
}

interface Assignment {
  id:          string
  title:       string
  subject:     string
  type:        AssignType
  dueDate:     string
  isPublished: boolean
  submitted:   number
  total:       number
  attachments: string[]
  description: string
}

const DEMO_SUBMISSIONS: Submission[] = [
  { id:'sub1', student:'Amara Mutua',    initials:'AM', status:'SUBMITTED', file:'Math_Holiday_Amara.pdf',    fileType:'pdf', score:null, remarks:'', submitted:'2025-07-08' },
  { id:'sub2', student:'Brian Kiplagat', initials:'BK', status:'LATE',      file:'Math_Holiday_Brian.pdf',    fileType:'pdf', score:null, remarks:'', submitted:'2025-07-11' },
  { id:'sub3', student:'Cynthia Njoroge',initials:'CN', status:'GRADED',    file:'Math_Holiday_Cynthia.pdf',  fileType:'pdf', score:88,   remarks:'Excellent work! Very neat presentation.', submitted:'2025-07-07' },
  { id:'sub4', student:'Daniel Otieno',  initials:'DO', status:'PENDING',   file:null,                        fileType:null,  score:null, remarks:'', submitted:null },
  { id:'sub5', student:'Eunice Wambui',  initials:'EW', status:'SUBMITTED', file:'Math_Holiday_Eunice.pdf',  fileType:'pdf', score:null, remarks:'', submitted:'2025-07-09' },
]

const DEMO_ASSIGNMENTS: Assignment[] = [
  { id:'1', title:'Mathematics Holiday Pack',  subject:'Mathematics', type:'HOLIDAY',   dueDate:'2025-07-10', isPublished:true,  submitted:4, total:32, attachments:['Math_Holiday_Instructions.pdf','Math_Holiday_Worksheet.pdf'], description:'Complete all exercises in the holiday pack. Show all working.' },
  { id:'2', title:'English Reading Journal',   subject:'English',     type:'HOLIDAY',   dueDate:'2025-07-08', isPublished:true,  submitted:24,total:32, attachments:['English_Journal_Guide.pdf'], description:'Read 3 books and write a one-page review for each.' },
  { id:'3', title:'Science Mid-term Test',     subject:'Science',     type:'TEST',      dueDate:'2025-06-30', isPublished:false, submitted:0, total:32, attachments:[], description:'Covers chapters 1-5. Bring all necessary stationery.' },
]

const TYPE_COLORS: Record<AssignType, string> = {
  HOLIDAY:   'bg-teal/10 text-teal-dark border-teal/30',
  CLASSWORK: 'bg-ocean/8 text-ocean border-ocean/20',
  PROJECT:   'bg-gold/15 text-[#7a5f00] border-gold/30',
  TEST:      'bg-red-50 text-red-500 border-red-200',
}

const STATUS_STYLE: Record<string, string> = {
  SUBMITTED: 'bg-teal/10 text-teal-dark border-teal/30',
  PENDING:   'bg-ocean/8 text-ocean border-ocean/20',
  LATE:      'bg-gold/15 text-[#7a5f00] border-gold/30',
  GRADED:    'bg-sky/20 text-ocean-dark border-sky/40',
}

export default function TeacherAssignments() {
  const [assignments,  setAssignments]  = useState(DEMO_ASSIGNMENTS)
  const [submissions,  setSubmissions]  = useState(DEMO_SUBMISSIONS)
  const [view,         setView]         = useState<View>('list')
  const [selectedA,    setSelectedA]    = useState<Assignment | null>(null)
  const [selectedSub,  setSelectedSub]  = useState<Submission | null>(null)
  const [showForm,     setShowForm]     = useState(false)
  const [uploadedFiles,setUploadedFiles]= useState<string[]>([])
  const [gradeForm,    setGradeForm]    = useState({ score:'', remarks:'' })

  const [form, setForm] = useState({
    title:'', subject:'', type:'HOLIDAY' as AssignType,
    dueDate:'', maxScore:'100', description:'',
  })

  const openSubmissions = (a: Assignment) => {
    setSelectedA(a)
    setView('submissions')
  }

  const openGrade = (sub: Submission) => {
    setSelectedSub(sub)
    setGradeForm({ score: sub.score?.toString() || '', remarks: sub.remarks })
    setView('grade')
  }

  const handleGrade = () => {
    if (!selectedSub) return
    setSubmissions(prev => prev.map(s =>
      s.id === selectedSub.id
        ? { ...s, status:'GRADED' as const, score:parseInt(gradeForm.score), remarks:gradeForm.remarks }
        : s
    ))
    toast.success(`Graded ${selectedSub.student} — ${gradeForm.score}/100`)
    setView('submissions')
    setSelectedSub(null)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setAssignments(prev => [...prev, {
      id: Date.now().toString(),
      title:       form.title,
      subject:     form.subject,
      type:        form.type,
      dueDate:     form.dueDate,
      isPublished: false,
      submitted:   0,
      total:       32,
      attachments: uploadedFiles,
      description: form.description,
    }])
    setShowForm(false)
    setUploadedFiles([])
    setForm({ title:'', subject:'', type:'HOLIDAY', dueDate:'', maxScore:'100', description:'' })
    toast.success('Assignment created as draft')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(prev => [...prev, ...files.map(f => f.name)])
  }

  const togglePublish = (id: string) => {
    setAssignments(prev => prev.map(a =>
      a.id === id ? { ...a, isPublished: !a.isPublished } : a
    ))
  }

  // ── GRADE VIEW ──────────────────────────────────────────────
  if (view === 'grade' && selectedSub && selectedA) {
    return (
      <AppShell pageTitle="Grade Submission">
        <button onClick={() => setView('submissions')}
          className="flex items-center gap-2 font-display text-sm text-ocean mb-5 hover:underline">
          ← Back to submissions
        </button>

        <div className="grid grid-cols-2 gap-6">
          {/* Document preview panel */}
          <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-ocean/8 flex items-center justify-between">
              <span className="font-display text-sm font-semibold text-ocean">
                📄 {selectedSub.student}'s Submission
              </span>
              {selectedSub.submitted && (
                <span className="font-body text-xs text-[var(--text-muted)]">
                  Submitted: {new Date(selectedSub.submitted).toLocaleDateString('en-KE', { dateStyle:'medium' })}
                </span>
              )}
            </div>

            {selectedSub.file ? (
              <div className="p-6">
                {/* Document viewer simulation */}
                <div className="bg-ocean/3 border-2 border-dashed border-ocean/20 rounded-sms p-8 text-center mb-4">
                  <div className="text-5xl mb-3">
                    {selectedSub.fileType === 'pdf' ? '📄' : '🖼️'}
                  </div>
                  <div className="font-display text-sm font-semibold text-ocean mb-1">{selectedSub.file}</div>
                  <div className="font-body text-xs text-[var(--text-muted)] mb-4">
                    {selectedSub.fileType?.toUpperCase()} document
                  </div>
                  <button className="px-5 py-2 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors">
                    📥 Download to View
                  </button>
                </div>

                {/* Submission details */}
                <div className="space-y-2">
                  {[
                    ['Student',   selectedSub.student],
                    ['File',      selectedSub.file],
                    ['Status',    selectedSub.status],
                    ['Submitted', selectedSub.submitted
                      ? new Date(selectedSub.submitted).toLocaleDateString('en-KE', { dateStyle:'full' })
                      : 'Not submitted'],
                  ].map(([k,v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-ocean/6 last:border-0">
                      <span className="font-display text-xs text-[var(--text-muted)]">{k}</span>
                      <span className="font-body text-xs font-semibold text-[var(--text-body)]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">📭</div>
                <div className="font-display text-base font-semibold text-ocean mb-1">No submission yet</div>
                <div className="font-body text-sm text-[var(--text-muted)]">{selectedSub.student} hasn't submitted this assignment.</div>
              </div>
            )}
          </div>

          {/* Grading panel */}
          <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-ocean/8">
              <span className="font-display text-sm font-semibold text-ocean">✏️ Grade This Submission</span>
            </div>
            <div className="p-6 space-y-5">

              {/* Assignment context */}
              <div className="p-4 bg-ocean/5 border border-ocean/15 rounded-lg">
                <div className="font-display text-sm font-semibold text-ocean mb-1">{selectedA.title}</div>
                <div className="font-body text-xs text-[var(--text-muted)]">{selectedA.subject} · Due {selectedA.dueDate}</div>
              </div>

              {/* Student info */}
              <div className="flex items-center gap-3 p-4 bg-sky/10 border border-sky/20 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-sky/40 flex items-center justify-center font-display text-sm font-semibold text-ocean-dark">
                  {selectedSub.initials}
                </div>
                <div>
                  <div className="font-display text-sm font-semibold text-ocean">{selectedSub.student}</div>
                  <span className={`px-2 py-0.5 rounded font-display text-xs font-semibold border ${STATUS_STYLE[selectedSub.status]}`}>
                    {selectedSub.status}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">
                  Score <span className="font-body text-xs text-[var(--text-muted)] font-normal">out of 100</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number" min={0} max={100}
                    value={gradeForm.score}
                    onChange={e => setGradeForm(p => ({ ...p, score: e.target.value }))}
                    className="w-28 px-4 py-2.5 rounded-lg border border-ocean/20 font-display text-lg font-semibold text-ocean text-center focus:outline-none focus:border-ocean"
                    placeholder="0"
                  />
                  <div className="flex-1 text-right">
                    {gradeForm.score && (
                      <div className={`font-display text-2xl font-semibold
                        ${parseInt(gradeForm.score)>=80?'text-teal-dark':parseInt(gradeForm.score)>=60?'text-ocean':'text-red-500'}`}>
                        {parseInt(gradeForm.score)>=90?'A+':parseInt(gradeForm.score)>=80?'A':
                         parseInt(gradeForm.score)>=75?'B+':parseInt(gradeForm.score)>=70?'B':
                         parseInt(gradeForm.score)>=60?'C+':parseInt(gradeForm.score)>=50?'C':'D'}
                      </div>
                    )}
                  </div>
                </div>
                {/* Quick grade buttons */}
                <div className="flex gap-2 mt-2">
                  {[100,90,80,70,60,50].map(v => (
                    <button key={v} onClick={() => setGradeForm(p => ({ ...p, score:v.toString() }))}
                      className="px-3 py-1 bg-ocean/8 text-ocean border border-ocean/20 rounded font-display text-xs hover:bg-ocean/15 transition-colors">
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">
                  Teacher's Remarks
                </label>
                <textarea
                  rows={4}
                  value={gradeForm.remarks}
                  onChange={e => setGradeForm(p => ({ ...p, remarks: e.target.value }))}
                  placeholder="Write feedback for the student and parent..."
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => setView('submissions')}
                  className="flex-1 py-2.5 border border-ocean/20 text-[var(--text-muted)] font-display text-sm rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={handleGrade}
                  disabled={!gradeForm.score || !selectedSub.file}
                  className="flex-1 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors disabled:opacity-50"
                >
                  Save Grade
                </button>
              </div>

              {!selectedSub.file && (
                <p className="font-body text-xs text-[var(--text-muted)] text-center">
                  ⚠️ Student hasn't submitted yet — you can still pre-enter a grade.
                </p>
              )}
            </div>
          </div>
        </div>
      </AppShell>
    )
  }

  // ── SUBMISSIONS VIEW ────────────────────────────────────────
  if (view === 'submissions' && selectedA) {
    const gradedCount   = submissions.filter(s => s.status === 'GRADED').length
    const pendingCount  = submissions.filter(s => s.status === 'PENDING').length
    const submittedCount= submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'LATE').length

    return (
      <AppShell pageTitle="Submissions">
        <button onClick={() => setView('list')}
          className="flex items-center gap-2 font-display text-sm text-ocean mb-5 hover:underline">
          ← Back to assignments
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-ocean">{selectedA.title}</h2>
            <p className="font-body text-sm text-[var(--text-muted)]">
              {selectedA.subject} · Due {new Date(selectedA.dueDate).toLocaleDateString('en-KE', { dateStyle:'medium' })}
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label:`${submittedCount} To Grade`, color:'bg-teal/10 text-teal-dark border-teal/30'  },
              { label:`${gradedCount} Graded`,      color:'bg-ocean/8 text-ocean border-ocean/20'     },
              { label:`${pendingCount} Missing`,    color:'bg-red-50 text-red-400 border-red-200'     },
            ].map(p => (
              <span key={p.label} className={`px-4 py-2 rounded-full border font-display text-xs font-semibold ${p.color}`}>
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* Attachment downloads */}
        {selectedA.attachments.length > 0 && (
          <div className="bg-sky/10 border border-sky/25 rounded-sms p-4 mb-5">
            <p className="font-display text-sm font-semibold text-ocean mb-2">📎 Assignment Attachments</p>
            <div className="flex flex-wrap gap-2">
              {selectedA.attachments.map(f => (
                <button key={f} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-ocean/20 rounded-lg font-body text-xs text-ocean hover:bg-ocean/5 transition-colors">
                  📄 {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submission list */}
        <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
          <div className="px-6 py-3 bg-ocean/3 border-b border-ocean/8 grid grid-cols-12 gap-4">
            {['Student','File','Status','Score','Submitted','Action'].map((h,i) => (
              <div key={h} className={`font-display text-xs text-[var(--text-muted)] ${
                i===0?'col-span-3':i===1?'col-span-3':i===2?'col-span-2':i===3?'col-span-1':i===4?'col-span-2':'col-span-1'}`}>{h}</div>
            ))}
          </div>

          {submissions.map(sub => (
            <div key={sub.id} className="px-6 py-4 border-b border-ocean/6 last:border-0 grid grid-cols-12 gap-4 items-center hover:bg-ocean/2 transition-colors">
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky/40 flex items-center justify-center font-display text-xs font-semibold text-ocean-dark flex-shrink-0">
                  {sub.initials}
                </div>
                <span className="font-body text-sm font-semibold text-[var(--text-body)]">{sub.student}</span>
              </div>
              <div className="col-span-3">
                {sub.file ? (
                  <button className="flex items-center gap-1.5 text-ocean hover:underline font-body text-xs">
                    📄 {sub.file}
                  </button>
                ) : (
                  <span className="font-body text-xs text-[var(--text-muted)]">No file</span>
                )}
              </div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-full border font-display text-xs font-semibold ${STATUS_STYLE[sub.status]}`}>
                  {sub.status}
                </span>
              </div>
              <div className="col-span-1 font-display text-sm font-semibold text-ocean">
                {sub.score !== null ? sub.score + '/100' : '—'}
              </div>
              <div className="col-span-2 font-body text-xs text-[var(--text-muted)]">
                {sub.submitted ? new Date(sub.submitted).toLocaleDateString('en-KE', { dateStyle:'medium' }) : '—'}
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => openGrade(sub)}
                  className={`px-3 py-1.5 font-display text-xs rounded-lg border transition-colors
                    ${sub.status === 'GRADED'
                      ? 'bg-sky/15 text-ocean border-sky/30 hover:bg-sky/25'
                      : 'bg-ocean text-white border-ocean hover:bg-ocean-dark'}`}
                >
                  {sub.status === 'GRADED' ? 'Edit' : 'Grade'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </AppShell>
    )
  }

  // ── ASSIGNMENTS LIST VIEW ───────────────────────────────────
  return (
    <AppShell pageTitle="Assignments">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ocean">Grade 4 Maple</h2>
          <p className="font-body text-sm text-[var(--text-muted)]">{assignments.length} assignments this term</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-ocean hover:bg-ocean-dark text-white font-display text-sm rounded-lg transition-colors">
          + New Assignment
        </button>
      </div>

      <div className="space-y-4">
        {assignments.map(a => {
          const pct      = Math.round((a.submitted / a.total) * 100)
          const isOverdue = new Date(a.dueDate) < new Date()
          return (
            <div key={a.id} className="bg-white rounded-sms border border-ocean/10 p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full border font-display text-xs font-semibold ${TYPE_COLORS[a.type]}`}>
                    {a.type}
                  </span>
                  <span className="font-body text-xs text-[var(--text-muted)]">{a.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full font-display text-xs font-semibold border
                    ${a.isPublished ? 'bg-teal/10 text-teal-dark border-teal/30' : 'bg-ocean/8 text-ocean border-ocean/20'}`}>
                    {a.isPublished ? '🟢 Published' : '⚫ Draft'}
                  </span>
                  <button onClick={() => togglePublish(a.id)}
                    className="px-3 py-1 rounded-lg border border-ocean/20 font-display text-xs text-ocean hover:bg-ocean/5 transition-colors">
                    {a.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>

              <h3 className="font-display text-base font-semibold text-ocean mb-1">{a.title}</h3>
              {a.description && (
                <p className="font-body text-xs text-[var(--text-muted)] mb-2 line-clamp-1">{a.description}</p>
              )}

              {/* Attachments */}
              {a.attachments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {a.attachments.map(f => (
                    <span key={f} className="flex items-center gap-1 px-2 py-1 bg-sky/10 border border-sky/20 rounded font-body text-xs text-ocean">
                      📎 {f}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mb-3">
                <span className={`font-body text-xs ${isOverdue ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                  📅 Due {new Date(a.dueDate).toLocaleDateString('en-KE', { dateStyle:'medium' })}
                  {isOverdue && ' · Overdue'}
                </span>
                <span className="font-body text-xs text-[var(--text-muted)]">📥 {a.submitted}/{a.total} submitted</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-ocean/8 rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full" style={{ width: pct + '%' }} />
                </div>
                <span className="font-display text-xs text-[var(--text-muted)] w-8 text-right">{pct}%</span>
                <button
                  onClick={() => openSubmissions(a)}
                  className="px-4 py-1.5 bg-ocean/8 text-ocean border border-ocean/20 font-display text-xs rounded-lg hover:bg-ocean/15 transition-colors ml-2"
                >
                  View Submissions →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sms-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-ocean/8 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-display text-lg font-semibold text-ocean">New Assignment</h3>
              <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-ocean text-xl">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Title</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean"
                  placeholder="e.g. Mathematics Holiday Pack" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Subject</label>
                  <input required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean"
                    placeholder="e.g. Mathematics" />
                </div>
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as AssignType }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean bg-white">
                    <option value="HOLIDAY">Holiday</option>
                    <option value="CLASSWORK">Classwork</option>
                    <option value="PROJECT">Project</option>
                    <option value="TEST">Test</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Due Date</label>
                  <input type="date" required value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean" />
                </div>
                <div>
                  <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Max Score</label>
                  <input type="number" value={form.maxScore} onChange={e => setForm(p => ({ ...p, maxScore: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean" />
                </div>
              </div>
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">Instructions</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-ocean/20 font-body text-sm focus:outline-none focus:border-ocean resize-none"
                  placeholder="Describe the assignment for students and parents..." />
              </div>

              {/* File upload */}
              <div>
                <label className="block font-display text-sm font-semibold text-[var(--text-body)] mb-1.5">
                  📎 Attach Reference Documents
                  <span className="font-body text-xs font-normal text-[var(--text-muted)] ml-1">(worksheets, instructions, guides)</span>
                </label>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-ocean/25 rounded-lg cursor-pointer bg-ocean/3 hover:bg-ocean/6 transition-colors">
                  <div className="text-2xl mb-1">📁</div>
                  <div className="font-display text-sm text-ocean">Click to upload files</div>
                  <div className="font-body text-xs text-[var(--text-muted)]">PDF, DOC, images accepted</div>
                  <input type="file" multiple accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" onChange={handleFileSelect} />
                </label>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uploadedFiles.map(f => (
                      <div key={f} className="flex items-center gap-1.5 px-3 py-1.5 bg-sky/10 border border-sky/20 rounded-lg">
                        <span className="font-body text-xs text-ocean">📄 {f}</span>
                        <button type="button" onClick={() => setUploadedFiles(prev => prev.filter(x => x !== f))}
                          className="text-[var(--text-muted)] hover:text-red-500 text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-ocean/20 text-[var(--text-muted)] font-display text-sm rounded-lg">Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors">
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}