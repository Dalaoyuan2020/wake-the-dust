const store = require('../../utils/store')

Page({
  data: { cells: [], streak: 0 },
  onShow() {
    const data = store.load()
    const cells = []
    const now = new Date()
    for (let i = 27; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000)
      const k = `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`
      cells.push({
        k,
        day: d.getDate(),
        on: !!data.days[k]
      })
    }
    this.setData({ cells, streak: data.streak || 0 })
  }
})
