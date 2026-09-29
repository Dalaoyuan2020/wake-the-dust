# firmware

目标板：**Seeed XIAO nRF52840 Sense**（带 IMU 的那块，不是普通 XIAO nRF52840）。

## 烧录

1. Arduino IDE 装板卡：`Seeed nRF52 Boards`，选 **Seeed XIAO nRF52840 Sense**。
2. 库：
   - [Seeed_Arduino_LSM6DS3](https://github.com/Seeed-Studio/Seeed_Arduino_LSM6DS3)
   - ArduinoBLE（库管理器）
3. 打开 `wake_dust/wake_dust.ino`，上传。
4. 串口 115200。晃板子会出 `rep 1`…
5. 手机微信开发者工具打小程序，进「绑定」页搜 `WakeDust`。

协议见 [PROTOCOL.md](PROTOCOL.md)。

V0 不做真深睡眠。先证明一晃能记。
