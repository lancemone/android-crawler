# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     tiktok
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/13
-------------------------------------------------
"""
__author__ = 'motao'

import json
import os
import sys

import frida
from typing import Dict, List

package_name = "com.ss.android.ugc.trill"
device_serial = "FA79Y1A01745"
agent_path = os.path.join(
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "js"),
    "agent.js")


class TiktokFeed(object):
    def __init__(self):
        self._sessions: Dict[str, frida.core.Session] = {}
        self.script = None
        self._devices: Dict[str, frida.core.Device] = {}
        self.spawned_pid = None
        self.resumed = False
        self._device_ids: list = []
        self._tiktok_swipe = []
        self.app = None

    @staticmethod
    def _get_device() -> frida.core.Device:
        if device_serial:
            device = frida.get_device(device_serial)
            print('Using USB device `{n}`'.format(n=device.name))
            return device

    @staticmethod
    def _get_devices_usb() -> Dict[str, frida.core.Device]:
        usb_devices = {}
        if frida.enumerate_devices():
            for device in frida.enumerate_devices():
                if device.type == "usb":
                    usb_devices[device.id] = device
        return usb_devices

    @staticmethod
    def on_message(message: dict, data):
        print(str(message))
        payload: str = ''
        try:
            if message and 'payload' in message:
                if len(message['payload']) > 0:
                    if isinstance(message['payload'], dict):
                        payload = json.dumps(message['payload'])
                    elif isinstance(message['payload'], str):
                        payload = message['payload']
                    else:
                        print(type(message['payload']))
                        payload = str(message['payload'])
        except Exception as e:
            raise e

    # def upload(self):
    #     headers = {}

    @staticmethod
    def on_detach(message: str, crash):
        """
            The callback to run for the detach signal

            :param message:
            :param crash:

            :return:
        """

        try:

            # process the response
            if message:
                print('(session detach message) ' + message)

            # Frida 12.3 crash reporting
            # https://www.nowsecure.com/blog/2019/02/07/frida-12-3-debuts-new-crash-reporting-feature/
            if crash:
                print('(process crash report)')
                print('\n\t{0}'.format(crash.report))

        except Exception as e:
            print('Failed to process an incoming message for a session detach signal: {0}'.format(e))
            raise e

    @property
    def get_devices_usb(self) -> Dict[str, frida.core.Device]:
        if not self._devices:
            self._devices = self._get_devices_usb()
        return self._devices

    @property
    def get_devices_ids(self) -> List[str]:
        if not self._device_ids:
            self._device_ids = self.get_devices_usb.keys()
        return self._device_ids

    @property
    def get_sessions(self) -> Dict[str, frida.core.Session]:
        """

        :rtype: object
        """
        if self._sessions:
            return self._sessions
        device_usb = self.get_devices_usb
        for did in device_usb.keys():
            session = self._get_session(device_usb.get(did))
            self._sessions[did] = session
        return self._sessions

    def _get_session(self, device: frida.core.Device) -> frida.core.Session:
        try:
            print('Attempting to attach to process: `{process}` on `{did}'.format(
                process=package_name, did=device.id))
            session = device.attach(package_name)
            self.resumed = True
            session.on('detached', self.on_detach)
            return session
        except frida.ProcessNotFoundError:
            print('Unable to find process: `{process}` on `{did}`, attempting spawn'.format(
                did=device.id, process=package_name))
        spawned_pid = device.spawn(package_name)
        print('Device `{did}` PID `{pid}` spawned, attaching...'.format(did=device.id, pid=self.spawned_pid))
        print('Resuming PID test `{pid}`'.format(pid=self.spawned_pid))
        device.resume(spawned_pid)
        session = device.attach(spawned_pid)
        return session

    @staticmethod
    def _get_agent_source() -> str:
        if not os.path.exists(agent_path):
            raise Exception('Unable to locate Objection agent sources at: {location}. '
                            'If this is a development install, check the wiki for more '
                            'information on building the agent.'.format(location=agent_path))
        print('Agent path is: {path}'.format(path=agent_path))
        with open(agent_path, 'r', encoding='utf-8') as f:
            agent = f.readlines()

        return ''.join([str(x) for x in agent])

    def inject(self):
        """
        Injects the Objection Agent.
        :return:
        """
        sessions = self.get_sessions
        for did in sessions.keys():
            print(f'`${did}` Injecting agent...')
            session = sessions.get(did)
            script = session.create_script(source=self._get_agent_source())
            script.on('message', self.on_message)
            script.load()
        sys.stdin.read()
        try:
            while not self.app.is_end():
                sys.stdin.read()
            self.stop()
        except Exception as e:
            raise e

    def stop(self):
        if self._sessions:
            for session in self._sessions.values():
                session.detach()
        if self._devices:
            for did in self._devices:
                device = self._devices.get(did)
                device.kill()

    def set_app(self, app):
        self.app = app


tiktok_feed = TiktokFeed()


if __name__ == "__main__":
    tiktok_feed.inject()
