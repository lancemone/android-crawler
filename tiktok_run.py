# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     tiktok_run
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/12
-------------------------------------------------
"""
__author__ = 'motao'

import sys
import time

import frida

from state.connection import state_connection
from utils.agent import Agent

serial = ""


def tiktok_run():
    if serial:
        state_connection.device_serial = serial
    explore()
    sys.stdin.read()
    # while True:
    #     time.sleep(5)
        # print("invoke getVideoUrl")
        # print(state_connection.get_api().tiktok_feed_aweme())
        # print(state_connection.get_api().getVideoUrl)


def explore():
    agent = Agent()
    try:
        agent.inject()
    except (frida.ServerNotRunningError, frida.NotSupportedError, frida.ProtocolError) as e:
        print(str(e))
        return
    state_connection.set_agent(agent=agent)


if __name__ == "__main__":
    tiktok_run()


