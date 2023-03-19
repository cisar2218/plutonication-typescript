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

// src/Method.ts
var Method_exports = {};
__export(Method_exports, {
  Method: () => Method
});
module.exports = __toCommonJS(Method_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Method
});
