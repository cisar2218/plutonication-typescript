export class Method {
    callIndex: number;
    palletIndex: number;
    data: Uint8Array;

    constructor(callIndex: number, palletIndex: number, data: Uint8Array) {
        if (callIndex < 0 || callIndex > 255){
            throw Error("CallIndex value must be in range 0-255.");
        } else if (palletIndex < 0 || palletIndex > 255) {
            throw Error("PalletIndex value must be in range 0-255.");
        }
        this.callIndex = callIndex;
        this.palletIndex = palletIndex;
        this.data = data;
    }

    toByteArray(): Uint8Array {
        const result = new Uint8Array(2 + this.data.length);
        result[0] = this.callIndex;
        result[1] = this.palletIndex;
        result.set(this.data, 2);
        return result;
    }
}
