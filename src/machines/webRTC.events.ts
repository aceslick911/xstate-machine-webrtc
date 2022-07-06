import { assign } from 'xstate';
import { decodePeerConnection, encodePeerConnection, machineService } from '../helpers/machine';
import { ConnectionMachine } from './webRTC';
import { Typegen0 } from './webRTC.typegen';

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

export const WebRTCMachine = ConnectionMachine.withConfig({
  guards: {
    hasValidAnswer: (c, e) => c.remoteAnswer != null,
  },
  actions: {
    // sendToMessageHandler: (c, e) => {
    //   console.log('FORWARDING TO messageHandler', e);
    //   return send(e, { to: 'messageHandler' });
    // },
    // onMessage: (c, e) => {
    //   const event = e as channelInstanceonMessage;
    //   console.log('onMessage', e);
    // },
    alertICE: (c, e) => {
      console.log(`❄️ ${e.type}`, e);
    },
    setPeerConnection: assign({
      peerConnection: (c, e) => e.peerConnection,
    }),
    setLocalDescriptor: assign({
      localDescriptor: (c, e) => {
        c.peerConnection.setLocalDescription(e.descriptor);
        return e.descriptor;
      },
      localDescriptionString: (c, e) => encodePeerConnection(e.descriptor),
    }),
    setChannelInstance: assign({
      channelInstance: (c, e) => e.channelInstance,
    }),
    setClientAnswer: assign({
      remoteAnswer: (c, e) => e.answer,
    }),
    updateICECandidate: assign({
      peerConnection: (c, e) => {
        const event = e;
        if (event.candidate === null && c.peerConnection.localDescription) {
          c.peerConnection.localDescription.sdp.replace('b=AS:30', 'b=AS:1638400');
        }
        return c.peerConnection;
      },
      ICECandidates: (c, e) => {
        return [...c.ICECandidates, e.candidate];
      },
    }),
  },
  services: {
    sendFile: machineService<Context>({
      serviceName: 'sendFile',
      run: (onCallback, event, context) => {
        console.log('HANDLING sendFile');
      },
      onReceive: (event, invokingContext, invokingEvent) => {
        console.log('RECEIVED sendFile:', event);
        // return false;
      },
      endEvent: 'END_MESSAGING',
      onEnd: () => {},
    }),
    receiveFile: machineService<Context>({
      serviceName: 'receiveFile',
      run: (onCallback, event, context) => {
        console.log('HANDLING receiveFile');
      },
      onReceive: (event, invokingContext, invokingEvent) => {
        console.log('RECEIVED receiveFile:', event);
        // return false;
      },
      endEvent: 'END_MESSAGING',
      onEnd: () => {},
    }),
    messageHandler: machineService<Context>({
      serviceName: 'messageHandler',
      run: (onCallback, event, context) => {
        console.log('HANDLING MESSAGING');
      },
      onReceive: (event, invokingContext, invokingEvent) => {
        console.log('RECEIVED MESSAGE:', event);
        // return false;
      },
      endEvent: 'END_MESSAGING',
      onEnd: () => {},
    }),
    // messageHandler: machineService2<Context>({
    //   serviceName: 'messageHandler',
    //   run: ({ onCallback, event, context }) => {
    //     console.log('xxHANDLING MESSAGING', { onCallback, event, context });
    //   },
    //   onReceive: (event, invokingContext, invokingEvent) => {
    //     console.log('RECEIVED MESSAGE:', event);
    //     return false;
    //   },
    //   // endEvent: 'END_MESSAGING',
    //   // onEnd: () => {},
    // }),
    // messageHandler: () => (_, receive) => {
    //   receive((event: any) => {
    //     console.log('RECEEEEE', event);
    //     if (event.type === 'ALERT') {
    //       alert(event.message);
    //     }
    //   });
    // },
    checkAnswer: machineService<Context>({
      serviceName: 'checkClientAnswer',
      run: async (onCallback, event, context) => {
        //console.log('DECODING CLIENT ANSWER', { answer: context.remoteAnswer });
        // const desc = Base64.decode((context.remoteAnswer as any).description);
        const decoded = decodePeerConnection(context.remoteAnswer);
        //console.log('VALS', { decoded });
        await context.peerConnection.setRemoteDescription(decoded);
        onCallback('ANSWER_SUCCESS');
      },
      endEvent: 'ANSWER_SUCCESS',
      onEnd: () => {},
      onReceive: () => {},
    }),
    RTCPeerConnection: machineService<Context>({
      serviceName: 'RTCPeerConnection',
      run: (onCallback, event, context) => {
        const peerConnection = new RTCPeerConnection({
          iceServers: context.ICEServers,
        });

        peerConnection.onicecandidate = (e) => {
          //console.log('>>onicecandidate', { e });
          //console.log('ICE', e, e?.candidate?.address);
          onCallback({
            type: 'ICE_CANDIDATE',
            address: e?.candidate,
            candidate: e?.candidate,
          });
        };
        onCallback({ type: 'START_PEER_CONNECTION', peerConnection });
      },
      onEnd: (event) => {},
      onReceive: (event) => {},
    }),
    createOffer: machineService<Context>({
      serviceName: 'createOffer',
      run: async (onCallback, event, context) => {
        if (context.peerConnection) {
          const description = await context.peerConnection.createOffer();
          //console.log('ORIGINAL offer', description);

          onCallback({ type: 'SET_LOCAL_DESCRIPTOR', descriptor: description } as EventTypes);
          return;
        }
      },
      endEvent: 'SET_LOCAL_DESCRIPTOR',
      onEnd: (event) => {},
      onReceive: (event) => {},
    }),

    dataChannel: machineService<Context>({
      serviceName: 'dataChannel',
      run: (onCallback, event, context) => {
        const channelInstance = context.peerConnection.createDataChannel(context.channelLabel);

        onCallback({ type: 'SET_CHANNEL_INSTANCE', channelInstance });

        channelInstance.onopen = ((_this: RTCDataChannel, ev) => {
          return onCallback({ type: 'channelInstance.onOpen', this: _this, ev: ev });
        }) as any;

        channelInstance.onmessage = ((ev: MessageEvent<RTCMessage>) => {
          console.log('msg EV', ev);

          const realMessage = {
            isTrusted: ev.isTrusted,
            currentTarget: ev.currentTarget,
            data: ev.data,
            origin: ev.origin,

            ports: ev.ports || null,
            timeStamp: ev.timeStamp,
            // date: new Date
            type: ev.type,
            eventPhase: ev.eventPhase,
            lastEventId: ev.lastEventId,
          };
          return onCallback({ type: 'channelInstance.onMessage', message: realMessage });
        }) as any;
      },
      onEnd: (event) => {},
      onReceive: (event) => {},
    }),
  },
});
