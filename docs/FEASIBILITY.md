# 可行性分析（已核对）

核查日期：2026-09-29。下表「主证据」都可点开。

## 1. 总判

| 块 | 黑客松 48h | 2 万预算做完整原型 | 消费级量产 |
|---|---|---|---|
| IMU 运动唤醒 + 数周期 | 可行 | 可行 | 成熟 |
| BLE 发到微信小程序 | 可行 | 可行 | 有坑，见下 |
| 小程序日历 + 连胜 | 可行 | 可行 | 可行 |
| LLM 嘴臭对话 | 可行 | 可行 | 可行 |
| 举铃自发电供整板 | 不稳 | 只能做灯效 | 研究级 |
| 小程序主动催练（每天推） | 部分可行 | 受微信规则限制 | 见订阅消息 |
| 双人房间 | 可做皮 | 可行 | 个人主体审核难 |

**结论：** 黑客松闭环不需要自研芯片。用现成 XIAO nRF52840 Sense + 小程序 + Chat API，2 万预算容得下多套原型和一轮打样。不要把「自充电」写成唯一电源。

## 2. 硬件感知

路径：加速度计运动中断唤醒 MCU → 合加速度波峰计数 → 静止再睡 → BLE 发短包。

核查：

- Nordic nRF52810 System ON 睡眠典型 **0.6–0.8 μA**（[nRF52810 PS v1.2](https://infocenter.nordicsemi.com/) 电气规格）。
- Seeed XIAO nRF52840 Sense Plus 厂商写 DeepSleep **5 μA**，板载 LSM6DS3TR-C + 充电 IC（[Marutsu 规格](https://www.marutsu.co.jp/pc/i/3588337/) ，2026-09 查）。
- 消费级类比：智能高尔夫球 nRF52840 + IMU，睡眠 **~3.8 μA**，击球才发射，CR2032 目标 18 个月（[DigitalMonk 实测](https://digitalmonk.biz/nrf52840-power-optimization-sleep-modes-dma-ble/) ，2026-09）。
- 米家智能哑铃：六轴 IMU 嵌在 1kg 哑铃里，零售约 129 元，说明消费级计数路径成熟；重量段不符合「改造已有铁」。
- FED Fitness DT1：外挂 IMU + 蓝牙，官网约 35 美元，评价极少，说明「万能贴」品类未成熟，但硬件路径已被商品化试过。

**黑客松选型：** XIAO nRF52840 Sense（板载 IMU + BLE + 可接膊电）。不要第一周打自定义 PCB。

## 3. 自充电（必须说清楚）

举铃频率低、冲程慢。压电 / 摩擦电单次收能通常是 **微焦到毫焦** 量级。BLE 广播脉冲是 **毫安级 × 几十毫秒**。

专利与论文能证明「振动供电 + 加速度节点」在实验室成立（例如自供能无线加速度节点能量管理电路专利 CN117856415A），不能证明 48 小时内做稳。

黑客松三层：

1. **主电源：** CR2032 或 100–300mAh 软包 + USB-C。
2. **回家补电：** 座上触点或无线充小圈。
3. **效果：** 压电片只闪灯，不供 MCU。

## 4. 微信小程序 BLE

主证据：[微信开放文档 · BLE](https://developers.weixin.qq.com/miniprogram/dev/framework/device/ble.html) （2026-09-24 抓取）。

已确认的硬限制：

- 主机模式从基础库 1.1.0 就有；`wx.createBLEConnection` 可用。
- 小程序进后台 **约 5 秒会被微信断 BLE**（社区 / 实测口径多见；官方未写成固定 5 秒，但「后台断连」是真实约束）。演示必须留在前台。
- 安卓 6.0+ 搜 BLE 需要定位权限。
- iOS 的 `deviceId` 是系统生成的 UUID，不能硬编码 MAC。
- 默认 ATT MTU 5c0f，第一版协议包 **≤ 20 字节**。
- 连接 / 断开必须成对调用，否则安卓易 GATT 133。

黑客松策略：小程序打开 → 搜 `WakeDust-` → 连 → notify 收 `reps` → 亮格。不要做后台长连。

## 5. 小程序主体、类目、上架

- 黑客松演示用 **开发版 / 体验版二维码** 即可，不强制上架。
- 个人主体：工具类可以；**社交、笔记、好友加密围坑**（微信开放社区 2024–2025 审核口径）。第一版不要做社交广场。
- 真要上架：备案 + 合适类目（IT 科技 / 健康）；好友互催可能要企业主体。

## 6. 推送 / 「每天催」

主证据：

- [小程序订阅消息](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)
- [设备消息](https://developers.weixin.qq.com/miniprogram/dev/framework/device/device-message.html)
- [`wx.requestSubscribeDeviceMessage`](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeDeviceMessage.html) （基础库 2.20.0+）

已核对：

| 通道 | 真实规则 | 本项怎么用 |
|---|---|---|
| 一次性订阅 | 点一次发一条；须用户点击触发；普通类目只能走这条 | 举完请一次「明日提醒」额度 |
| 长期订阅 | 政务/医疗/交通等类目 | **拿不到** |
| 设备消息 | 需完成微信「设备接入」拿 model_id | 2 万预算下可以申，黑客松条件不够 |

**不要承诺「小程序像多邻国一样每晚自动推」。** 演示用：小程序内弹一句 / 微信群机器人 / 本地通知（若改 App）。

## 7. 对话 API

可行、已验证的做法：服务端中转 DeepSeek / 通义 / 微信对话开放平台。Key 不进小程序。

2 万预算下 API 成本可忽略（DeepSeek 级别万次短对话仍是百元级）。

人设见 `souls/`。黑客松先写死 12 句，API 挂上之后也要留脱网底。

## 8. 男生镜

技术上只是相机 + 视觉 API / 纯文字描述。小程序相机成熟。风险在审核（人脸、美妆教程类目）和「吃灰硬件」弱。不抢哑铃焊接时间。
