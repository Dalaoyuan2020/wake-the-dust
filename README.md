# 唤醒旧物 / Wake the Dust

She Nicest · 女构未来线上征集
**「给吃灰硬件装上一个 AI 灵魂」**

给家里已经吃灰的实物装一张嘴和一份记性。它被举起来才醒，醒了就记一笔；闲太久就在微信里嘴臭你。

第一只灵魂：**哑铃贴片**  
第二只灵魂（备选）：**男生出门镜**

仓库：https://github.com/Dalaoyuan2020/wake-the-dust

---

## 这一句话

健身这轮不追身材变化。追的是：**今天这件旧物被记下来了**。

---

## 现状 2026-09-29

- [x] 题目定义与征集对齐
- [x] 可行性 / 竞品 / BOM 核查
- [x] 固件 V0：`firmware/wake_dust/wake_dust.ino`
- [x] 小程序 V0：今日 / 日历 / 它说 / 绑定
- [x] 对话代理草稿：`server/talk.js`
- [ ] 买板：XIAO nRF52840 Sense × 2
- [ ] 微信开发者工具导入小程序真机跑通
- [ ] 板 + 小程序闭环
- [ ] 路演录像

---

## 今天能做的两件事

1. 下单 [XIAO nRF52840 Sense](https://www.seeedstudio.com/Seeed-XIAO-BLE-Sense-nRF52840-p-5253.html) × 2
2. 用微信开发者工具打开 `miniprogram/`，先点「今日」黄按钮演日历

## 文档

| 文件 | 内容 |
|---|---|
| [firmware/PROTOCOL.md](firmware/PROTOCOL.md) | BLE 4 字节协议 |
| [docs/BRIEF.md](docs/BRIEF.md) | 征集题 |
| [docs/FEASIBILITY.md](docs/FEASIBILITY.md) | 可行性 |
| [docs/COMPETITORS.md](docs/COMPETITORS.md) | 竞品 |
| [docs/BOM.md](docs/BOM.md) | 零件 |
| [docs/SCHEDULE.md](docs/SCHEDULE.md) | 14 天排期 |
