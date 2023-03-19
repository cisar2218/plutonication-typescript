import { PlutoMessage } from './PlutoMessage';
import { MessageCode } from './MessageCode';
import { Method } from './Method';
import { Socket } from 'net';

export interface IPlutoManager {
    closeConnection(): void;
    
    sendMessage(message: PlutoMessage): void; 
    sendMethod(transaction: Method): void;
    sendMessageWithCode(code: MessageCode): void;
}
    
    /**
     async sendMessageAsync(message: PlutoMessage): Promise<void> {
         const msg = message.toByteArray();
         await this.writeAsync(msg);
        }
    */
        
    /*
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
    */


    
