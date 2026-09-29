const ble = require('../../utils/ble')
const store = require('../../utils/store')

Page({
  data: {
    scanning: false,
    devices: [],
    connected: '',
    last: null,
    err: ''
  },
  onUnload() {
    this.stop()
  },
  async scan() {
    this.setData({ err: '', scanning: true, devices: [] })
    try {
      await ble.inited()
    } catch (e) {
      this.setData({
        scanning: false,
        err: '打不开蓝牙。安卓请开定位权限。'
      })
      return
    }
    wx.onBluetoothDeviceFound((res) => {
      const list = this.data.devices.slice()
      ;(res.devices || []).forEach((d) => {
        const name = d.name || d.localName || ''
        if (!name.startsWith('WakeDust')) return
        if (list.find((x) => x.deviceId === d.deviceId)) return
        list.push({
          deviceId: d.deviceId,
          name: name || d.deviceId.slice(0, 8)
        })
      })
      this.setData({ devices: list })
    })
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false
    })
  },
  stop() {
    wx.stopBluetoothDevicesDiscovery({ complete() {} })
    this.setData({ scanning: false })
  },
  connect(e) {
    const id = e.currentTarget.dataset.id
    const name = e.currentTarget.dataset.name
    wx.createBLEConnection({
      deviceId: id,
      success: () => {
        this.setData({ connected: name })
        this.listen(id)
      },
      fail: (err) => {
        this.setData({ err: '连不上 ' + JSON.stringify(err) })
      }
    })
  },
  listen(deviceId) {
    const tryNotify = (serviceId, charId) => {
      wx.notifyBLECharacteristicValueChange({
        deviceId,
        serviceId,
        characteristicId: charId,
        state: true,
        success: () => {
          wx.onBLECharacteristicValueChange((res) => {
            const p = ble.parsePayload(res.value)
            if (!p) return
            this.setData({ last: p })
            if (p.done) store.markToday(p.reps)
          })
        }
      })
    }
    wx.getBLEDeviceServices({
      deviceId,
      success: (sres) => {
        const svcs = sres.services || []
        const svc =
          svcs.find((s) => (s.uuid || '').toUpperCase().includes('FD00')) ||
          svcs[0]
        if (!svc) return
        wx.getBLEDeviceCharacteristics({
          deviceId,
          serviceId: svc.uuid,
          success: (cres) => {
            const ch =
              (cres.characteristics || []).find((c) =>
                (c.uuid || '').toUpperCase().includes('FD01')
              ) || (cres.characteristics || [])[0]
            if (ch) tryNotify(svc.uuid, ch.uuid)
          }
        })
      }
    })
  }
})
