import { isPromiseLike } from 'xstate/lib/utils';
import { Base64 } from 'js-base64';
const defaultServiceEnd = 'SERVICE_END';
const defaultEndEvent = 'ERROR';

export const isPromise = (p): p is Promise<any> => typeof p === 'object' && typeof p.then === 'function';

//() =>
// function alertService(_, receive) {
//   receive((event) => {
//     console.log('RECEEEEE', event);
//     if (event.type === 'ALERT') {
//       alert(event.message);
//     }
//   });
// }

export const encodePeerConnection = (descriptor: RTCSessionDescriptionInit) => {
  const encoded = Base64.encode(JSON.stringify({ description: Base64.encode(JSON.stringify(descriptor)) }));

  const decoded = JSON.parse(Base64.decode(JSON.parse(Base64.decode(encoded)).description));

  console.log('ENCODING', { descriptor, encoded, decoded });
  return encoded;
};

export const decodePeerConnection = (desc) => {
  return JSON.parse(Base64.decode(JSON.parse(Base64.decode(desc)).description));
};

// const receiveHandler =
//   ({ onReceive, originalContext, originalEvent }) =>
//   async (event) => {
//     console.log('RECEEEEE', event);
//     const {
//       isTrusted,
//       currentTarget,
//       data,
//       origin,
//       paths,
//       port,
//       timestamp,
//       type,
//       eventPhase,
//       lastEventId,
//       returnValue,
//     } = event.message;

//     const realMessage = {
//       isTrusted,
//       currentTarget,
//       data,
//       origin,
//       paths,
//       port,
//       timestamp,
//       type,
//       eventPhase,
//       lastEventId,
//       returnValue,
//     };
//     // if (event.type === 'ALERT') {
//     console.log(JSON.stringify(realMessage));
//     //}

//     onReceive(event, originalContext, originalEvent);
//   };

// const serviceHandler =
//   <ContextType>({
//     onReceive,
//     originalContext,
//     originalEvent,
//     run,
//   }: {
//     onReceive;
//     originalContext;
//     originalEvent;
//     run: RunHandler;
//   }) =>
//   (callback, receive) => {
//     console.log('TOP LEVEL', { callback, receive });

//     console.log('SETTING RECEIVE', receive);
//     receive(receiveHandler({ onReceive, originalContext, originalEvent }));

//     const emitter = (event) => {
//       console.log('EMIT TO PARENT', event);
//       callback(event);
//     };

//     return run<ContextType>({ onCallback: emitter, event: originalEvent, context: originalContext });
//   };

//type RunEvent = <ContextType>(runProps: { onCallback?: (ev: any) => void; event: any; context: ContextType }) => void;

// export const machineService2 = <ContextType>({
//   serviceName,
//   run,
//   onReceive,
//   onEnd,
//   endEvent,
//   errEvent,
// }: {
//   serviceName: string;
//   run: RunHandler;
//   onReceive: (event, invokingContext, invokingEvent) => any;
//   onEnd: (event: any) => void;
//   endEvent?: string;
//   errEvent?: string;
// }) => {
//   console.log(`🚜 ${serviceName} Initialized`);
//   return (originalContext, originalEvent) => {
//     console.log('CREATE SERVICE', { originalContext, originalEvent });

//     console.log('HANDLER', serviceHandler);

//     return serviceHandler<ContextType>({ onReceive, originalContext, originalEvent, run });
//   };
// };
// type RunHandler = <ContextType>({
//   onCallback,
//   event,
//   context,
// }: {
//   onCallback?: (ev: any) => void;
//   event: any;
//   context: ContextType;
// }) => any | void | Promise<any> | Promise<void>;

type ReceiveHandler = (event, invokingContext, invokingEvent) => void | Promise<any>;

export const machineService = <ContextType>({
  serviceName,
  run,
  onReceive,
  onEnd,
  endEvent,
  errEvent,
}: {
  serviceName: string;

  run: (onCallback: (ev: any) => void, event: any, context: ContextType) => any | void | Promise<any> | Promise<void>;

  onReceive: ReceiveHandler;
  onEnd: (event: any) => void;
  endEvent?: string;
  errEvent?: string;
}) => {
  console.log(`🚜 ${serviceName} Initialized`, { onReceive });
  return (invokingContext: ContextType, invokingEvent) => (callback: (ev: any) => void, receive) => {
    console.log(`⭐️ 🚜 ${serviceName}`, { callback, receive });
    // try {
    // let resolveEnd = null;
    const callbackMethod = (callbackEvent) => {
      const callbackEventType = typeof callbackEvent === 'string' ? callbackEvent : callbackEvent.type;
      console.log(`🗒 🚜 ${serviceName} >> ${callbackEventType}`, callbackEvent);
      if (callbackEventType === (endEvent || defaultServiceEnd)) {
        //console.log(`🏁 🚜 ${serviceName}`);
        onEnd(callbackEvent);
      }
      return callback(callbackEvent);
    };
    const result = run(callbackMethod, invokingEvent, invokingContext);

    console.log(`🎧 ${serviceName}`, { receive: receive });
    receive((event) => {
      console.log('RECEIEVERERR', event);
      const receiveRunner = (ev) => {
        console.log(`🗒 🚜 ${serviceName} << ${ev.type}`, ev);
        const waiting = onReceive(ev, invokingContext, invokingEvent);
        if (isPromiseLike(waiting)) {
          waiting.then((result) => {
            if (ev.type === (endEvent || defaultServiceEnd)) {
              console.log(`🏁 🚜 ${serviceName}`);
              onEnd(ev);
            }
          });
        } else {
          if (ev.type === (endEvent || defaultServiceEnd)) {
            console.log(`🏁 🚜 ${serviceName}`);
            onEnd(ev);
          }
        }
      };
      return receiveRunner(event);
    });

    // If async, acknowledge the finish of the async method as DONE
    if (isPromise(result)) {
      return result
        .then((val) => onEnd(val))
        .catch((err) => {
          //throwError(err);
          throw err;
        });
    }
    // } catch (err) {
    //   callback({ type: errEvent || defaultEndEvent, err });
    //   // Throw so the onError is caught
    //   throw err;
    // }
  };
};
