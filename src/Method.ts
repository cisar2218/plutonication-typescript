export class Method {
    moduleIndex: number;
    callIndex: number;
    parameters: Uint8Array;

    constructor(callIndex: number, palletIndex: number, data: Uint8Array) {
        if (callIndex < 0 || callIndex > 255){
            throw Error("CallIndex value must be in range 0-255.");
        } else if (palletIndex < 0 || palletIndex > 255) {
            throw Error("PalletIndex value must be in range 0-255.");
        }
        this.moduleIndex = callIndex;
        this.callIndex = palletIndex;
        this.parameters = data;
    }

    toByteArray(): Uint8Array {
        const result = new Uint8Array(2 + this.parameters.length);
        result[0] = this.moduleIndex;
        result[1] = this.callIndex;
        result.set(this.parameters, 2);
        return result;
    }
}
