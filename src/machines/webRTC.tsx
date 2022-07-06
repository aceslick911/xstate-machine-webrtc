import { assign, createMachine, Event, EventObject, send } from 'xstate';
import { forwardTo, log, sendParent } from 'xstate/lib/actions';
import { isPromiseLike } from 'xstate/lib/utils';
import {
  decodePeerConnection,
  encodePeerConnection,
  machineService,
  //  machineService2
} from '../helpers/machine';
import { context, Context, EventTypes, RTCMessage } from './webRTC.events';
import moment from 'moment';

type ValueOf<T> = T[keyof T];

// function alertService(_, receive) {
//   receive((event) => {
//     console.log('RECEEEEE', event);
//     if (event.type === 'ALERT') {
//       alert(event.message);
//     }
//   });
// }

export const ConnectionMachine =
  /** @xstate-layout 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-TuVXoHQ5-lTnGGcOoPzOAsASBQE4p1cYuIuA9G-USRdPQD4AEUACqwl+D+YAzgzcaxNh7jUpoK5S5G0ihympfKiN1L3yUEpmzKmbW8uy-a3LuZ8uFdgMV0rNQmCNZa3XcrlXqvztq7+kArcAudcFN11wdJ9pGElnq3anhJvRaDFlO5+T9bnvS5etD6naaLeHU5grRWSucRdoaN2aCMERGBzALZ39soXGvuoNJuNosNtSdfRQisriCg2HObwtDrOcq+zRtTxYMNaby1U-T+GgIQC9WAXxSqP1dF6AfUk4wABqVW9tknaySnBj9eRuCS8YEUTLZD6KuGuNk05dAOA-sl97M9kMk7s-Nv76bGPJHyzMzin6ei84Oz+6S-P27n2i+cHKMYtjXzjk9vVvpa1aGTI-Mb03ie9oyz98n9GHXOZYDxNoVWRjcD4JMdgcONjwyUtFi49JTlXBOateG8tdx0g5GGQnCa0te++7R37FsXrtJiO7FEFGc8zbV3N1NC3LY+unPDNJVyFBFQrbq8OCecpXGFEFkwMYlfmo+6rvPpP7ol4BkDGI5B+w2BndgCGt4fWa0UNF1ahksqXPR-FNaOlXA3EjUy-kHue3PO9wXloQLCiczM2CgW1AZ+2jn7gBfMKSWnY696TW45W3JjSfODcHuZcYMVYbGPkf0FYXQWMAIFLYfXPM-GqJgcYUkYYHEAScYASToXgPnP9Ylc3I4GwXwBkTwQwQUXwecVGFQCwBYbQb+JwXGGJBTHua+QIQ8V1CAOASQKFCqOgEtXAsteaGwNJRKDcBwBXETfuSLAg-QVYHHB+LwVCdSE-PpUfdXM2Y0ZEJIeoC-d-f9AXWwXGJKVwA5WkQwIORCBWSCKcG4TQZkBwdQN7IfFXeAxhc-MnBqBbMHS0LeCAH1UUQxBWQhacEUaORCTwXkA5VHdcBMCg5Qp5Vw-Pdwh6O1LwxEVAb2M3GGbQLKPaEUDkK5NSekLaRAX0OWK4HaPKBOBwOIq1WxFNa9Tw5BOHGCRkHuFkFKdkYo44Z7CIkDUQhWcomo2zGvBozXemOsZmLZNkBkDWfYbGHwVQAMRCVGbuXQeWf1QURDWA5wqvVQkYrLMY5qN6DQ+iGoSuVjdidAJILZMMccZaCgrcP-bfRYWkHSK5K4DwaNfGTWIY2beFWvQ41yVqE4zyKKUVHhK42AcgFRTI+aFKQxa4aLGNdwfQCTF4hkXSH0ExEULwONZXP+EfBAsfDXIvI44EsKBiMEm4-QN464PZNwJ45cK5N47QPkeCJlZHX46vf40Y0koE2iUuO2HqHeQoLZNSGYwhWcHwc4AwKQuQJSZQdWNdYwOOXQLkvYnkg4vkq2RmaE5mL6YWUU2E32MlRU9YPYfKLQHRYA4UZQAfKU7GZYO+dUoktQ3kzTfk6BMuOBJo408+NSeGdwSA9RSNa+dGDkJwb-VQdfPYAwF0hI4kgE7UhmAcP0mg+kM09QC0vkXYSDRtFk3QZMRWWwrPeM2FRI+zQEvUSBTeQU2BHqc4uHMxO09wVaQwe4tEvSXkV7FYecFfMlMs61TUujOvNeAuKBHwkUps146LLYDYdwBOYwTKPwNWbcVvRvWkQcuozLEcqsvOcc2smBLqHqeBBEJsxWHSaLU4JtdSekYAzWCcO3O+cLeJLcvtHQ5I0c5qGs1M-gs7GkXSS8zfbcLYW8rozHbswwGJdQZJU6bYgklw8sxM90xzAHUdbNUVLxEVJnWRVdC7XsncbGHRdwDvMNLuOCWLIwMxWMN8twys5MtCnDR9PXIjFVSCdRa4RcBTacPM1JHHaWY1ZYDkLKWiiskkj0-3J1MdCY+sBnSdQtXwtMkou4vwHEtkQyGUro9+CcAwVE05QwIMUS5CrUiSpbHTMdXNDCrZbcBka5WcfGAMIyBCRtciyNCQ6is1bgz3V0-Y3chirDCiJivTOsmoeS6dX8k7PQ83UcHwXkf0XGUbLwHuOUi+NJRwIwUUJMbcIsuC-EyxXYny4cwvUyxi1zFiEKqAF9N9MAYJVdKWR0kwXcWMOWQbVJRWBkZkDfEwZkfKNwIyt0ky1CgK9C3DAzDzYzYCJSv2BQNcZq+WOOV7JlE5fixquJIS8Lfq3y4qoa7XQKsqo0v8z-BAFYbvWgpqgMKApk2KltWMFKUUE9Taoq33L8hjZzQHVbdba4qaplBkDGNtBMZYNkfRZkGXGCJSE9bwR6+owanLAHfLdzOnBnHC5VKawNBkAfS4OkXKa4fRLYKCAbIo1GLQTyonU-BMgavykqgK3XTFL6w6-Qi+Scccb+HcPcdcOJfaPVEG67DwVGbcbwewKGnc7a2G6mqpKYxcXkb+f6ta++FKkOfG0C-QOOELIWn3Dwvc4dH1GY7QRqlUi68A5ccTfGzPXKUwNWj88pXOCE-AKEyAeBZzKPC84yXE4MScVwZ4zwfGPaOMOJe+ewbdC2pIq2l6ATU6vW5YA2rwMIww84RYmI-SYwIO+i3ULZIQqMewZkOJJSPKUgnaRCRq3osMETDkDPbPVLAq8mragDD-BmpCWywyGTOOB+Cgqg8OQglc84S4QIuLOcR6tOgwIwpu0w1uxCRJKCHwD2+kf0PcLctO--Iekwlu8w9ujSiegy+XAwQwOIlECFKgU0RS+m6Kr-b23q+kBc05FKkNP0HvIMZabwLYvKjlGgcsdqRgCASdDUZfScZQXwNkmwwUOcZ+NwAOeXTQLKTKmAp+7tSao+mGIQmaws4e5e1GRCChNcSo7VPIuOVg-wIAA */
  createMachine({
    context: context,
    tsTypes: {} as import('./webRTC.typegen').Typegen0,
    schema: {
      context: context as Context,
      events: {} as EventTypes,

      services: {} as {
        myService: {
          // The data that gets returned from the service
          data: { id: string };
        };
      },
    },
    id: 'ConnectionMachine',
    initial: 'idle',
    states: {
      idle: {
        on: {
          CONNECT: {
            target: 'connecting',
          },
        },
      },
      connecting: {
        initial: 'webRTC',
        states: {
          webRTC: {
            initial: 'peerConnection',
            states: {
              peerConnection: {
                invoke: {
                  src: 'RTCPeerConnection',
                  id: 'host-rtc-connection',
                  onDone: [
                    {
                      target: '#ConnectionMachine.terminated',
                    },
                  ],
                  onError: [
                    {
                      target: '#ConnectionMachine.failedToConnect',
                    },
                  ],
                },
                tags: 'peerConnection',
                initial: 'creatingPeerConnection',
                states: {
                  creatingPeerConnection: {
                    on: {
                      START_PEER_CONNECTION: {
                        actions: 'setPeerConnection',
                        target: 'services',
                      },
                    },
                  },
                  services: {
                    type: 'parallel',
                    states: {
                      channel: {
                        invoke: {
                          src: 'dataChannel',
                          id: 'data-channel',
                        },
                        initial: 'created',
                        states: {
                          created: {
                            on: {
                              SET_CHANNEL_INSTANCE: {
                                actions: 'setChannelInstance',
                              },
                              'channelInstance.onOpen': {
                                target: 'open',
                              },
                            },
                          },
                          open: {},
                        },
                      },
                      flows: {
                        initial: 'pick',
                        states: {
                          pick: {
                            on: {
                              setupChannelAsAHost: {
                                target: 'Host',
                              },
                              setupChannelAsASlave: {
                                target: 'Client',
                              },
                            },
                          },
                          Host: {
                            initial: 'creatingOffer',
                            states: {
                              creatingOffer: {
                                invoke: {
                                  src: 'createOffer',
                                  id: 'create-offer',
                                  onDone: [
                                    {
                                      target: 'waitingForAnswer',
                                    },
                                  ],
                                },
                                initial: 'running',
                                states: {
                                  running: {
                                    on: {
                                      SET_LOCAL_DESCRIPTOR: {
                                        actions: 'setLocalDescriptor',
                                        target: 'finished',
                                      },
                                    },
                                  },
                                  finished: {
                                    type: 'final',
                                  },
                                },
                              },
                              waitingForAnswer: {
                                tags: 'hostOffer',
                                on: {
                                  CLIENT_ANSWER: {
                                    actions: 'setClientAnswer',
                                    target: 'checkingAnswer',
                                  },
                                },
                              },
                              checkingAnswer: {
                                invoke: {
                                  src: 'checkAnswer',
                                  id: 'answer-check',
                                  onDone: [
                                    {
                                      target: 'waitingForChannel',
                                    },
                                  ],
                                  onError: [
                                    {
                                      target: 'waitingForAnswer',
                                    },
                                  ],
                                },
                              },
                              waitingForChannel: {
                                on: {
                                  'channelInstance.onOpen': {
                                    target:
                                      '#ConnectionMachine.connecting.webRTC.peerConnection.services.flows.chatting',
                                  },
                                },
                              },
                            },
                          },
                          Client: {
                            states: {
                              waitingForOffer: {
                                on: {
                                  HOST_OFFER: {
                                    target: 'createdAnswer',
                                  },
                                },
                              },
                              createdAnswer: {
                                on: {
                                  ANSWERED_HOST: {
                                    target: 'waitingForChannel',
                                  },
                                },
                              },
                              waitingForChannel: {
                                on: {
                                  'channelInstance.onOpen': {
                                    target:
                                      '#ConnectionMachine.connecting.webRTC.peerConnection.services.flows.chatting',
                                  },
                                },
                              },
                            },
                          },
                          chatting: {
                            type: 'parallel',
                            states: {
                              fileTransfer: {
                                initial: 'noTransfer',
                                states: {
                                  transferRequest: {
                                    on: {
                                      rejected: {
                                        target: 'noTransfer',
                                      },
                                      acceptTransfer: {
                                        target: 'waitingToStart',
                                      },
                                    },
                                  },
                                  sendingFile: {
                                    invoke: {
                                      src: 'sendFile',
                                      onDone: [
                                        {
                                          target: 'noTransfer',
                                        },
                                      ],
                                      onError: [
                                        {
                                          target: 'noTransfer',
                                        },
                                      ],
                                    },
                                  },
                                  pickFileToSend: {
                                    on: {
                                      sendTransferRequest: {
                                        target: 'waitingToAccept',
                                      },
                                    },
                                  },
                                  noTransfer: {
                                    on: {
                                      sendFile: {
                                        target: 'pickFileToSend',
                                      },
                                      peerSendingFile: {
                                        target: 'transferRequest',
                                      },
                                    },
                                  },
                                  waitingToStart: {
                                    on: {
                                      TRANSFER_START: {
                                        target: 'receivingFile',
                                      },
                                    },
                                  },
                                  waitingToAccept: {
                                    on: {
                                      START_TRANSFER: {
                                        target: 'sendingFile',
                                      },
                                    },
                                  },
                                  receivingFile: {
                                    invoke: {
                                      src: 'receiveFile',
                                      onDone: [
                                        {
                                          target: 'noTransfer',
                                        },
                                      ],
                                      onError: [
                                        {
                                          target: 'noTransfer',
                                        },
                                      ],
                                    },
                                  },
                                },
                              },
                              chat: {
                                initial: 'messaging',
                                states: {
                                  messaging: {
                                    entry: (c, e) => console.log('ENTRY', { c, e }),
                                    exit: (c, e) => console.log('EXITED!!!!', { c, e }),
                                    invoke: {
                                      src: 'messageHandler',
                                      id: 'messageHandler',
                                    },
                                    on: {
                                      FILE_TRANSFER_REQUEST: {
                                        target: 'receivedFileRequest',
                                      },
                                      REQUEST_FILE_TRANSFER: {
                                        target: 'sending',
                                      },
                                      'channelInstance.onMessage': {
                                        actions: forwardTo('messageHandler'),
                                      },
                                    },
                                  },
                                  receivedFileRequest: {
                                    on: {
                                      START_RECEIVE_FILE: {
                                        target: 'messaging',
                                      },
                                    },
                                  },
                                  sending: {
                                    on: {
                                      START_FILE_TRANSFER: {
                                        target: 'messaging',
                                      },
                                    },
                                  },
                                },
                              },
                            },
                            on: {
                              CLOSE_CONNECTION: {
                                target: 'finishedChatting',
                              },
                            },
                          },
                          finishedChatting: {
                            type: 'final',
                          },
                        },
                        onDone: {
                          target: '#ConnectionMachine.terminated',
                        },
                      },
                    },
                  },
                },
              },
            },
            on: {
              ICE_CANDIDATE: {
                actions: ['alertICE', 'updateICECandidate'],
              },
            },
          },
        },
      },
      terminated: {
        type: 'final',
      },
      failedToConnect: {
        type: 'final',
      },
    },
  });
