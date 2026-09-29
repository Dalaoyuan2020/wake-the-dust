# 唤醒旧物 / Wake the Dust

She Nicest · 女构未来线上征集
**「给吃灰硬件装上一个 AI 灵魂」**

给家里已经吃灰的实物装一张嘴和一份记性。它被举起来才醒，醒了就记一笔；闲太久就在微信里嘴臭你。

第一只灵魂：**哑铃贴片**  
第二只灵魂（备选）：**男生出门镜**

仓库：https://github.com/Dalaoyuan2020/wake-the-dust

---

## 这一句话

健身这轮不追身材变化。追的是：**今天这件旧物被记下来了**。像多邻国的连胜数字，不像一节语言课。

---

## 文档

| 文件 | 内容 |
|---|---|
| [docs/BRIEF.md](docs/BRIEF.md) | 征集题与产品定义 |
| [docs/FEASIBILITY.md](docs/FEASIBILITY.md) | 全网可行性（已核对） |
| [docs/COMPETITORS.md](docs/COMPETITORS.md) | 竞品分析 |
| [docs/STACK.md](docs/STACK.md) | 技术栈 |
| [docs/BOM.md](docs/BOM.md) | 零件与 2 万预算 |
| [docs/SCHEDULE.md](docs/SCHEDULE.md) | 下沉 / 实施排期 |
| [souls/dumbbell.md](souls/dumbbell.md) | 10kg 人设 |
| [souls/mirror.md](souls/mirror.md) | 出门镜人设 |

---

## 仓库结构

```
wake-the-dust/
  firmware/        # 贴片固件（运动唤醒 → BLE）
  miniprogram/     # 微信小程序「唤醒旧物」
  server/          # 对话 API 代理、订阅消息
  souls/           # 灵魂提示词
  docs/            # 研究与排期
```

---

## 现状

- [x] 题目定义与征集对齐
- [x] 可行性 / 竞品 / BOM 核查
- [ ] 买板：XIAO nRF52840 Sense × 2
- [ ] 固件：一晃发一包
- [ ] 小程序：今日亮格 + 对话
- [ ] 路演闭环

后续都在这个仓库里推。
