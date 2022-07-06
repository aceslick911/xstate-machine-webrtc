// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    alertICE: 'ICE_CANDIDATE';
    updateICECandidate: 'ICE_CANDIDATE';
    setPeerConnection: 'START_PEER_CONNECTION';
    setChannelInstance: 'SET_CHANNEL_INSTANCE';
    setLocalDescriptor: 'SET_LOCAL_DESCRIPTOR';
    setClientAnswer: 'CLIENT_ANSWER';
  };
  internalEvents: {
    'xstate.init': { type: 'xstate.init' };
    'done.invoke.host-rtc-connection': {
      type: 'done.invoke.host-rtc-connection';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.host-rtc-connection': { type: 'error.platform.host-rtc-connection'; data: unknown };
    'done.invoke.data-channel': {
      type: 'done.invoke.data-channel';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.data-channel': { type: 'error.platform.data-channel'; data: unknown };
    'done.invoke.create-offer': {
      type: 'done.invoke.create-offer';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.create-offer': { type: 'error.platform.create-offer'; data: unknown };
    'done.invoke.answer-check': {
      type: 'done.invoke.answer-check';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.answer-check': { type: 'error.platform.answer-check'; data: unknown };
    'done.invoke.messageHandler': {
      type: 'done.invoke.messageHandler';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.messageHandler': { type: 'error.platform.messageHandler'; data: unknown };
  };
  invokeSrcNameMap: {
    RTCPeerConnection: 'done.invoke.host-rtc-connection';
    dataChannel: 'done.invoke.data-channel';
    createOffer: 'done.invoke.create-offer';
    checkAnswer: 'done.invoke.answer-check';
    sendFile: 'done.invoke.ConnectionMachine.connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.sendingFile:invocation[0]';
    receiveFile: 'done.invoke.ConnectionMachine.connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.receivingFile:invocation[0]';
    messageHandler: 'done.invoke.messageHandler';
  };
  missingImplementations: {
    actions: never;
    services: 'sendFile' | 'receiveFile';
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    RTCPeerConnection: 'xstate.init';
    dataChannel: 'xstate.init';
    createOffer: 'xstate.init';
    checkAnswer: 'CLIENT_ANSWER';
    messageHandler: 'channelInstance.onOpen' | 'START_RECEIVE_FILE' | 'START_FILE_TRANSFER';
    sendFile: 'START_TRANSFER';
    receiveFile: 'TRANSFER_START';
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates:
    | 'idle'
    | 'connecting'
    | 'connecting.webRTC'
    | 'connecting.webRTC.peerConnection'
    | 'connecting.webRTC.peerConnection.creatingPeerConnection'
    | 'connecting.webRTC.peerConnection.services'
    | 'connecting.webRTC.peerConnection.services.channel'
    | 'connecting.webRTC.peerConnection.services.channel.created'
    | 'connecting.webRTC.peerConnection.services.channel.open'
    | 'connecting.webRTC.peerConnection.services.flows'
    | 'connecting.webRTC.peerConnection.services.flows.pick'
    | 'connecting.webRTC.peerConnection.services.flows.Host'
    | 'connecting.webRTC.peerConnection.services.flows.Host.creatingOffer'
    | 'connecting.webRTC.peerConnection.services.flows.Host.creatingOffer.running'
    | 'connecting.webRTC.peerConnection.services.flows.Host.creatingOffer.finished'
    | 'connecting.webRTC.peerConnection.services.flows.Host.waitingForAnswer'
    | 'connecting.webRTC.peerConnection.services.flows.Host.checkingAnswer'
    | 'connecting.webRTC.peerConnection.services.flows.Host.waitingForChannel'
    | 'connecting.webRTC.peerConnection.services.flows.Client'
    | 'connecting.webRTC.peerConnection.services.flows.Client.waitingForOffer'
    | 'connecting.webRTC.peerConnection.services.flows.Client.createdAnswer'
    | 'connecting.webRTC.peerConnection.services.flows.Client.waitingForChannel'
    | 'connecting.webRTC.peerConnection.services.flows.chatting'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.transferRequest'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.sendingFile'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.pickFileToSend'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.noTransfer'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.waitingToStart'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.waitingToAccept'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.fileTransfer.receivingFile'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.chat'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.chat.messaging'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.chat.receivedFileRequest'
    | 'connecting.webRTC.peerConnection.services.flows.chatting.chat.sending'
    | 'connecting.webRTC.peerConnection.services.flows.finishedChatting'
    | 'terminated'
    | 'failedToConnect'
    | {
        connecting?:
          | 'webRTC'
          | {
              webRTC?:
                | 'peerConnection'
                | {
                    peerConnection?:
                      | 'creatingPeerConnection'
                      | 'services'
                      | {
                          services?:
                            | 'channel'
                            | 'flows'
                            | {
                                channel?: 'created' | 'open';
                                flows?:
                                  | 'pick'
                                  | 'Host'
                                  | 'Client'
                                  | 'chatting'
                                  | 'finishedChatting'
                                  | {
                                      Host?:
                                        | 'creatingOffer'
                                        | 'waitingForAnswer'
                                        | 'checkingAnswer'
                                        | 'waitingForChannel'
                                        | { creatingOffer?: 'running' | 'finished' };
                                      Client?: 'waitingForOffer' | 'createdAnswer' | 'waitingForChannel';
                                      chatting?:
                                        | 'fileTransfer'
                                        | 'chat'
                                        | {
                                            fileTransfer?:
                                              | 'transferRequest'
                                              | 'sendingFile'
                                              | 'pickFileToSend'
                                              | 'noTransfer'
                                              | 'waitingToStart'
                                              | 'waitingToAccept'
                                              | 'receivingFile';
                                            chat?: 'messaging' | 'receivedFileRequest' | 'sending';
                                          };
                                    };
                              };
                        };
                  };
            };
      };
  tags: 'peerConnection' | 'hostOffer';
}
