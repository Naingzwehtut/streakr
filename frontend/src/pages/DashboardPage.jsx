import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useHabits } from '../hooks/useHabits'
import TodayView from '../components/TodayView'
import CalendarView from '../components/CalendarView'
import StatsView from '../components/StatsView'
import ManageView from '../components/ManageView'
import HabitModal from '../components/HabitModal'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const habitData = useHabits()
  const [tab, setTab] = useState('today')
  const [modal, setModal] = useState(null) // null | { habit?: object }

  const greet = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toISOString().slice(0, 10)
  const todayDone = habitData.habits.filter(h => habitData.isCompleted(h.id, today)).length

  const openAdd = () => setModal({})
  const openEdit = (habit) => setModal({ habit })
  const closeModal = () => setModal(null)

  const tabs = [
    { id: 'today', label: 'Today', icon: 'ti-circle-check' },
    { id: 'calendar', label: 'Calendar', icon: 'ti-calendar' },
    { id: 'stats', label: 'Stats', icon: 'ti-chart-bar' },
    { id: 'manage', label: 'Habits', icon: 'ti-settings' },
  ]

  return (
    <div>
      <div className="topbar">
        <div className="topbar-logo">🔥 Streakr</div>
        <span className="topbar-user">{user?.name?.split(' ')[0]}</span>
        <button className="icon-btn" onClick={toggle} aria-label="Toggle theme">
          <i className={`ti ${dark ? 'ti-sun' : 'ti-moon'}`}></i>
        </button>
        <button className="icon-btn" onClick={logout} aria-label="Sign out" title="Sign out">
          <i className="ti ti-logout"></i>
        </button>
      </div>

      <div className="nav-strip">
        {tabs.map(t => (
          <button key={t.id} className={`nav-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            <i className={`ti ${t.icon}`}></i> {t.label}
          </button>
        ))}
      </div>

      <div className="content">
        {tab === 'today' && (
          <>
            <div className="section-head">
              <div>
                <div className="section-title">{greet}, {user?.name?.split(' ')[0]} 👋</div>
                <div className="section-sub">{fmtDate(today)} · {todayDone}/{habitData.habits.length} done</div>
              </div>
              <button className="btn btn-sm" onClick={openAdd}><i className="ti ti-plus"></i> Add habit</button>
            </div>
            <TodayView {...habitData} today={today} />
          </>
        )}
        {tab === 'calendar' && (
          <>
            <div className="section-head">
              <div>
                <div className="section-title">Completion history</div>
                <div className="section-sub">Last 30 days overview</div>
              </div>
            </div>
            <CalendarView {...habitData} today={today} />
          </>
        )}
        {tab === 'stats' && (
          <>
            <div className="section-head">
              <div className="section-title">Your progress</div>
            </div>
            <StatsView {...habitData} today={today} />
          </>
        )}
        {tab === 'manage' && (
          <>
            <div className="section-head">
              <div className="section-title">Your habits</div>
              <button className="btn btn-sm" onClick={openAdd}><i className="ti ti-plus"></i> Add habit</button>
            </div>
            <ManageView {...habitData} onEdit={openEdit} />
          </>
        )}
      </div>

      {modal !== null && (
        <HabitModal
          habit={modal.habit}
          onClose={closeModal}
          onSave={async (data) => {
            if (modal.habit) {
              await habitData.updateHabit(modal.habit.id, data)
            } else {
              await habitData.addHabit(data)
            }
            closeModal()
          }}
        />
      )}
    </div>
  )
}

function fmtDate(ds) {
  return new Date(ds + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
