from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import time

import ctypes
from ctypes import wintypes
import time

user32 = ctypes.WinDLL('user32', use_last_error=True)

INPUT_MOUSE    = 0
INPUT_KEYBOARD = 1
INPUT_HARDWARE = 2

KEYEVENTF_EXTENDEDKEY = 0x0001
KEYEVENTF_KEYUP       = 0x0002
KEYEVENTF_UNICODE     = 0x0004
KEYEVENTF_SCANCODE    = 0x0008

MAPVK_VK_TO_VSC = 0

# msdn.microsoft.com/en-us/library/dd375731
VK_TAB  = 0x09
VK_MENU = 0x12

# C struct definitions

wintypes.ULONG_PTR = wintypes.WPARAM

class MOUSEINPUT(ctypes.Structure):
    _fields_ = (("dx",          wintypes.LONG),
                ("dy",          wintypes.LONG),
                ("mouseData",   wintypes.DWORD),
                ("dwFlags",     wintypes.DWORD),
                ("time",        wintypes.DWORD),
                ("dwExtraInfo", wintypes.ULONG_PTR))

class KEYBDINPUT(ctypes.Structure):
    _fields_ = (("wVk",         wintypes.WORD),
                ("wScan",       wintypes.WORD),
                ("dwFlags",     wintypes.DWORD),
                ("time",        wintypes.DWORD),
                ("dwExtraInfo", wintypes.ULONG_PTR))

    def __init__(self, *args, **kwds):
        super(KEYBDINPUT, self).__init__(*args, **kwds)
        # some programs use the scan code even if KEYEVENTF_SCANCODE
        # isn't set in dwFflags, so attempt to map the correct code.
        if not self.dwFlags & KEYEVENTF_UNICODE:
            self.wScan = user32.MapVirtualKeyExW(self.wVk,
                                                 MAPVK_VK_TO_VSC, 0)

class HARDWAREINPUT(ctypes.Structure):
    _fields_ = (("uMsg",    wintypes.DWORD),
                ("wParamL", wintypes.WORD),
                ("wParamH", wintypes.WORD))

class INPUT(ctypes.Structure):
    class _INPUT(ctypes.Union):
        _fields_ = (("ki", KEYBDINPUT),
                    ("mi", MOUSEINPUT),
                    ("hi", HARDWAREINPUT))
    _anonymous_ = ("_input",)
    _fields_ = (("type",   wintypes.DWORD),
                ("_input", _INPUT))

LPINPUT = ctypes.POINTER(INPUT)

def _check_count(result, func, args):
    if result == 0:
        raise ctypes.WinError(ctypes.get_last_error())
    return args

user32.SendInput.errcheck = _check_count
user32.SendInput.argtypes = (wintypes.UINT, # nInputs
                             LPINPUT,       # pInputs
                             ctypes.c_int)  # cbSize

# Functions

def PressKey(hexKeyCode):
    x = INPUT(type=INPUT_KEYBOARD,
              ki=KEYBDINPUT(wVk=hexKeyCode))
    user32.SendInput(1, ctypes.byref(x), ctypes.sizeof(x))

def ReleaseKey(hexKeyCode):
    x = INPUT(type=INPUT_KEYBOARD,
              ki=KEYBDINPUT(wVk=hexKeyCode,
                            dwFlags=KEYEVENTF_KEYUP))
    user32.SendInput(1, ctypes.byref(x), ctypes.sizeof(x))

def AltTab():
    """Press Alt+Tab and hold Alt key for 2 seconds
    in order to see the overlay.
    """
    PressKey(VK_MENU)   # Alt
    PressKey(VK_TAB)    # Tab
    ReleaseKey(VK_TAB)  # Tab~
    time.sleep(2)
    ReleaseKey(VK_MENU) # Alt~

chardict = {"a": 0x41, "b": 0x42, "c": 0x43, "d": 0x44, "e": 0x45, "f": 0x46, "g": 0x47, "h": 0x48, "i": 0x49, "j": 0x4A, "k": 0x4B, "l": 0x4C, "m": 0x4D, "n": 0x4E, "o": 0x4F, "p": 0x50, "q": 0x51, "r": 0x52, "s": 0x53, "t": 0x54, "u": 0x55, "v": 0x56, "w": 0x57, "x": 0x58, "y": 0x59, "z": 0x5A, "Delete": 0x2E, " ": 0x20}

app = Flask(__name__)
cors = CORS(app)

import json
with open("skin_data.json", encoding="utf-8") as f:
    skin_data = json.load(f)

skins = skin_data["skins"]
no_wear_skins = skin_data["no_wear_skins"]

@app.route("/receiver", methods=["POST"])
def postME():
    print("Incoming request.")
    data = request.get_json()
    print("url:", data)
    # download_image(data)
    # if os.path.isfile("image.png"):
    #     res = rgs("image.png")
    # else:
    #     return jsonify("Image failed to donwload")
    # print("Final answer:", res)
    # if res:
    #     data = jsonify(res)
    # else:
    #     data = jsonify("None")
    # os.remove("image.png")
    name = findName(data)
    print("name is:", name)
    data = jsonify(name)
    return data

def download_image(url):
    r = requests.get(url, allow_redirects=True)
    open('image.png', 'wb').write(r.content)


def rgs(image_path):
    from GoogleSearch import Search
    output = Search(file_path=image_path)

    if output["output"]:
        output = output["output"].split("\xa0")
        return output[1] # skin name
    else:
        return False

from pynput.keyboard import Controller
kb = Controller()

def findName(url):
    url = formatUrl(url)
    for skin in skins:
        skin = skins[skin]
        if skin["image_url"] == url:
            name = skin["formatted_name"].split("|")[1].strip()
            # nameAsHex = [chardict[char.lower()] for char in name]
            # [PressKey(key) for key in nameAsHex]
            kb.type(name)
            time.sleep(0.2)
            PressKey(0x0D)
            time.sleep(1)
            # commandAsHex = [chardict[char.lower()] for char in "cs skin?"]
            # [PressKey(key) for key in commandAsHex]
            kb.type("cs skin?")
            time.sleep(0.2)
            PressKey(0x0D)
            time.sleep(2.5)
            PressKey(0x2E)
            time.sleep(0.2)
            return name
    return False

def formatUrl(url) -> str:
    return "https:/" + url.split("https")[2].split("width")[0][:-1]

if __name__ == "__main__":
    app.run()