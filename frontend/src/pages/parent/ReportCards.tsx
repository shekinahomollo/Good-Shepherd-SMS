import AppShell from '../../components/layout/AppShell'

export default function ParentReportCards() {
  return (
    <AppShell pageTitle="Report Cards">
      <div className="mb-6">
        <h2 className="font-display text-xl font-semibold text-ocean">Aisha's Report Cards</h2>
        <p className="font-body text-sm text-[var(--text-muted)]">Grade 3 Cedar</p>
      </div>

      <div className="space-y-4">
        {[
          { term: 'Term 2 2025', avg: '81%', grade: 'B', published: true  },
          { term: 'Term 1 2025', avg: '78%', grade: 'B+', published: true },
          { term: 'Term 3 2024', avg: '74%', grade: 'B', published: true  },
        ].map((r, i) => (
          <div key={i} className="bg-white rounded-sms border border-ocean/10 p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sms bg-ocean/8 flex items-center justify-center text-2xl">📄</div>
              <div>
                <div className="font-display text-base font-semibold text-ocean">{r.term}</div>
                <div className="font-body text-sm text-[var(--text-muted)] mt-0.5">
                  Average: <strong className="text-ocean">{r.avg}</strong> · Grade: <strong className="text-teal-dark">{r.grade}</strong>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-teal/10 text-teal-dark border border-teal/30 rounded-full font-display text-xs font-semibold">
                ✓ Published
              </span>
              <button className="px-4 py-2 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors">
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}