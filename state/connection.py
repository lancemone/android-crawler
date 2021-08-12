# -*- coding: utf-8 -*-
"""
-------------------------------------------------
   File Name：     connection
   Description :
   Author :       motao
   Mail :         tao.mo@transsnet.com
   date：          2021/8/11
-------------------------------------------------
"""
__author__ = 'motao'


class StateConnection(object):
    """ A class controlling the connection state of a device. """
    TYPE_USB = 0
    TYPE_REMOTE = 1

    def __init__(self) -> None:
        """
            Init a new connection state, defaulting to a USB connection.
        """
        self.usb = True
        self.network = False
        self.host = '127.0.0.1'
        self.port = 27042
        self._type = self.TYPE_USB
        self.device_serial = None

        self.gadget_name = 'com.ss.android.ugc.trill'
        self.agent = None
        self.api = None

    def use_usb(self) -> None:
        self.network = False
        self.usb = True
        self._type = self.TYPE_USB

    def get_comms_type(self) -> int:
        return self._type

    def get_api(self):
        """
            Return a Frida RPC API session

            :return:
        """

        if not self.agent:
            raise Exception('No session available to get API')

        return self.agent.exports()

    def set_agent(self, agent):
        self.agent = agent

    def get_agent(self):
        if not self.agent:
            raise Exception('No Agent available')

        return self.agent

    def __repr__(self) -> str:
        return '<State Usb:{0}, Network:{1}, Host:{2}, Port:{3}'.format(self.usb, self.network, self.host, self.port)


state_connection = StateConnection()
