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

// src/AccessCredentials.ts
var AccessCredentials_exports = {};
__export(AccessCredentials_exports, {
  AccessCredentials: () => AccessCredentials
});
module.exports = __toCommonJS(AccessCredentials_exports);
var _AccessCredentials = class {
  constructor(theAddress, port, key, name, icon) {
    if (!theAddress)
      throw new Error("Invalid argument: address is null or undefined.");
    if (!port)
      throw new Error("Invalid argument: port is null or undefined.");
    this.address = theAddress;
    this.port = port;
    if (key != void 0)
      this.key = key;
    else
      this.key = _AccessCredentials.GenerateKey();
    if (name)
      this.name = name;
    if (icon)
      this.icon = icon;
  }
  static fromURL(uri) {
    var _a, _b;
    if (uri == null) {
      throw new Error();
    }
    const queryParams = new URLSearchParams(uri.search);
    const url = queryParams.get(_AccessCredentials.QUERY_PARAM_URL);
    if (!url)
      throw new Error(`Invalid URL parameter: ${_AccessCredentials.QUERY_PARAM_URL} is missing.`);
    const [address, port] = url.split(":");
    const parsedPort = parseInt(port);
    const key = queryParams.get(_AccessCredentials.QUERY_PARAM_KEY);
    if (!key)
      throw new Error(`Invalid URL parameter: ${_AccessCredentials.QUERY_PARAM_KEY} is missing.`);
    const name = (_a = queryParams.get(_AccessCredentials.QUERY_PARAM_NAME)) != null ? _a : void 0;
    const icon = (_b = queryParams.get(_AccessCredentials.QUERY_PARAM_ICON)) != null ? _b : void 0;
    return new _AccessCredentials(address, parsedPort, key, name, icon);
  }
  static GenerateKey(keyLen = 30) {
    const validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let chars = "";
    for (let i = 0; i < keyLen; i++) {
      chars += validChars[Math.floor(Math.random() * validChars.length)];
    }
    return chars;
  }
  ToUri() {
    const queryParams = new URLSearchParams();
    queryParams.set(_AccessCredentials.QUERY_PARAM_URL, `${this.address}:${this.port}`);
    queryParams.set(_AccessCredentials.QUERY_PARAM_KEY, this.key);
    if (this.name) {
      queryParams.set(_AccessCredentials.QUERY_PARAM_NAME, this.name);
    }
    if (this.icon) {
      queryParams.set(_AccessCredentials.QUERY_PARAM_ICON, this.icon);
    }
    const builder = new URL("plutonication://");
    builder.search = queryParams.toString();
    return builder;
  }
};
var AccessCredentials = _AccessCredentials;
// optional
AccessCredentials.QUERY_PARAM_URL = "url";
AccessCredentials.QUERY_PARAM_KEY = "key";
AccessCredentials.QUERY_PARAM_NAME = "name";
AccessCredentials.QUERY_PARAM_ICON = "icon";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AccessCredentials
});
