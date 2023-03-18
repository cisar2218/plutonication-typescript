// Required imports
import { PlutoMessage } from './PlutoMessage';
import { MessageCode } from './MessageCode';
import { Method } from './Method';
import { Socket } from 'net';

const DEFAULT_READSTREAM_TIMEOUT = 1000; // milliseconds

export abstract class PlutoManager {
    protected client: Socket;
    protected port: number;
    protected serverAddress: string;

    constructor(client: Socket, port: number, serverAddress: string) {
        this.client = client;
        this.port = port;
        this.serverAddress = serverAddress;
    }

    abstract closeConnection(): void;

    receiveMessage(timeoutMilliseconds: number = DEFAULT_READSTREAM_TIMEOUT): Promise<PlutoMessage> {
        return new Promise((resolve, reject) => {
            const data: Buffer = Buffer.alloc(256);
            this.client.setTimeout(timeoutMilliseconds > 0 ? timeoutMilliseconds : DEFAULT_READSTREAM_TIMEOUT);

            this.client.once('data', (chunk: Buffer) => {
                const customDataLength = chunk.length - 1;
                const customData = chunk.slice(1, customDataLength + 1);
                resolve(new PlutoMessage(chunk.readUInt8(0) as MessageCode, customData));
            });

            this.client.once('timeout', () => {
                this.client.removeAllListeners('data');
                reject(new Error(`Timeout (${this.client.timeout} ms). You can adjust timeout as ${'receiveMessage'} parameter ${'timeoutMilliseconds'}.`));
            });
        });
    }

    async receiveMessageAsync(timeoutMilliseconds: number = DEFAULT_READSTREAM_TIMEOUT): Promise<PlutoMessage> {
        return this.receiveMessage(timeoutMilliseconds);
    }

    sendMessage(message: PlutoMessage): void {
        const msg = message.toByteArray();
        this.client.write(msg);
    }

    sendMessageWithCode(code: MessageCode): void {
        this.sendMessage(new PlutoMessage(code, ''));
    }

    async sendMessageWithCodeAsync(code: MessageCode): Promise<void> {
        this.sendMessageWithCode(code);
    }

    async sendMessageAsync(message: PlutoMessage): Promise<void> {
        const msg = message.toByteArray();
        await this.writeAsync(msg); // Assuming that the `client` is a `Socket` instance from the 'net' module
    }

    private writeAsync(data: Uint8Array | string, encoding?: BufferEncoding): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.write(data, encoding, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async sendMethodAsync(transaction: Method): Promise<void> {
        const msg = new Uint8Array(transaction.parameters.length + 2);
        msg[0] = transaction.moduleIndex;
        msg[1] = transaction.moduleIndex;
        msg.set(transaction.parameters, 2);

        await this.sendMessageAsync(new PlutoMessage(MessageCode.Method, msg));
    }

    sendMethod(transaction: Method): void {
        const msg = new Uint8Array(transaction.parameters.length + 2);
        msg[0] = transaction.moduleIndex;
        msg[1] = transaction.moduleIndex;
        msg.set(transaction.parameters, 2);

        this.sendMessage(new PlutoMessage(MessageCode.Method, msg));
    }

    static getMyIpAddress(): string {
        // You can use the 'os' module (built-in) to get the network interfaces in Node.js.
        // However, you may need to write more logic to find the correct IP address based on your requirements.
        // The example below returns the first IPv4 address found.
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

    toString(): string {
        return `${PlutoManager.name} <[${'serverAddress'}]${this.serverAddress}:[${'port'}]${this.port}>`;
    }
}