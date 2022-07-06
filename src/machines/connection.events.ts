import { assign } from 'xstate';
import { Typegen0 } from './connection.typegen';

export type EventTypes =
  | {
      type: 'CONNECT';
    }
  | {
      type: 'setupChannelAsAHost';
    }
  | { type: 'HOST_OFFER' }
  | { type: 'ANSWERED_HOST' }
  | { type: 'rejected' }
  | { type: 'acceptTransfer' }
  | { type: 'sendTransferRequest' }
  | { type: 'sendFile' }
  | { type: 'TRANSFER_START' }
  | { type: 'START_TRANSFER' }
  | { type: 'setupChannelAsASlave' }
  | { type: 'FILE_TRANSFER_REQUEST' }
  | { type: 'START_RECEIVE_FILE' }
  | { type: 'START_FILE_TRANSFER' }
  | { type: 'CLOSE_CONNECTION' }
  | { type: 'peerSendingFile' }
  | { type: 'REQUEST_FILE_TRANSFER' }
  | {
      type: 'SET_LOCAL_DESCRIPTOR';
      descriptor: RTCSessionDescriptionInit;
    }
  | {
      type: 'START_PEER_CONNECTION';
      peerConnection: RTCPeerConnection;
    }
  | {
      type: 'channelInstance.onMessage';
      message: RTCMessage | null;
    }
  | {
      type: 'ICE_CANDIDATE';
      candidate: RTCIceCandidate | null;
    }
  | {
      type: 'CLIENT_ANSWER';
      answer: string;
    }
  | { type: 'SET_CHANNEL_INSTANCE'; channelInstance: RTCDataChannel }
  | {
      type: 'channelInstance.onOpen';
      this: RTCDataChannel;
      ev: any;
    };

export const context = {
  ICEServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ] as RTCIceServer[],
  channelLabel: 'P2P_CHAT_CHANNEL_LABEL',
  peerConnection: null as RTCPeerConnection,
  channelInstance: null as RTCDataChannel,

  localDescriptor: null as RTCSessionDescriptionInit,
  // localDescriptorConfigured: null as RTCSessionDescriptionInit,
  remoteDescriptor: null as RTCSessionDescriptionInit,

  localDescriptionString: null as string,
  // localDescriptorConfiguredString: null as string,
  remoteDescriptionString: null as string,

  remoteAnswer: null as string,

  ICECandidates: [] as RTCIceCandidate[],

  messages: [] as RTCMessage[],
};

export type Context = typeof context;

type keyz = keyof Typegen0['invokeSrcNameMap'];
type Services = { [key in keyz]: any };
export const services: Services = {
  messageHandler: {},
  checkAnswer: {},
  createOffer: {},
  dataChannel: {},
  receiveFile: {},
  RTCPeerConnection: {},
  sendFile: {},
};

export interface RTCMessage {
  isTrusted: boolean;
  currentTarget: RTCDataChannel;
  data: string;
  origin: string;
  // path: any[];
  ports: any[];
  returnValue: boolean;
  source: any;
  srcElement: RTCDataChannel;
  target: RTCDataChannel;
  timeStamp: Date;
  type: string;
  userActivation: any;
}
