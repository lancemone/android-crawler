# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     agent
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/11
-------------------------------------------------
"""
__author__ = 'motao'

import json
import os

import frida
from frida.core import ScriptExports
from state.connection import state_connection


class Agent(object):
    """ Class to manage the lifecycle of the Frida agent. """

    def __init__(self):
        self.agent_path = os.path.join(
            os.path.join(os.path.dirname(os.path.dirname(__file__)), "js"),
            "tiktok-hook.js")
        print('Agent path is: {path}'.format(path=self.agent_path))
        self.session = None
        self.script = None
        self.device = None
        self.spawned_pid = None
        self.resumed = False

    @staticmethod
    def on_message(message: dict, data):
        payload: str = ''
        try:
            if message and 'payload' in message:
                if len(message['payload']) > 0:
                    if isinstance(message['payload'], dict):
                        payload = json.dumps(message['payload'])
                    elif isinstance(message['payload'], str):
                        payload = message['payload']
                    else:
                        payload = str(message['payload'])
            print(payload)
        except Exception as e:
            raise e

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

    @staticmethod
    def _get_device() -> frida.core.Device:
        if state_connection.get_comms_type() == state_connection.TYPE_USB:

            if state_connection.device_serial:
                device = frida.get_device(state_connection.device_serial)
                print('Using USB device `{n}`'.format(n=device.name))

                return device

            else:
                device = frida.get_usb_device(5)
                print('Using USB device `{n}`'.format(n=device.name))

                return device

        if state_connection.get_comms_type() == state_connection.TYPE_REMOTE:
            device = frida.get_device_manager().add_remote_device('{host}:{port}'.format(
                host=state_connection.host, port=state_connection.port))
            print('Using networked device @`{n}`'.format(n=device.name))

            return device

        raise Exception('Failed to find a device to attach to!')

    def get_session(self) -> frida.core.Session:
        if self.session:
            return self.session

        self.device = self._get_device()
        try:
            print('Attempting to attach to process: `{process}`'.format(
                process=state_connection.gadget_name))
            self.session = self.device.attach(state_connection.gadget_name)
            self.resumed = True
            self.session.on('detached', self.on_detach)
            return self.session
        except frida.ProcessNotFoundError:
            print('Unable to find process: `{process}`, attempting spawn'.format(
                process=state_connection.gadget_name))
        self.spawned_pid = self.device.spawn(state_connection.gadget_name)
        print('PID `{pid}` spawned, attaching...'.format(pid=self.spawned_pid))
        print('Resuming PID test `{pid}`'.format(pid=self.spawned_pid))
        self.device.resume(self.spawned_pid)
        self.session = self.device.attach(self.spawned_pid)
        return self.session

    def _get_agent_source(self) -> str:
        if not os.path.exists(self.agent_path):
            raise Exception('Unable to locate Objection agent sources at: {location}. '
                            'If this is a development install, check the wiki for more '
                            'information on building the agent.'.format(location=self.agent_path))

        with open(self.agent_path, 'r', encoding='utf-8') as f:
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
        return self

    def exports(self) -> frida.core.ScriptExports:
        """
            Get the exports of the agent.

            :return:
        """

        return self.script.exports

    def background(self, source: str):
        """
            Executes an artibrary Frida script in the background, using the
            default on_message handler for incoming messages from the script.

            :param source:
            :return:
        """

        print('Loading a background script')

        session = self.get_session()
        script = session.create_script(source=source)
        script.on('message', self.on_message)
        script.load()

        if not self.resumed:
            print('Resuming PID `{pid}`'.format(pid=self.spawned_pid))
            self.device.resume(self.spawned_pid)

        print('Background script loaded')

    def unload(self) -> None:
        """
            Run cleanup routines on an agent.

            :return:
        """

        if self.script:
            print('Calling unload()')
            self.script.unload()