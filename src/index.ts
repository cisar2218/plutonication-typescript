import { Socket } from "socket.io";
import { WebSocketServer } from "ws";
import { PlutoEventManager } from "./PlutoEventManager";

const manager = new PlutoEventManager();
manager.listenSafeAsync("samplePassword");