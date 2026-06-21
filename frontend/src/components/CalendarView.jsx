export default function CalendarView({ habits, isCompleted, today }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today + 'T00:00:00')
    d.setDate(d.getDate() - 29 + i)
    return d.toISOString().slice(0, 10)
  })

  const firstDate = new Date(days[0] + 'T00:00:00')
  const startOffset = firstDate.getDay() // 0=Sun, 1=Mon, ...
  const cells = [...Array(startOffset).fill(null), ...days]
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div>
      <div className="cal-header">
        {dayNames.map(d => <div key={d} className="cal-day-label">{d}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map((ds, i) => {
          if (!ds) return <div key={i} className="cal-cell empty" />

          const total = habits.length
          const done = habits.filter(h => isCompleted(h.id, ds)).length
          const pct = total > 0 ? done / total : 0
          const isToday = ds === today

          let colorClass = ''
          if (total > 0) {
            if (pct === 1) colorClass = 'all-done'
            else if (pct > 0) colorClass = 'some-done'
          }

          return (
            <div
              key={ds}
              className={`cal-cell ${colorClass} ${isToday ? 'is-today' : ''}`}
              title={`${formatDate(ds)}: ${done}/${total} habits done`}
            >
              {new Date(ds + 'T00:00:00').getDate()}
              {done > 0 && (
                <div style={{
                  position: 'absolute', bottom: 3, left: '50%',
                  transform: 'translateX(-50%)',
                  width: Math.round(pct * 14) + 'px', height: 3,
                  borderRadius: 2,
                  background: pct === 1 ? 'var(--green-mid)' : 'var(--teal)'
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Today pointer */}
      <div style={{
        marginTop: '1rem', padding: '10px 14px',
        background: 'var(--accent-light)', borderRadius: 'var(--radius)',
        fontSize: 13, color: 'var(--accent-text)',
        display: 'flex', alignItems: 'center', gap: 8
      }}>
        <i className="ti ti-calendar-event"></i>
        Today is <strong>{formatDate(today)}</strong> —
        {habits.length === 0
          ? ' add habits to start tracking.'
          : ` ${habits.filter(h => isCompleted(h.id, today)).length}/${habits.length} habits done today.`
        }
      </div>

      <div className="cal-legend">
        <span><span className="legend-dot" style={{ background: 'var(--green-mid)' }}></span>All done</span>
        <span><span className="legend-dot" style={{ background: 'var(--teal)' }}></span>Some done</span>
        <span><span className="legend-dot" style={{ background: 'var(--border2)' }}></span>None</span>
        <span><span style={{
          display: 'inline-block', width: 10, height: 10, borderRadius: 2,
          border: '2px solid var(--accent)', verticalAlign: 'middle', marginRight: 4
        }}></span>Today</span>
      </div>
    </div>
  )
}

function formatDate(ds) {
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  })
}