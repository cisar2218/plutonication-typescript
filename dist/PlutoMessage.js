"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/PlutoMessage.ts
var PlutoMessage_exports = {};
__export(PlutoMessage_exports, {
  PlutoMessage: () => PlutoMessage
});
module.exports = __toCommonJS(PlutoMessage_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PlutoMessage
});
