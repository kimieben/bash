import board
import digitalio
import time

#define pin for voltage sensor
voltage_sensor_pin = board.GP3

#initialize voltage sensor
voltage_sensor = digitalio.DigitalInOut(voltage_sensor_pin)
voltage_sensor.direction = digitalio.Direction.INPUT

#initialize sending commands to QCB


while True:
    if not voltage_sensor.value:
        print("Fire detected, sending to QCB")

