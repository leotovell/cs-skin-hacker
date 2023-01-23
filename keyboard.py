import pynput.keyboard
kb = pynput.keyboard.Controller()
import time
import pynput

while True:
    time.sleep(0.2)
    kb.press(pynput.keyboard.Key.delete)
    kb.release(pynput.keyboard.Key.delete)
    # PressKey(0x2E)
    # ReleaseKey(0x2E)