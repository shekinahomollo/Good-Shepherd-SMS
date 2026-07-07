import AppShell from '../../components/layout/AppShell'

const DEMO_CLASSES = [
  { name: 'Kindergarten A', teacher: 'Ms. Akinyi',   present: 22, total: 25, marked: true  },
  { name: 'Grade 1 Sunflower', teacher: 'Mr. Owino', present: 28, total: 30, marked: true  },
  { name: 'Grade 2 Bluebell',  teacher: 'Ms. Njeri', present: 31, total: 32, marked: true  },
  { name: 'Grade 3 Cedar',     teacher: 'Mr. Omondi',present: 27, total: 29, marked: true  },
  { name: 'Grade 4 Maple',     teacher: 'Ms. Wahu',  present: 0,  total: 28, marked: false },
  { name: 'Grade 5 Acacia',    teacher: 'Mr. Mwangi',present: 0,  total: 31, marked: false },
  { name: 'Grade 6 Baobab',    teacher: 'Ms. Chebet',present: 30, total: 33, marked: true  },
]

export default function AdminAttendance() {
  const totalStudents = DEMO_CLASSES.reduce((s, c) => s + c.total, 0)
  const totalPresent  = DEMO_CLASSES.reduce((s, c) => s + c.present, 0)
  const markedClasses = DEMO_CLASSES.filter(c => c.marked).length
  const overallPct    = Math.round((totalPresent / totalStudents) * 100)

  return (
    <AppShell pageTitle="Attendance">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { icon: '🏫', label: 'Classes Marked',    value: `${markedClasses}/${DEMO_CLASSES.length}`, accent: 'border-ocean' },
          { icon: '👥', label: 'Total Students',    value: totalStudents,                              accent: 'border-teal'  },
          { icon: '✅', label: 'Present Today',     value: totalPresent,                               accent: 'border-gold'  },
          { icon: '📊', label: 'Overall Rate',      value: overallPct + '%',                           accent: 'border-sky'   },
        ].map(stat => (
          <div key={stat.label} className={`bg-white rounded-sms border border-ocean/10 border-t-4 ${stat.accent} p-5`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-display text-xs text-[var(--text-muted)] mb-1">{stat.label}</div>
            <div className="font-display text-3xl font-semibold text-ocean leading-none">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Class table */}
      <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-ocean/8 flex items-center justify-between">
          <span className="font-display text-base font-semibold text-ocean">
            ✅ Today's Attendance by Class
          </span>
          <span className="font-body text-xs text-[var(--text-muted)]">
            {new Date().toLocaleDateString('en-KE', { dateStyle: 'full' })}
          </span>
        </div>

        {/* Table header */}
        <div className="px-6 py-3 bg-ocean/3 grid grid-cols-12 gap-4 border-b border-ocean/8">
          <div className="col-span-4 font-display text-xs text-[var(--text-muted)]">Class</div>
          <div className="col-span-3 font-display text-xs text-[var(--text-muted)]">Class Teacher</div>
          <div className="col-span-2 font-display text-xs text-[var(--text-muted)]">Present</div>
          <div className="col-span-2 font-display text-xs text-[var(--text-muted)]">Rate</div>
          <div className="col-span-1 font-display text-xs text-[var(--text-muted)]">Status</div>
        </div>

        {DEMO_CLASSES.map((cls, i) => {
          const pct = cls.marked ? Math.round((cls.present / cls.total) * 100) : null
          return (
            <div key={i} className="px-6 py-4 border-b border-ocean/6 last:border-0 grid grid-cols-12 gap-4 items-center hover:bg-ocean/2 transition-colors">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky/40 flex items-center justify-center font-display text-xs font-semibold text-ocean-dark">
                  {cls.name.slice(0, 2)}
                </div>
                <span className="font-body text-sm font-semibold text-[var(--text-body)]">{cls.name}</span>
              </div>
              <div className="col-span-3 font-body text-sm text-[var(--text-muted)]">{cls.teacher}</div>
              <div className="col-span-2 font-body text-sm text-[var(--text-body)]">
                {cls.marked ? `${cls.present} / ${cls.total}` : '— / ' + cls.total}
              </div>
              <div className="col-span-2">
                {pct !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-ocean/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 90 ? 'bg-teal' : pct >= 75 ? 'bg-gold' : 'bg-red-400'}`}
                        style={{ width: pct + '%' }}
                      />
                    </div>
                    <span className="font-display text-xs text-[var(--text-body)]">{pct}%</span>
                  </div>
                ) : (
                  <span className="font-display text-xs text-[var(--text-muted)]">—</span>
                )}
              </div>
              <div className="col-span-1">
                <span className={`px-2 py-1 rounded-full font-display text-xs font-semibold border
                  ${cls.marked
                    ? 'bg-teal/10 text-teal-dark border-teal/30'
                    : 'bg-red-50 text-red-500 border-red-200'
                  }`}>
                  {cls.marked ? '✓' : '✗'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

    </AppShell>
  )
}