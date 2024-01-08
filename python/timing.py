#!/usr/bin/env python3

from datetime import datetime

start_time = datetime.now()
print(f"Start time: {datetime.now().strftime('%H:%M:%S')}")

interval = 10

while interval != 0:
    if (datetime.now() - start_time).seconds == 1:
        start_time = datetime.now()
        print(f"Current time: {datetime.now().strftime('%H:%M:%S')}")
        interval -= 1
