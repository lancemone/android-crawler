# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     test.py
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/12
-------------------------------------------------
"""
__author__ = 'motao'

import time

import frida
import os

package_name = "com.ss.android.ugc.trill"
device_serial = "FA79Y1A01745"
js_path = os.path.join(os.path.join(os.path.dirname(__file__), "js"), "tiktok-hook.js")


def run():
    device = frida.get_usb_device()
    # pid = device.spawn([package_name])
    # device.resume(pid)
    session = device.attach("4354")
    script_txt = get_script()
    print(script_txt)
    script = session.create_script(script_txt)
    script.on('message', printMessage)
    script.load()
    while True:
        time.sleep(5)
        # print(script.exports.tiktok_aweme())
        print(script.ex)


def get_script() -> str:
    with open(js_path, 'r', encoding='utf-8') as f:
        script = f.readlines()
    return "".join([str(x) for x in script])


def printMessage(message, data):
    if message['type'] == 'send':
        print('[*] {0}'.format(message['payload']))
    else:
        print(message)


if __name__ == "__main__":
    print(js_path)
    run()
