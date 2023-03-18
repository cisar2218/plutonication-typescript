import { PlutoManager } from './PlutoManager';
import { PlutoMessage } from './PlutoMessage';
import { MessageCode } from './MessageCode';
import { Socket, TcpListener } from 'net'; 
import { AccessCredentials } from './AccessCredentials';

type Notify = () => void;

export class PlutoEventManager extends PlutoManager {
  public ConnectionEstablished?: Notify;
  public ConnectionRefused?: Notify;
  public ConnectionClosed?: Notify;
  public MessageReceived?: Notify;

  private loopIsReceiving = true;
  private server?: TcpListener;
  public IncomingMessages: Queue<PlutoMessage> = new Queue<PlutoMessage>();
  public MESSAGE_QUEUE_CAPACITY = 20;

  async connectSafeAsync(c: AccessCredentials, timeoutMiliseconds = 60000): Promise<void> {
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
  }

  stopReceiveLoop(): void {
    this.loopIsReceiving = false;
  }

  async setupReceiveLoopAsync(): Promise<void> {
    this.loopIsReceiving = true;
    while (this.loopIsReceiving) {
      try {
        const incMessage = await this.receiveMessageAsync(10000);
        if (this.IncomingMessages.count() >= this.MESSAGE_QUEUE_CAPACITY) {
          const sendingMsg = this.sendMessageWithCodeAsync(MessageCode.FilledOut);
        }
        this.IncomingMessages.enqueue(incMessage);
        this.MessageReceived?.();
      } catch {
        // no incoming messages
      }
    }
  }

  async listenSafeAsync(key: string, port: number, timeoutMiliseconds = 60000): Promise<void> {
    this.server = new TcpListener(port); // Assuming that TcpListener is an implementation of a TCP server in your project
    this.server.start();
    this.client = await this.server.acceptTcpClientAsync();

    const authMessage = await this.receiveMessageAsync(timeoutMiliseconds);
    let sendingResponse: Promise<void>;
    if (authMessage.identifier === MessageCode.Auth && authMessage.customDataToString() === key) {
      sendingResponse = this.sendMessageWithCodeAsync(MessageCode.Success);
      this.ConnectionEstablished?.();
    } else {
      sendingResponse = this.sendMessageWithCodeAsync(MessageCode.Refused);
      this.ConnectionRefused?.();
    }
    await sendingResponse;
  }

  isConnected(): boolean {
    return this.client !== undefined && !this.client.closed;
  }

  closeConnection(): void {
    if (this.isConnected()) {
      this.client.destroy();
    }
    this.server?.stop();
  }
}
