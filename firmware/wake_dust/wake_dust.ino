/*
 * Wake the Dust V0 — Seeed XIAO nRF52840 Sense
 *
 * Board : Seeed nRF52 Boards → Seeed XIAO nRF52840 Sense
 * Libs  : Seeed_Arduino_LSM6DS3, ArduinoBLE
 *
 * Wiki IMU : https://wiki.seeedstudio.com/XIAO-BLE-Sense-IMU-Usage/
 */

#include <ArduinoBLE.h>
#include "LSM6DS3.h"
#include "Wire.h"

LSM6DS3 imu(I2C_MODE, 0x6A);

static const char *DEVICE_NAME = "WakeDust-10kg";
static const char *SVC_UUID = "FD00";
static const char *CHR_UUID = "FD01";

BLEService wakeService(SVC_UUID);
BLECharacteristic wakeChar(CHR_UUID, BLERead | BLENotify, 4);

static const float G = 9.81f;
static const float PEAK_G = 1.55f;     // |a| / g
static const float REST_G = 1.12f;
static const uint16_t REFRACTORY_MS = 280;
static const uint16_t IDLE_SLEEP_MS = 8000;
static const uint8_t DONE_REPS = 8;
static const uint8_t DONE_SEC = 20;

uint8_t reps = 0;
uint32_t awakeAt = 0;
uint32_t lastPeakAt = 0;
bool armed = true;
bool sessionDone = false;
uint32_t lastNotify = 0;

void packAndNotify() {
  uint32_t sec = (millis() - awakeAt) / 1000;
  if (sec > 255) sec = 255;
  uint8_t flags = 0;
  if (sessionDone) flags |= 0x01;
  if (reps >= DONE_REPS || sec >= DONE_SEC) flags |= 0x02;
  uint8_t buf[4] = {0x01, reps, (uint8_t)sec, flags};
  wakeChar.writeValue(buf, 4);
}

float magG() {
  float x = imu.readFloatAccelX();
  float y = imu.readFloatAccelY();
  float z = imu.readFloatAccelZ();
  return sqrtf(x * x + y * y + z * z);
}

void setup() {
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  digitalWrite(LED_RED, HIGH);
  digitalWrite(LED_GREEN, HIGH);

  Serial.begin(115200);
  delay(300);

  if (imu.begin() != 0) {
    Serial.println("IMU fail");
    while (1) {
      digitalWrite(LED_RED, LOW);
      delay(120);
      digitalWrite(LED_RED, HIGH);
      delay(120);
    }
  }

  if (!BLE.begin()) {
    Serial.println("BLE fail");
    while (1) {
      digitalWrite(LED_RED, LOW);
      delay(400);
      digitalWrite(LED_RED, HIGH);
      delay(400);
    }
  }

  BLE.setLocalName(DEVICE_NAME);
  BLE.setDeviceName(DEVICE_NAME);
  BLE.setAdvertisedService(wakeService);
  wakeService.addCharacteristic(wakeChar);
  BLE.addService(wakeService);
  uint8_t zero[4] = {0x01, 0, 0, 0};
  wakeChar.writeValue(zero, 4);
  BLE.advertise();

  awakeAt = millis();
  Serial.println("WakeDust advertising WakeDust-10kg");
  digitalWrite(LED_GREEN, LOW);
  delay(80);
  digitalWrite(LED_GREEN, HIGH);
}

void loop() {
  BLE.poll();

  float g = magG();
  uint32_t now = millis();

  if (armed && g > PEAK_G && (now - lastPeakAt) > REFRACTORY_MS) {
    if (reps < 255) reps++;
    lastPeakAt = now;
    armed = false;
    Serial.print("rep ");
    Serial.println(reps);
    digitalWrite(LED_GREEN, LOW);
    delay(20);
    digitalWrite(LED_GREEN, HIGH);
    packAndNotify();
    lastNotify = now;
  }
  if (!armed && g < REST_G) {
    armed = true;
  }

  uint32_t sec = (now - (awakeAt ? awakeAt : now)) / 1000;
  if (!sessionDone && (reps >= DONE_REPS || sec >= DONE_SEC)) {
    sessionDone = true;
    packAndNotify();
    lastNotify = now;
    Serial.println("session done");
  }

  if (now - lastNotify > 1000 && reps > 0) {
    packAndNotify();
    lastNotify = now;
  }

  if (reps > 0 && (now - lastPeakAt) > IDLE_SLEEP_MS) {
    Serial.println("idle reset session");
    reps = 0;
    sessionDone = false;
    awakeAt = now;
    armed = true;
    packAndNotify();
  }
}
