"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/Method.ts
var Method = class {
  constructor(callIndex, palletIndex, data) {
    if (callIndex < 0 || callIndex > 255) {
      throw Error("CallIndex value must be in range 0-255.");
    } else if (palletIndex < 0 || palletIndex > 255) {
      throw Error("PalletIndex value must be in range 0-255.");
    }
    this.moduleIndex = callIndex;
    this.callIndex = palletIndex;
    this.parameters = data;
  }
  toByteArray() {
    const result = new Uint8Array(2 + this.parameters.length);
    result[0] = this.moduleIndex;
    result[1] = this.callIndex;
    result.set(this.parameters, 2);
    return result;
  }
};

// src/PlutoMessage.ts
var PlutoMessage = class {
  constructor(id, customData) {
    this.identifier = id;
    if (typeof customData === "string") {
      this.customData = new TextEncoder().encode(customData);
    } else if (customData) {
      this.customData = customData;
    }
  }
  customDataToString() {
    return new TextDecoder("ascii").decode(this.customData);
  }
  toByteArray() {
    if (this.customData) {
      const merged = new Uint8Array(this.customData.length + 1);
      merged[0] = this.identifier;
      merged.set(this.customData, 1);
      return merged;
    }
    const idAsByteArray = new Uint8Array(2);
    idAsByteArray[0] = this.identifier;
    return idAsByteArray;
  }
  getMethod() {
    if (this.identifier !== 3 /* Method */ || this.customData === void 0) {
      throw new Error(`Can't convert cause '${this.identifier}' code is not suited for ${3 /* Method */}.`);
    }
    let data = new Uint8Array(0);
    if (this.customData.length > 2) {
      data = this.customData.slice(2);
    }
    return new Method(this.customData[0], this.customData[1], data);
  }
  static fromBuffer(data) {
    return new PlutoMessage(data[0], data.slice(1));
  }
};

// src/PlutoEventManager.ts
var net = __toESM(require("net"));

// src/Queue.ts
var Queue = class {
  constructor() {
    this.items = [];
  }
  enqueue(item) {
    this.items.push(item);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
  count() {
    return this.items.length;
  }
  peek() {
    return this.items[0];
  }
};

// src/PlutoEventManager.ts
var import_events = require("events");
var PlutoEventManager = class extends import_events.EventEmitter {
  constructor() {
    super(...arguments);
    this.clientIsAuthorized = false;
    this.incomingMessages = new Queue();
    this.MESSAGE_QUEUE_CAPACITY = 20;
  }
  triggerEvent(event) {
    this.emit(event);
  }
  sendMessageWithCode(code) {
    this.sendMessage(new PlutoMessage(code));
  }
  sendMessageWithCodeAsync(code) {
    throw new Error("Method not implemented.");
  }
  sendMessage(message) {
    const msg = message.toByteArray();
    if (this.socket)
      this.socket.write(msg);
    else
      throw new Error("Socket is not defined");
  }
  async connectSafeAsync(c, timeoutMiliseconds = 6e4) {
    throw new Error("Not yet implemented.");
  }
  authorizeClientAttempt(authMessage, key) {
    this.clientIsAuthorized = authMessage.identifier == 4 /* Auth */ && authMessage.customDataToString() === key;
    console.log("Client Authorized:", this.clientIsAuthorized);
    if (this.clientIsAuthorized) {
      this.sendMessage(new PlutoMessage(1 /* Success */, "Hello from the other side!"));
      this.triggerEvent("connectionEstablished" /* ConnectionEstablished */);
      console.log("Success code sent.");
    } else {
      this.sendMessageWithCode(2 /* Refused */);
      this.triggerEvent("connectionRefused" /* ConnectionRefused */);
    }
  }
  async listenSafeAsync(key) {
    this.server = net.createServer((socket) => {
      this.socket = socket;
      console.log("Client connected. [Not authorized yet, waiting for key]");
      socket.on("data", (data) => {
        const incMessage = PlutoMessage.fromBuffer(data);
        if (!this.clientIsAuthorized) {
          this.authorizeClientAttempt(incMessage, key);
          return;
        }
        if (this.incomingMessages.count() < this.MESSAGE_QUEUE_CAPACITY) {
          this.incomingMessages.enqueue(incMessage);
          this.triggerEvent("messageReceived" /* MessageReceived */);
        } else {
        }
      });
      socket.on("end", () => {
        console.log("Client disconnected.");
        this.triggerEvent("connectionClosed" /* ConnectionClosed */);
      });
      socket.on("error", (err) => {
        console.error(`Error: ${err.message}`);
      });
    });
    const serverHost = "127.0.0.1";
    const serverPort = 3e3;
    this.server.listen(serverPort, serverHost, () => {
      console.log(`Server started at ${serverHost}:${serverPort}`);
    });
    this.server.on("error", (err) => {
      console.error(`Server error: ${err.message}`);
    });
  }
  sendMethod(transaction) {
    const msg = new Uint8Array(transaction.parameters.length + 2);
    msg[0] = transaction.moduleIndex;
    msg[1] = transaction.moduleIndex;
    msg.set(transaction.parameters, 2);
    this.sendMessage(new PlutoMessage(3 /* Method */, msg));
  }
  isConnected() {
    return this.server !== void 0 && typeof this.server.closed === "boolean" && !this.server.closed;
  }
  static getMyIpAddress() {
    const os = require("os");
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      const addresses = networkInterfaces[interfaceName];
      for (const addressInfo of addresses) {
        if (addressInfo.family === "IPv4" && !addressInfo.internal) {
          return addressInfo.address;
        }
      }
    }
    return "127.0.0.1";
  }
  closeConnection() {
    this.server.close();
  }
  toString() {
    return `${PlutoEventManager.name} <[${"serverAddress"}]
        ${this.server.address().address}:[${this.server.address().port}]${3e3}>`;
  }
};

// src/index.ts
var manager = new PlutoEventManager();
manager.on("connectionEstablished" /* ConnectionEstablished */, () => {
  console.log("Connection established.");
});
manager.on("messageReceived" /* MessageReceived */, () => {
  const msg = manager.incomingMessages.dequeue();
  switch (msg == null ? void 0 : msg.identifier) {
    case 0 /* PublicKey */:
      console.log("publick key received:", msg == null ? void 0 : msg.customDataToString());
      break;
    default:
      console.log("Can't handle this message code: ", msg == null ? void 0 : msg.identifier);
      console.log("data as string:", msg == null ? void 0 : msg.customDataToString());
      console.log("data as bytes:", msg == null ? void 0 : msg.customData);
  }
});
manager.on("connectionClosed" /* ConnectionClosed */, () => {
  console.log("Connection established.");
});
manager.listenSafeAsync("samplePassword");
