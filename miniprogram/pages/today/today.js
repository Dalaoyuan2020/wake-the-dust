const store = require('../../utils/store')
const soul = require('../../utils/soul')

Page({
  data: {
    on: false,
    streak: 0,
    line: '',
    name: '客厅 10kg'
  },
  onShow() {
    const data = store.load()
    const on = store.isTodayOn()
    this.setData({
      on,
      streak: data.streak || 0,
      line: soul.lineFor({
        doneAlready: on,
        justDone: false,
        streak: data.streak || 0,
        miss: 0
      })
    })
  },
  fakeLift() {
    const before = store.isTodayOn()
    const res = store.markToday(8)
    this.setData({
      on: true,
      streak: res.streak,
      line: soul.lineFor({
        doneAlready: before,
        justDone: !before,
        streak: res.streak,
        miss: 0
      })
    })
  }
})
