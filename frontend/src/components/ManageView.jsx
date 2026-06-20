export default function ManageView({ habits, deleteHabit, onEdit, loading }) {
  if (loading) return <div className="spinner">Loading…</div>
  if (!habits.length) return (
    <div className="empty">
      <i className="ti ti-list"></i>
      <div style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>No habits yet</div>
      <p>Add one above to start tracking.</p>
    </div>
  )

  return (
    <div>
      {habits.map(h => (
        <div key={h.id} className="manage-item">
          <div className="color-dot" style={{ background: h.color || 'var(--accent)' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{h.emoji} {h.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
              Started {fmtDate(h.created_at)} · {h.streak || 0} day streak
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="icon-btn" onClick={() => onEdit(h)} aria-label="Edit habit">
              <i className="ti ti-edit"></i>
            </button>
            <button
              className="icon-btn btn-danger"
              style={{ borderColor: 'transparent' }}
              onClick={() => { if (window.confirm(`Delete "${h.name}"?`)) deleteHabit(h.id) }}
              aria-label="Delete habit"
            >
              <i className="ti ti-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function fmtDate(ds) {
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
