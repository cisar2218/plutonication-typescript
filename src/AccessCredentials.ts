    export class AccessCredentials {
        address: string;
        port: number;
        key: string;
        name?: string; // optional
        icon?: string; // optional
        static QUERY_PARAM_URL: string = "url";
        static QUERY_PARAM_KEY: string = "key";
        static QUERY_PARAM_NAME: string = "name";
        static QUERY_PARAM_ICON: string = "icon";
        
        constructor(theAddress: string, port: number, key?: string, name?: string, icon?: string) {
            if (!theAddress) throw new Error("Invalid argument: address is null or undefined.");
            if (!port) throw new Error("Invalid argument: port is null or undefined.");
            
            this.address = theAddress;
            this.port = port;
      
            if (key != undefined) this.key = key;
            else this.key = AccessCredentials.GenerateKey();
      
            if (name) this.name = name;
            if (icon) this.icon = icon;
        }

        static fromURL(uri: URL) {
            if (uri == null) { throw new Error(); }
    
            const queryParams = new URLSearchParams(uri.search);
    
            const url = queryParams.get(AccessCredentials.QUERY_PARAM_URL);
            if (!url) throw new Error(`Invalid URL parameter: ${AccessCredentials.QUERY_PARAM_URL} is missing.`);
            const [address, port] = url.split(":");
            const parsedPort = parseInt(port);
    
            const key = queryParams.get(AccessCredentials.QUERY_PARAM_KEY);
            if (!key) throw new Error(`Invalid URL parameter: ${AccessCredentials.QUERY_PARAM_KEY} is missing.`);

            const name = queryParams.get(AccessCredentials.QUERY_PARAM_NAME) ?? undefined;
            const icon = queryParams.get(AccessCredentials.QUERY_PARAM_ICON) ?? undefined;
    
            return new AccessCredentials(address, parsedPort, key, name, icon);
        }

        public static GenerateKey(keyLen: number = 30): string {
            const validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            let chars = "";
            for (let i = 0; i < keyLen; i++) {
                chars += validChars[Math.floor(Math.random()*validChars.length)];
            }
            return chars;
        }

        public ToUri(): URL {
            const queryParams = new URLSearchParams();
            queryParams.set(AccessCredentials.QUERY_PARAM_URL, `${this.address}:${this.port}`);
            queryParams.set(AccessCredentials.QUERY_PARAM_KEY, this.key);
            if (this.name) {
                queryParams.set(AccessCredentials.QUERY_PARAM_NAME, this.name);
            }
            if (this.icon) {
                queryParams.set(AccessCredentials.QUERY_PARAM_ICON, this.icon);
            }
            const builder = new URL("plutonication://");
            builder.search = queryParams.toString();
            return builder;
        }
    }