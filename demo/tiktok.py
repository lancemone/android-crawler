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

package_name = "com.ss.android.ugc.trill"
device_serial = "FA79Y1A01745"
agent_path = os.path.join(
            os.path.join(os.path.dirname(os.path.dirname(__file__)), "js"),
            "agent.js")


class TiktokFeed(object):
    def __init__(self):
        self.session = None
        self.script = None
        self.device = None
        self.spawned_pid = None
        self.resumed = False

    @staticmethod
    def _get_device() -> frida.core.Device:
        if device_serial:
            device = frida.get_device(device_serial)
            print('Using USB device `{n}`'.format(n=device.name))
            return device

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

    def get_session(self) -> frida.core.Session:
        if self.session:
            return self.session

        self.device = self._get_device()
        try:
            print('Attempting to attach to process: `{process}`'.format(
                process=package_name))
            self.session = self.device.attach(package_name)
            self.resumed = True
            self.session.on('detached', self.on_detach)
            return self.session
        except frida.ProcessNotFoundError:
            print('Unable to find process: `{process}`, attempting spawn'.format(
                process=package_name))
        self.spawned_pid = self.device.spawn(package_name)
        print('PID `{pid}` spawned, attaching...'.format(pid=self.spawned_pid))
        print('Resuming PID test `{pid}`'.format(pid=self.spawned_pid))
        self.device.resume(self.spawned_pid)
        self.session = self.device.attach(self.spawned_pid)
        return self.session

    def _get_agent_source(self) -> str:
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
        print('Injecting agent...')
        session = self.get_session()
        self.script = session.create_script(source=self._get_agent_source())
        self.script.on('message', self.on_message)
        self.script.load()
        # if not self.exports().ping():
        #     print('Failed to ping the agent')
        #     raise Exception('Failed to communicate with agent')
        # print('Agent injected and responds ok!')
        # return self
        try:
            while True:
                if sys.stdin.read().strip() == "stop":
                    print("error")
                    self.script.unload()
                    session.detach()
                    break
        except Exception as e:
            print(str(e))
            self.script.unload()
            session.detach()


if __name__ == "__main__":
    t = TiktokFeed()
    t.inject()