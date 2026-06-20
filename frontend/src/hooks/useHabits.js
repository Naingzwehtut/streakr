import { useState, useEffect, useCallback } from 'react'
import api from '../api'

export function useHabits() {
  const [habits, setHabits] = useState([])
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [hRes, cRes] = await Promise.all([
        api.get('/api/habits/'),
        api.get('/api/completions/?days=30'),
      ])
      setHabits(hRes.data)
      setCompletions(cRes.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addHabit = async (data) => {
    const r = await api.post('/api/habits/', data)
    setHabits(h => [...h, r.data])
    return r.data
  }

  const updateHabit = async (id, data) => {
    const r = await api.put(`/api/habits/${id}`, data)
    setHabits(h => h.map(x => x.id === id ? r.data : x))
    return r.data
  }

  const deleteHabit = async (id) => {
    await api.delete(`/api/habits/${id}`)
    setHabits(h => h.filter(x => x.id !== id))
    setCompletions(c => c.filter(x => x.habit_id !== id))
  }

  const toggleCompletion = async (habitId, date) => {
    const r = await api.post('/api/completions/toggle', { habit_id: habitId, date })
    if (r.data.completed) {
      setCompletions(c => [...c, { habit_id: habitId, completed_date: date }])
    } else {
      setCompletions(c => c.filter(x => !(x.habit_id === habitId && x.completed_date === date)))
    }
    // refresh streaks
    const hRes = await api.get('/api/habits/')
    setHabits(hRes.data)
  }

  const isCompleted = (habitId, date) =>
    completions.some(c => c.habit_id === habitId && c.completed_date === date)

  return { habits, completions, loading, addHabit, updateHabit, deleteHabit, toggleCompletion, isCompleted, refresh: fetchAll }
}
