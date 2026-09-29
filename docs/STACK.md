# 技术栈

## 总图

```
[吃灰哑铃]
    |绑带
[XIAO nRF52840 Sense]
    | BLE notify ≤20B
[微信小程序 唤醒旧物]
    | HTTPS
[云函数 / 小服务器]
    +→ DeepSeek / 通义 Chat API
    +→ 日历库（先本地 storage，后云）
```

## 硬件

| 层 | 选型 | 为什么 |
|---|---|---|
| MCU + BLE + IMU | Seeed XIAO nRF52840 Sense | 一块板齐全部，Arduino/官方 SDK都能烧 |
| 备选更便宜 | nRF52832 模块 ~16–26 元 + LIS3DH 模块 | 要飞线，适合第二轮 |
| 电池 | 3.7V 150–300mAh 软包（XIAO 带充电管）或 CR2032 | 黑客松用软包好演示 |
| 固定 | 泡棍绑带 / 3D 打印夹壳 | 胶贴会飞 |
| 可选 | 压电片 + LED | 只做「举了会亮」 |

固件状态机：

```
SLEEP --IMU INT--> AWAKE --count peaks--> BURST_BLE --idle 8s--> SLEEP
```

广播名：`WakeDust-10kg`

服务 UUID（自定义，后续写进固件）：

- Service `0000FD00-0000-1000-8000-00805F9B34FB`
- Char notify `0000FD01-...` payload: `[ver:1][reps:u8][sec:u8][flags:u8]`

## 小程序

- 原生微信小程序（不用 uni-app，减一层 BLE 坑）
- 页：今日 / 日历 / 对话 / 我的旧物
- 存储：先 `wx.setStorage`，再云开发
- BLE API：`openBluetoothAdapter` → `startBluetoothDevicesDiscovery` → `createBLEConnection` → `notifyBLECharacteristicValueChange`

## 服务端

黑客松可用：

- 微信云开发云函数，或
- 一个 50 行的 Cloudflare Worker / 钦鸟函数

职责：代理 Chat API、偷 Key、可选发一次性订阅。

## 明确不做（V0）

- 动作分类
- 卡路里
- 课程
- 小程序后台长连 BLE
- 纯自发电供电
- 好友圈 / 排行
