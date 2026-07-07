import AppShell from '../../components/layout/AppShell'

const DEMO_RECORDS = [
  { date: '2025-06-02', status: 'PRESENT' },
  { date: '2025-06-03', status: 'PRESENT' },
  { date: '2025-06-04', status: 'ABSENT'  },
  { date: '2025-06-05', status: 'PRESENT' },
  { date: '2025-06-06', status: 'LATE'    },
  { date: '2025-06-09', status: 'PRESENT' },
  { date: '2025-06-10', status: 'PRESENT' },
  { date: '2025-06-11', status: 'EXCUSED' },
  { date: '2025-06-12', status: 'PRESENT' },
  { date: '2025-06-13', status: 'PRESENT' },
]

const statusStyle: Record<string, string> = {
  PRESENT: 'bg-teal/10 text-teal-dark border-teal/30',
  ABSENT:  'bg-red-50 text-red-500 border-red-200',
  LATE:    'bg-gold/15 text-[#7a5f00] border-gold/30',
  EXCUSED: 'bg-sky/20 text-ocean border-sky/40',
}

const statusIcon: Record<string, string> = {
  PRESENT: '✅',
  ABSENT:  '❌',
  LATE:    '⏰',
  EXCUSED: '📋',
}

export default function ParentAttendance() {
  const present = DEMO_RECORDS.filter(r => r.status === 'PRESENT').length
  const absent  = DEMO_RECORDS.filter(r => r.status === 'ABSENT').length
  const late    = DEMO_RECORDS.filter(r => r.status === 'LATE').length
  const pct     = Math.round((present / DEMO_RECORDS.length) * 100)

  return (
    <AppShell pageTitle="Attendance">

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { icon: '📅', label: 'Total Days',       value: DEMO_RECORDS.length, accent: 'border-ocean' },
          { icon: '✅', label: 'Days Present',      value: present,             accent: 'border-teal'  },
          { icon: '❌', label: 'Days Absent',       value: absent,              accent: 'border-red-400' },
          { icon: '📊', label: 'Attendance Rate',   value: pct + '%',           accent: 'border-gold'  },
        ].map(stat => (
          <div key={stat.label} className={`bg-white rounded-sms border border-ocean/10 border-t-4 ${stat.accent} p-5`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-display text-xs text-[var(--text-muted)] mb-1">{stat.label}</div>
            <div className="font-display text-3xl font-semibold text-ocean leading-none">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Record list */}
      <div className="bg-white rounded-sms border border-ocean/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-ocean/8 flex items-center justify-between">
          <span className="font-display text-base font-semibold text-ocean">
            📅 Aisha's Attendance Record — Term 2
          </span>
          <div className="flex gap-2">
            {['PRESENT','ABSENT','LATE','EXCUSED'].map(s => (
              <span key={s} className={`px-3 py-1 rounded-full border font-display text-xs ${statusStyle[s]}`}>
                {statusIcon[s]} {s.charAt(0) + s.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        </div>

        {DEMO_RECORDS.map((record, i) => (
          <div key={i} className="px-6 py-4 border-b border-ocean/6 last:border-0 flex items-center justify-between hover:bg-ocean/2 transition-colors">
            <div className="flex items-center gap-4">
              <div className="font-body text-sm text-[var(--text-muted)] w-8">{i + 1}</div>
              <div>
                <div className="font-body text-sm font-semibold text-[var(--text-body)]">
                  {new Date(record.date).toLocaleDateString('en-KE', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                </div>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full border font-display text-xs font-semibold ${statusStyle[record.status]}`}>
              {statusIcon[record.status]} {record.status.charAt(0) + record.status.slice(1).toLowerCase()}
            </span>
          </div>
        ))}
      </div>

    </AppShell>
  )
}