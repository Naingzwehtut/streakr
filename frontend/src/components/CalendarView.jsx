export default function CalendarView({ habits, isCompleted, today }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today + 'T00:00:00')
    d.setDate(d.getDate() - 29 + i)
    return d.toISOString().slice(0, 10)
  })

  const firstDate = new Date(days[0] + 'T00:00:00')
  const startOffset = firstDate.getDay()
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
          if (!total) return (
            <div key={ds} className={`cal-cell ${ds === today ? 'is-today' : ''}`}>
              {new Date(ds + 'T00:00:00').getDate()}
            </div>
          )
          const done = habits.filter(h => isCompleted(h.id, ds)).length
          const pct = done / total
          const cls = `${pct === 1 ? 'all-done' : pct > 0 ? 'some-done' : ''} ${ds === today ? 'is-today' : ''}`
          return (
            <div key={ds} className={`cal-cell ${cls}`} title={`${formatDate(ds)}: ${done}/${total}`}>
              {new Date(ds + 'T00:00:00').getDate()}
              {done > 0 && (
                <div style={{
                  position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
                  width: Math.round(pct * 14) + 'px', height: 3, borderRadius: 2,
                  background: pct === 1 ? 'var(--green-mid)' : 'var(--teal)'
                }} />
              )}
            </div>
          )
        })}
      </div>
      <div className="cal-legend">
        <span><span className="legend-dot" style={{ background: 'var(--green-mid)' }}></span>All done</span>
        <span><span className="legend-dot" style={{ background: 'var(--teal)' }}></span>Some done</span>
        <span><span className="legend-dot" style={{ background: 'var(--border2)' }}></span>None</span>
      </div>
    </div>
  )
}

function formatDate(ds) {
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
