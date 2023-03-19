# plutonication-typescript
Typescript version of C# .NET class library [Plutonication](https://github.com/cisar2218/Plutonication).
## Motivation
We have decided to implement JS version because we are planning to implement chrome extension that allow user to connect existing dApps with wallet with our connector Plutonication. In additional it's now possible to implement plutonication directly to existing *web3* dApps.

## Instalation
[Npm package](https://www.npmjs.com/package/plutonication-typescript) can be installed with command:

```
npm install plutonication-typescript
```

## Usage
To implement Plutonication to your dApp, you need to create instance of `PlutoEventManager`. Than setup events that you want to react to. Possible events you can find in enum PlutoEvent: `PlutoEvent.**EVENT_TO_HANDLE**` (e.g. PlutoEvent.MessageReceived). Than do `manager.listenSafeAsync("...YOUR_KEY_TO_CONNECT...");` to run the server. You can close the server with method `closeConnection()`.

Incoming message are added to queue. So by deque() that you can see in example bellow, you will pop the oldest message that has been received.
```ts
import { MessageCode } from "./MessageCode";
import { PlutoEventManager, PlutoEvent } from "./PlutoEventManager";

const manager = new PlutoEventManager();

manager.on(PlutoEvent.ConnectionEstablished, () => {
    console.log("Connection established.");
});

manager.on(PlutoEvent.MessageReceived, () => {
    const msg = manager.incomingMessages.dequeue();
    switch (msg?.identifier) {
        case MessageCode.PublicKey:
            console.log("publick key received:", msg?.customDataToString());
            break;
        default:
            console.log("Can't handle this message code: ", msg?.identifier);
            console.log("data as string:", msg?.customDataToString());
            console.log("data as bytes:", msg?.customData);
    }
});

manager.on(PlutoEvent.ConnectionClosed, () => {
    console.log("Connection established.");
});

manager.listenSafeAsync("samplePassword");
```

## Development notes
Polkadot JS Transaction object example:
```json
{
   "signature":{
      "signer":{
         "id":"5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM"
      },
      "signature":{
         "ed25519":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      },
      "era":{
         "immortalEra":"0x00"
      },
      "nonce":0,
      "tip":0
   },
   "method":{
      "callIndex":"0x0901",
      "args":{
         "event":"0x61686f6a",
         "result":0
      }
   }
```
- To clarify, callIndex is of type "Uint8Array" of length 2, args is also of type "Uint8Array"

What we want:
1) callIndex[0] => moduleIndex
2) callIndex[1] => callIndex
3) args => data


# Resources:

- https://polkadot.js.org/docs/api/start/api.tx
- https://github.com/polkadot-js/extension
