import AppShell from '../../components/layout/AppShell'

const DEMO = [
  { title:'Mathematics Holiday Pack',  class:'Grade 4 Maple',    subject:'Mathematics', type:'HOLIDAY',   submitted:18, total:32, published:true  },
  { title:'English Reading Journal',   class:'Grade 3 Cedar',    subject:'English',     type:'HOLIDAY',   submitted:24, total:29, published:true  },
  { title:'Science Mid-term Test',     class:'Grade 2 Bluebell', subject:'Science',     type:'TEST',      submitted:0,  total:32, published:false },
  { title:'Social Studies Project',    class:'Grade 6 Baobab',   subject:'SST',         type:'PROJECT',   submitted:20, total:33, published:true  },
  { title:'KG Letter Recognition',     class:'Kindergarten A',   subject:'Literacy',    type:'CLASSWORK', submitted:22, total:25, published:true  },
]

const TYPE_COLOR: Record<string,string> = {
  HOLIDAY:   'bg-teal/10 text-teal-dark border-teal/30',
  CLASSWORK: 'bg-ocean/8 text-ocean border-ocean/20',
  PROJECT:   'bg-gold/15 text-[#7a5f00] border-gold/30',
  TEST:      'bg-red-50 text-red-500 border-red-200',
}

export default function AdminAssignments() {
  return (
    <AppShell pageTitle="Assignments">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ocean">All Assignments</h2>
          <p className="font-body text-sm text-[var(--text-muted)]">School-wide assignment overview</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:'Total Assignments', value: DEMO.length,                          accent:'border-ocean' },
          { label:'Published',         value: DEMO.filter(d => d.published).length,  accent:'border-teal'  },
          { label:'Drafts',            value: DEMO.filter(d => !d.published).length, accent:'border-gold'  },
        ].map(s => (
          <div key={s.label} className={`bg-white rounded-sms border border-ocean/10 border-t-4 ${s.accent} p-5`}>
            <div className="font-display text-xs text-[var(--text-muted)] mb-1">{s.label}</div>
            <div className="font-display text-3xl font-semibold text-ocean">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
        <div className="px-6 py-3 bg-ocean/3 border-b border-ocean/8 grid grid-cols-12 gap-4">
          {['Assignment','Class','Type','Submissions','Status'].map((h, i) => (
            <div key={h} className={`font-display text-xs text-[var(--text-muted)] ${
              i===0?'col-span-4':i===1?'col-span-3':i===2?'col-span-2':i===3?'col-span-2':'col-span-1'}`}>{h}</div>
          ))}
        </div>
        {DEMO.map((a, i) => {
          const pct = Math.round((a.submitted / a.total) * 100)
          return (
            <div key={i} className="px-6 py-4 border-b border-ocean/6 last:border-0 grid grid-cols-12 gap-4 items-center hover:bg-ocean/2 transition-colors">
              <div className="col-span-4">
                <div className="font-body text-sm font-semibold text-[var(--text-body)]">{a.title}</div>
                <div className="font-body text-xs text-[var(--text-muted)]">{a.subject}</div>
              </div>
              <div className="col-span-3 font-body text-xs text-[var(--text-muted)]">{a.class}</div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-full border font-display text-xs font-semibold ${TYPE_COLOR[a.type]}`}>
                  {a.type}
                </span>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-ocean/8 rounded-full overflow-hidden">
                    <div className="h-full bg-teal rounded-full" style={{ width: pct + '%' }} />
                  </div>
                  <span className="font-display text-xs text-[var(--text-muted)]">{a.submitted}/{a.total}</span>
                </div>
              </div>
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded-full font-display text-xs font-semibold border
                  ${a.published ? 'bg-teal/10 text-teal-dark border-teal/30' : 'bg-ocean/8 text-ocean border-ocean/20'}`}>
                  {a.published ? '🟢' : '⚫'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}