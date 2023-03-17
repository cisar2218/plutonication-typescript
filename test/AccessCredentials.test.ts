import { AccessCredentials } from "../src/AccessCredentials";

describe("AccessCredentials", () => {
    const ac = new AccessCredentials("127.0.0.1", 8080);

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
});
