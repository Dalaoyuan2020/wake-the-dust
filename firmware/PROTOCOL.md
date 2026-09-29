# BLE 协议 V0

广播名：`WakeDust-10kg`

| | UUID |
|---|---|
| Service | `0000FD00-0000-1000-8000-00805F9B34FB` |
| Notify char | `0000FD01-0000-1000-8000-00805F9B34FB` |

小程序里写成：

```
SERVICE_ID = '0000FD00-0000-1000-8000-00805F9B34FB'
CHAR_ID    = '0000FD01-0000-1000-8000-00805F9B34FB'
```

iOS 上微信可能要求 UUID 大写。安卓有时返 16-bit `FD00`，绑定页里做了兼容。

## Notify 载荷 4 字节

```
[0] ver   = 0x01
[1] reps  = 本次醒着周期累计（0–255）
[2] sec   = 本次醒着已经过了几秒（封顶 255）
[3] flags bit0=session_done  bit1=today_counted_hint
```

小程序规则：`reps >= 8` 或 `sec >= 20` 或 `flags.bit0` → 今天算数。
