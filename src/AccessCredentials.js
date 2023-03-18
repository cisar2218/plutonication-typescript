"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessCredentials = void 0;
var AccessCredentials = exports.AccessCredentials = /** @class */ (function () {
    function AccessCredentials(theAddress, port, key, name, icon) {
        if (!theAddress)
            throw new Error("Invalid argument: address is null or undefined.");
        if (!port)
            throw new Error("Invalid argument: port is null or undefined.");
        this.address = theAddress;
        this.port = port;
        if (key != undefined)
            this.key = key;
        else
            this.key = AccessCredentials.GenerateKey();
        if (name)
            this.name = name;
        if (icon)
            this.icon = icon;
    }
    AccessCredentials.fromURL = function (uri) {
        var _a;
        var _b, _c;
        if (uri == null) {
            throw new Error();
        }
        var queryParams = new URLSearchParams(uri.search);
        var url = queryParams.get(AccessCredentials.QUERY_PARAM_URL);
        if (!url)
            throw new Error("Invalid URL parameter: ".concat(AccessCredentials.QUERY_PARAM_URL, " is missing."));
        var address = (_a = url.split(":"), _a[0]), port = _a[1];
        var parsedPort = parseInt(port);
        var key = queryParams.get(AccessCredentials.QUERY_PARAM_KEY);
        if (!key)
            throw new Error("Invalid URL parameter: ".concat(AccessCredentials.QUERY_PARAM_KEY, " is missing."));
        var name = (_b = queryParams.get(AccessCredentials.QUERY_PARAM_NAME)) !== null && _b !== void 0 ? _b : undefined;
        var icon = (_c = queryParams.get(AccessCredentials.QUERY_PARAM_ICON)) !== null && _c !== void 0 ? _c : undefined;
        return new AccessCredentials(address, parsedPort, key, name, icon);
    };
    AccessCredentials.GenerateKey = function (keyLen) {
        if (keyLen === void 0) { keyLen = 30; }
        var validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var chars = "";
        for (var i = 0; i < keyLen; i++) {
            chars += validChars[Math.floor(Math.random() * validChars.length)];
        }
        return chars;
    };
    AccessCredentials.prototype.ToUri = function () {
        var queryParams = new URLSearchParams();
        queryParams.set(AccessCredentials.QUERY_PARAM_URL, "".concat(this.address, ":").concat(this.port));
        queryParams.set(AccessCredentials.QUERY_PARAM_KEY, this.key);
        if (this.name) {
            queryParams.set(AccessCredentials.QUERY_PARAM_NAME, this.name);
        }
        if (this.icon) {
            queryParams.set(AccessCredentials.QUERY_PARAM_ICON, this.icon);
        }
        var builder = new URL("plutonication://");
        builder.search = queryParams.toString();
        return builder;
    };
    AccessCredentials.QUERY_PARAM_URL = "url";
    AccessCredentials.QUERY_PARAM_KEY = "key";
    AccessCredentials.QUERY_PARAM_NAME = "name";
    AccessCredentials.QUERY_PARAM_ICON = "icon";
    return AccessCredentials;
}());
