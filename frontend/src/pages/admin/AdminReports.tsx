import AppShell from '../../components/layout/AppShell'

const CLASSES = [
  { name:'Grade 6 Baobab',    avg:79, highest:95, lowest:52, published:true,  total:33 },
  { name:'Grade 5 Acacia',    avg:74, highest:91, lowest:48, published:true,  total:31 },
  { name:'Grade 4 Maple',     avg:81, highest:94, lowest:55, published:false, total:28 },
  { name:'Grade 3 Cedar',     avg:76, highest:92, lowest:50, published:false, total:29 },
  { name:'Grade 2 Bluebell',  avg:83, highest:98, lowest:61, published:true,  total:32 },
  { name:'Grade 1 Sunflower', avg:85, highest:99, lowest:63, published:true,  total:30 },
  { name:'Kindergarten A',    avg:88, highest:100,lowest:70, published:false, total:25 },
]

function gradeColor(avg: number) {
  if (avg >= 80) return 'text-teal-dark'
  if (avg >= 70) return 'text-ocean'
  if (avg >= 60) return 'text-[#7a5f00]'
  return 'text-red-500'
}

export default function AdminReports() {
  return (
    <AppShell pageTitle="Reports & Grades">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ocean">Term 2 Academic Reports</h2>
          <p className="font-body text-sm text-[var(--text-muted)]">School-wide performance overview</p>
        </div>
        <button className="px-5 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors">
          📄 Publish All Reports
        </button>
      </div>

      {/* School average */}
      <div className="bg-ocean rounded-[20px] p-6 mb-6 flex items-center justify-between relative overflow-hidden">
        <div className="absolute w-48 h-48 rounded-full bg-white/5 -top-12 -right-8" />
        <div>
          <p className="font-body text-sky text-sm mb-1">School-wide average — Term 2</p>
          <h2 className="font-display text-4xl font-semibold text-white">
            {Math.round(CLASSES.reduce((s,c) => s+c.avg,0) / CLASSES.length)}%
          </h2>
        </div>
        <div className="flex gap-4 z-10">
          {[
            { label:'Classes',   value: CLASSES.length },
            { label:'Published', value: CLASSES.filter(c=>c.published).length },
            { label:'Pending',   value: CLASSES.filter(c=>!c.published).length },
          ].map(s => (
            <div key={s.label} className="bg-white/12 rounded-sms px-5 py-3 text-center">
              <div className="font-display text-2xl text-gold font-semibold">{s.value}</div>
              <div className="font-body text-xs text-white/70 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Class breakdown */}
      <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
        <div className="px-6 py-3 bg-ocean/3 border-b border-ocean/8 grid grid-cols-12 gap-4">
          {['Class','Students','Average','Highest','Lowest','Status','Action'].map((h,i) => (
            <div key={h} className={`font-display text-xs text-[var(--text-muted)] ${i===0?'col-span-3':i===6?'col-span-2':'col-span-1'}`}>{h}</div>
          ))}
        </div>
        {CLASSES.map((c, i) => (
          <div key={i} className="px-6 py-4 border-b border-ocean/6 last:border-0 grid grid-cols-12 gap-4 items-center hover:bg-ocean/2 transition-colors">
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky/30 flex items-center justify-center font-display text-xs font-semibold text-ocean">
                {c.name.slice(0,2)}
              </div>
              <span className="font-body text-sm font-semibold text-[var(--text-body)]">{c.name}</span>
            </div>
            <div className="col-span-1 font-body text-sm text-[var(--text-muted)]">{c.total}</div>
            <div className={`col-span-1 font-display text-base font-semibold ${gradeColor(c.avg)}`}>{c.avg}%</div>
            <div className="col-span-1 font-body text-sm text-teal-dark">{c.highest}%</div>
            <div className="col-span-1 font-body text-sm text-red-400">{c.lowest}%</div>
            <div className="col-span-1">
              <div className="w-full h-1.5 bg-ocean/8 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${c.avg>=80?'bg-teal':c.avg>=70?'bg-gold':'bg-red-400'}`}
                  style={{ width: c.avg + '%' }} />
              </div>
            </div>
            <div className="col-span-1">
              <span className={`px-2 py-1 rounded-full font-display text-xs font-semibold border
                ${c.published ? 'bg-teal/10 text-teal-dark border-teal/30' : 'bg-gold/15 text-[#7a5f00] border-gold/30'}`}>
                {c.published ? '✓ Published' : 'Pending'}
              </span>
            </div>
            <div className="col-span-2 flex gap-2">
              <button className="px-3 py-1.5 bg-ocean/8 text-ocean border border-ocean/20 font-display text-xs rounded-lg hover:bg-ocean/15 transition-colors">
                View
              </button>
              {!c.published && (
                <button className="px-3 py-1.5 bg-teal/10 text-teal-dark border border-teal/30 font-display text-xs rounded-lg hover:bg-teal/20 transition-colors">
                  Publish
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}