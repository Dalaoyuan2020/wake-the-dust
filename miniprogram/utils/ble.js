const SERVICE = '0000FD00-0000-1000-8000-00805F9B34FB'
const CHAR = '0000FD01-0000-1000-8000-00805F9B34FB'
const SERVICE_SHORT = 'FD00'

function parsePayload(buf) {
  const u8 = new Uint8Array(buf)
  if (!u8.length) return null
  return {
    ver: u8[0],
    reps: u8[1] || 0,
    sec: u8[2] || 0,
    flags: u8[3] || 0,
    done: !!(u8[3] & 0x01) || (u8[1] || 0) >= 8 || (u8[2] || 0) >= 20
  }
}

function inited() {
  return new Promise((resolve, reject) => {
    wx.openBluetoothAdapter({
      success: resolve,
      fail: reject
    })
  })
}

module.exports = { SERVICE, CHAR, SERVICE_SHORT, parsePayload, inited }
