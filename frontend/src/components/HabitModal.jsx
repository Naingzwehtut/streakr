import { useState, useEffect, useRef } from 'react'

const COLORS = ['#534AB7', '#0F6E56', '#3B6D11', '#BA7517', '#D85A30', '#993556', '#185FA5', '#A32D2D']
const EMOJIS = ['✨', '💪', '📚', '🧘', '🏃', '🥗', '💧', '🎯', '🎸', '🌱', '😴', '🖊️']

export default function HabitModal({ habit, onClose, onSave }) {
  const [name, setName] = useState(habit?.name || '')
  const [emoji, setEmoji] = useState(habit?.emoji || '✨')
  const [color, setColor] = useState(habit?.color || '#534AB7')
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const submit = async () => {
    if (!name.trim()) return
    setSaving(true)
    try { await onSave({ name: name.trim(), emoji, color }) }
    finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          {habit ? 'Edit habit' : 'New habit'}
          <button className="icon-btn" onClick={onClose} aria-label="Close"><i className="ti ti-x"></i></button>
        </div>

        <div className="field">
          <label>Habit name</label>
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. Morning walk"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
        </div>

        <div className="field">
          <label>Emoji</label>
          <div className="emoji-row">
            {EMOJIS.map(e => (
              <span key={e} className={`emoji-opt ${emoji === e ? 'sel' : ''}`} onClick={() => setEmoji(e)}>{e}</span>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Color</label>
          <div className="color-row">
            {COLORS.map(c => (
              <div key={c} className={`color-swatch ${color === c ? 'sel' : ''}`} style={{ background: c }} onClick={() => setColor(c)} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: '1.25rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={submit} disabled={saving || !name.trim()}>
            {saving ? 'Saving…' : habit ? 'Save changes' : 'Add habit'}
          </button>
        </div>
      </div>
    </div>
  )
}
