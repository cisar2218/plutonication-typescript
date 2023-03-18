import { AccessCredentials } from "../src/AccessCredentials";

describe("AccessCredentials", () => {
    test("Constructors", () => {
        const sampleAddress = "127.0.0.1"
        const samplePort = 8080
        const sampleKey = "sample password"
        const sampleName = "dApp name"
        const sampleIcon = "dApp icon";

        let ac1 = new AccessCredentials(sampleAddress, samplePort);
        let ac2 = new AccessCredentials(sampleAddress, samplePort, sampleKey);
        let ac3 = new AccessCredentials(sampleAddress, samplePort, sampleKey, sampleName, sampleIcon);

        expect(ac1.address).toBe(sampleAddress);
        expect(ac1.port).toBe(samplePort);
        expect(ac1.key).not.toBeUndefined();

        expect(ac2.address).toBe(sampleAddress);
        expect(ac2.port).toBe(samplePort);
        expect(ac2.key).toBe(sampleKey);

        expect(ac3.address).toBe(sampleAddress);
        expect(ac3.port).toBe(samplePort);
        expect(ac3.key).toBe(sampleKey);
        expect(ac3.name).toBe(sampleName);
        expect(ac3.icon).toBe(sampleIcon);
    });


    test("Defined", () => {
        expect(AccessCredentials).not.toBeUndefined();
    });

    describe("Key generation", () => {
        test("Key defined", () => {
            expect(AccessCredentials.GenerateKey()).not.toBeUndefined();
        });

        test("Key has correct default length", () => {
            const defaultLen = 30;
            expect(AccessCredentials.GenerateKey().length).toBe(defaultLen);
        });

        test("Key has correct custom length", () => {
            const max = 100;
            const customLen = Math.floor(Math.random() * max);
            expect(AccessCredentials.GenerateKey(customLen).length).toBe(customLen);
        });
    });

    describe("Key", () => {
        let ac = new AccessCredentials("127.0.0.1", 8080);

        test("Key is defined (automatically)", () => {
            expect(ac.key).not.toBeUndefined();
        });

        test("Key is string", () => {
            const generatedKey = ac.key;
            expect(typeof generatedKey).toBe("string");
        });

        test("Key has default length", () => {
            const defaultLen = 30;
            expect(ac.key.length).toBe(defaultLen);
        });
    });

    test("Convertion to Uri", () => {
        const sampleAddress = "127.0.0.1"
        const samplePort = 8080
        const sampleKey = "sample password"
        const sampleName = "dApp name"
        const sampleIcon = "dApp icon";

        let ac = new AccessCredentials(sampleAddress, samplePort, sampleKey, sampleName, sampleIcon);
        expect(ac.ToUri().toString()).toBe(
            "plutonication://?url=127.0.0.1%3A8080&key=sample+password&name=dApp+name&icon=dApp+icon"
        );
    });

    test("Creation from Uri", () => {
        const sampleAddress = "127.0.0.1"
        const samplePort = 8080
        const sampleKey = "sample password"
        const sampleName = "dApp name"
        const sampleIcon = "dApp icon";
        
        const url = new URL("plutonication://?url=127.0.0.1%3A8080&key=sample+password&name=dApp+name&icon=dApp+icon");
        const fromUri = AccessCredentials.fromURL(url);
        let ac = new AccessCredentials(sampleAddress, samplePort, sampleKey, sampleName, sampleIcon);

        expect(ac).toStrictEqual(fromUri);
    });
});
