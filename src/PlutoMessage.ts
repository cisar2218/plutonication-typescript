import { MessageCode } from './MessageCode';
import { Method } from './Method';

export class PlutoMessage {
    identifier: MessageCode;
    customData: Uint8Array;

    constructor(id: MessageCode, customData: string | Uint8Array) {
        this.identifier = id;
        if (typeof customData === 'string') {
            this.customData = new TextEncoder().encode(customData);
        } else {
            this.customData = customData;
        }
    }

    customDataToString(): string {
        return new TextDecoder('ascii').decode(this.customData);
    }

    toByteArray(): Uint8Array {
        const merged = new Uint8Array(this.customData.length + 1);
        merged[0] = this.identifier;
        merged.set(this.customData, 1);
        return merged;
    }

    getMethod(): Method {
        if (this.identifier !== MessageCode.Method) {
            throw new Error(`Can't convert cause '${this.identifier}' code is not suited for ${MessageCode.Method}.`);
        }
        let data = new Uint8Array(0);
        if (this.customData.length > 2) {
            data = this.customData.slice(2);
        }
        return new Method(this.customData[0], this.customData[1], data);
    }

    static fromBuffer(data: Buffer) {
        return new PlutoMessage(data[0], data.slice(1));
    }
}