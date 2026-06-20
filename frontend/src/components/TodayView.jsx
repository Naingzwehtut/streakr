export default function TodayView({ habits, isCompleted, toggleCompletion, today, loading }) {
  if (loading) return <div className="spinner">Loading habits…</div>

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today + 'T00:00:00')
    d.setDate(d.getDate() - 6 + i)
    return d.toISOString().slice(0, 10)
  })

  if (!habits.length) return (
    <div className="empty">
      <i className="ti ti-plant-2"></i>
      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text2)' }}>No habits yet</div>
      <p>Add your first habit above to start building streaks.</p>
    </div>
  )

  return (
    <div className="habit-list">
      {habits.map(h => {
        const done = isCompleted(h.id, today)
        return (
          <div key={h.id} className={`habit-card ${done ? 'done' : ''}`}>
            <button
              className="check-btn"
              onClick={() => toggleCompletion(h.id, today)}
              aria-label={`Mark ${h.name} as ${done ? 'incomplete' : 'complete'}`}
            >
              {done && <i className="ti ti-check"></i>}
            </button>
            <div className="habit-info">
              <div className="habit-name">{h.emoji} {h.name}</div>
              <div className="habit-meta">
                {h.streak > 0 && (
                  <span className="streak-badge">
                    <i className="ti ti-flame" style={{ fontSize: 11 }}></i>
                    {h.streak} day{h.streak !== 1 ? 's' : ''}
                  </span>
                )}
                <div className="week-dots" title="Last 7 days">
                  {last7.map(d => (
                    <div
                      key={d}
                      className={`dot ${isCompleted(h.id, d) ? 'done' : ''} ${d === today ? 'is-today' : ''}`}
                      title={d}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
