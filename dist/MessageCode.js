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

// src/MessageCode.ts
var MessageCode_exports = {};
__export(MessageCode_exports, {
  MessageCode: () => MessageCode
});
module.exports = __toCommonJS(MessageCode_exports);
var MessageCode = /* @__PURE__ */ ((MessageCode2) => {
  MessageCode2[MessageCode2["PublicKey"] = 0] = "PublicKey";
  MessageCode2[MessageCode2["Success"] = 1] = "Success";
  MessageCode2[MessageCode2["Refused"] = 2] = "Refused";
  MessageCode2[MessageCode2["Method"] = 3] = "Method";
  MessageCode2[MessageCode2["Auth"] = 4] = "Auth";
  MessageCode2[MessageCode2["FilledOut"] = 5] = "FilledOut";
  MessageCode2[MessageCode2["Extrinsic"] = 6] = "Extrinsic";
  return MessageCode2;
})(MessageCode || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MessageCode
});
