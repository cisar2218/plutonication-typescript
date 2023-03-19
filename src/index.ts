import { ApiPromise, WsProvider } from "@polkadot/api";
import { Socket } from "socket.io";
import { WebSocketServer } from "ws";
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


const runPolkadot = async () => {
    // Construct
    const wsProvider = new WsProvider('wss://rpc.polkadot.io');
    const api = await ApiPromise.create({ provider: wsProvider });

    const ADDR = '5DoorUT3UK39bGByh74ZcjtyLfYPHVyxiTpyXvZxZgbzCbE7';

    const info = api.tx.balances.transfer(ADDR, 5000000)

    console.log(typeof info)
}


runPolkadot();

//manager.sendMethod()

