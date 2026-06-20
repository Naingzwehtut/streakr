import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default function StatsView({ habits, isCompleted, today }) {
  const weekRef = useRef(null)
  const streakRef = useRef(null)
  const weekChart = useRef(null)
  const streakChart = useRef(null)

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today + 'T00:00:00')
    d.setDate(d.getDate() - 6 + i)
    return d.toISOString().slice(0, 10)
  })
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today + 'T00:00:00')
    d.setDate(d.getDate() - 29 + i)
    return d.toISOString().slice(0, 10)
  })

  const todayDone = habits.filter(h => isCompleted(h.id, today)).length
  const bestStreak = habits.length ? Math.max(...habits.map(h => h.streak || 0)) : 0
  const total30 = last30.reduce((s, d) => s + habits.filter(h => isCompleted(h.id, d)).length, 0)
  const rate = habits.length ? Math.round(total30 / (habits.length * 30) * 100) : 0

  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#b4b2a9' : '#5f5e5a'
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'

  useEffect(() => {
    if (!weekRef.current) return
    if (weekChart.current) weekChart.current.destroy()
    const weekData = last7.map(d => habits.filter(h => isCompleted(h.id, d)).length)
    const weekLabels = last7.map(d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }))
    weekChart.current = new Chart(weekRef.current, {
      type: 'bar',
      data: {
        labels: weekLabels,
        datasets: [{
          label: 'Habits done',
          data: weekData,
          backgroundColor: last7.map(d => d === today ? '#534AB7' : 'rgba(83,74,183,0.35)'),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11, family: 'Inter' } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 }, precision: 0, stepSize: 1 }, min: 0, max: Math.max(habits.length, 1) }
        }
      }
    })
    return () => { if (weekChart.current) weekChart.current.destroy() }
  }, [habits, today, isDark])

  useEffect(() => {
    if (!streakRef.current || !habits.length) return
    if (streakChart.current) streakChart.current.destroy()
    streakChart.current = new Chart(streakRef.current, {
      type: 'bar',
      data: {
        labels: habits.map(h => `${h.emoji} ${h.name}`),
        datasets: [{
          label: 'Streak (days)',
          data: habits.map(h => h.streak || 0),
          backgroundColor: habits.map(h => (h.color || '#534AB7') + '88'),
          borderColor: habits.map(h => h.color || '#534AB7'),
          borderWidth: 1.5,
          borderRadius: 5,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { size: 11 }, precision: 0 }, min: 0 },
          y: { grid: { display: false }, ticks: { color: textColor, font: { size: 11 } } }
        }
      }
    })
    return () => { if (streakChart.current) streakChart.current.destroy() }
  }, [habits, isDark])

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Today</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{todayDone}/{habits.length}</div>
          <div className="stat-sub">habits done</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Best streak</div>
          <div className="stat-value" style={{ color: 'var(--amber)' }}>🔥 {bestStreak}</div>
          <div className="stat-sub">days in a row</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">30-day rate</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{rate}%</div>
          <div className="stat-sub">completion</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active habits</div>
          <div className="stat-value">{habits.length}</div>
          <div className="stat-sub">being tracked</div>
        </div>
      </div>

      <div className="chart-box">
        <div className="chart-title">Habits completed — last 7 days</div>
        <div style={{ position: 'relative', height: 180 }}>
          <canvas ref={weekRef} role="img" aria-label="Bar chart of daily habit completions over the last 7 days">Weekly completion data.</canvas>
        </div>
      </div>

      {habits.length > 0 && (
        <div className="chart-box">
          <div className="chart-title">Current streak per habit</div>
          <div style={{ position: 'relative', height: Math.max(120, habits.length * 46) }}>
            <canvas ref={streakRef} role="img" aria-label="Horizontal bar chart of current streak for each habit">Streak data.</canvas>
          </div>
        </div>
      )}
    </div>
  )
}
