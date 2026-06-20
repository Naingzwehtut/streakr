import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function AuthPage() {
  const { login, register } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        if (!name.trim()) { setError('Enter your name'); setLoading(false); return }
        await register(name, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div style={{ position: 'fixed', top: 16, right: 16 }}>
        <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
          <i className={`ti ti-${dark ? 'sun' : 'moon'}`}></i>
        </button>
      </div>
      <div className="auth-card">
        <div className="auth-logo">🔥 Streakr</div>
        <div className="auth-sub">Build habits that stick.</div>
        <div className="auth-tabs">
          <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError('') }}>Sign in</button>
          <button className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError('') }}>Create account</button>
        </div>
        <form onSubmit={submit}>
          {mode === 'signup' && (
            <div className="field">
              <label>Name</label>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus={mode === 'login'} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder={mode === 'signup' ? '6+ characters' : 'Password'} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="err">{error}</div>}
          <button className="btn" type="submit" style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
