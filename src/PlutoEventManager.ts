import { IPlutoManager } from './IPlutoManager';
import { PlutoMessage } from './PlutoMessage';
import { MessageCode } from './MessageCode';
import * as net from 'net';
import { AccessCredentials } from './AccessCredentials';
import { Socket } from 'socket.io';
import { Method } from './Method';
import { Queue } from './Queue';

type Notify = () => void;

export class PlutoEventManager implements IPlutoManager {

    public ConnectionEstablished?: Notify;
    public ConnectionRefused?: Notify;
    public ConnectionClosed?: Notify;
    public MessageReceived?: Notify;

    private clientIsAuthorized = false;
    private socket?: net.Socket;
    public incomingMessages: Queue<PlutoMessage> = new Queue<PlutoMessage>();
    public MESSAGE_QUEUE_CAPACITY = 20;
    server: any;

    sendMessageWithCode(code: MessageCode): void {
        this.sendMessage(new PlutoMessage(code));
    } sendMessageWithCodeAsync(code: MessageCode): Promise<void> {
        throw new Error('Method not implemented.');
    } sendMessage(message: PlutoMessage): void {
        const msg = message.toByteArray();
        if (this.socket) this.socket.write(msg);
        else throw new Error("Socket is not defined");
    }

    async connectSafeAsync(c: AccessCredentials, timeoutMiliseconds = 60000): Promise<void> {
        /*
        this.client = new Socket();
        await this.client.connect({ host: c.address, port: c.port });

        const authMessage = new PlutoMessage(MessageCode.Auth, c.key);
        const sendingMsg = this.sendMessageAsync(authMessage);

        try {
            const recvSuccess = await this.receiveMessageAsync(timeoutMiliseconds);
            if (recvSuccess.identifier !== MessageCode.Success) {
                throw new Error(`Connection wasn't established. Response ${MessageCode[recvSuccess.identifier]} is ${recvSuccess.identifier}`);
            }
            this.ConnectionEstablished?.();
        } catch (e) {
            throw e;
        }
        */
        throw new Error("Not yet implemented.");
    }

    private authorizeClientAttempt(authMessage: PlutoMessage, key: string) {
        this.clientIsAuthorized = (authMessage.identifier == MessageCode.Auth &&
            authMessage.customDataToString() === key);
        console.log("Client Authorized:", this.clientIsAuthorized);

        if (this.clientIsAuthorized) {
            this.sendMessageWithCode(MessageCode.Success);
        } else {
            this.sendMessageWithCode(MessageCode.Refused);
        }
    }

    async listenSafeAsync(key: string): Promise<void> {
        this.server = net.createServer((socket) => {
            this.socket = socket;
            console.log('Client connected. [Not authorized yet, waiting for key]');

            socket.on('data', (data: Buffer) => {
                const incMessage = PlutoMessage.fromBuffer(data);
                if (!this.clientIsAuthorized) {
                    this.authorizeClientAttempt(incMessage, key);
                    return;
                }

                // on incoming data add to queue
                if (this.incomingMessages.count() < this.MESSAGE_QUEUE_CAPACITY) {
                    this.incomingMessages.enqueue(incMessage);
                } else {
                    // TODO handle full queue
                }
            });

            socket.on('end', () => {
                console.log('Client disconnected.');
            });

            socket.on('error', (err: Error) => {
                console.error(`Error: ${err.message}`);
            });
        });
        
        const serverHost = '127.0.0.1';
        const serverPort = 3000;

        this.server.listen(serverPort, serverHost, () => {
            console.log(`Server started at ${serverHost}:${serverPort}`);
          });
          
        this.server.on('error', (err: Error) => {
        console.error(`Server error: ${err.message}`);
        });
    }

    sendMethod(transaction: Method): void {
        const msg = new Uint8Array(transaction.parameters.length + 2);
        msg[0] = transaction.moduleIndex;
        msg[1] = transaction.moduleIndex;
        msg.set(transaction.parameters, 2);

        this.sendMessage(new PlutoMessage(MessageCode.Method, msg));
    }

    isConnected(): boolean {
        return this.server !== undefined && typeof this.server.closed === "boolean" && !this.server.closed;
    }

    static getMyIpAddress(): string {
        const os = require('os');
        const networkInterfaces = os.networkInterfaces();

        for (const interfaceName in networkInterfaces) {
            const addresses = networkInterfaces[interfaceName];
            for (const addressInfo of addresses) {
                if (addressInfo.family === 'IPv4' && !addressInfo.internal) {
                    return addressInfo.address;
                }
            }
        }
        return '127.0.0.1';
    }

    closeConnection(): void {
        this.server.close();
    }

    toString(): string {
        return `${PlutoEventManager.name} <[${'serverAddress'}]
        ${this.server.address().address}:[${this.server.address().port}]${3000}>`;
    }
}
