const store = require('../../utils/store')
const soul = require('../../utils/soul')

Page({
  data: {
    input: '',
    msgs: []
  },
  onShow() {
    const data = store.load()
    const on = store.isTodayOn()
    this.setData({
      msgs: [
        {
          role: 'iron',
          text: soul.lineFor({
            doneAlready: on,
            justDone: false,
            streak: data.streak || 0,
            miss: 0
          })
        }
      ]
    })
  },
  onInput(e) {
    this.setData({ input: e.detail.value })
  },
  send() {
    const text = (this.data.input || '').trim()
    if (!text) return
    const msgs = this.data.msgs.concat([{ role: 'me', text }])
    const data = store.load()
    const reply = soul.lineFor({
      doneAlready: store.isTodayOn(),
      justDone: false,
      streak: data.streak || 0,
      miss: 0
    })
    this.setData({
      input: '',
      msgs: msgs.concat([{ role: 'iron', text: reply }])
    })
    const api = wx.getStorageSync('talk_api')
    if (!api) return
    wx.request({
      url: api,
      method: 'POST',
      data: { text, streak: data.streak || 0, today: store.isTodayOn() },
      success: (res) => {
        if (res.data && res.data.reply) {
          const next = this.data.msgs.slice()
          next[next.length - 1] = { role: 'iron', text: res.data.reply }
          this.setData({ msgs: next })
        }
      }
    })
  }
})
