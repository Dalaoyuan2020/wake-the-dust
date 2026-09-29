const KEY = 'wake_dust_log_v1'

function todayKey() {
  const d = new Date()
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function load() {
  return wx.getStorageSync(KEY) || { days: {}, streak: 0 }
}

function save(data) {
  wx.setStorageSync(KEY, data)
}

function markToday(reps) {
  const data = load()
  const k = todayKey()
  const first = !data.days[k]
  data.days[k] = {
    reps: Math.max((data.days[k] && data.days[k].reps) || 0, reps || 0),
    at: Date.now()
  }
  if (first) {
    const y = new Date(Date.now() - 86400000)
    const yk = `${y.getFullYear()}-${`${y.getMonth() + 1}`.padStart(2, '0')}-${`${y.getDate()}`.padStart(2, '0')}`
    data.streak = data.days[yk] ? (data.streak || 0) + 1 : 1
  }
  save(data)
  return { first, ...data, today: k }
}

function isTodayOn() {
  return !!load().days[todayKey()]
}

module.exports = { todayKey, load, markToday, isTodayOn }
