// PlutoMessage.test.ts
import { PlutoMessage } from '../src/PlutoMessage';
import { MessageCode } from '../src/MessageCode';
import { Method } from '../src/Method';

describe('PlutoMessage', () => {
    test('should construct with a string customData', () => {
        const plutoMessage = new PlutoMessage(MessageCode.Method, 'test');
        expect(plutoMessage.identifier).toBe(MessageCode.Method);
        expect(plutoMessage.customData).toEqual(new TextEncoder().encode('test'));
    });

    test('should construct with a Uint8Array customData', () => {
        const customData = new Uint8Array([1, 2, 3]);
        const plutoMessage = new PlutoMessage(MessageCode.Method, customData);
        expect(plutoMessage.identifier).toBe(MessageCode.Method);
        expect(plutoMessage.customData).toEqual(customData);
    });

    test('customDataToString should return the correct string', () => {
        const plutoMessage = new PlutoMessage(MessageCode.Method, 'test');
        expect(plutoMessage.customDataToString()).toBe('test');
    });

    test('toByteArray should return the correct Uint8Array', () => {
        const plutoMessage = new PlutoMessage(MessageCode.Method, 'test');
        const byteArray = plutoMessage.toByteArray();
        expect(byteArray[0]).toBe(MessageCode.Method);
        expect(byteArray.slice(1)).toEqual(new TextEncoder().encode('test'));
    });

    test('getMethod should return a Method instance when the identifier is MessageCode.Method', () => {
        const methodData = new Uint8Array([1, 2, 3]);
        const plutoMessage = new PlutoMessage(MessageCode.Method, methodData);
        const method = plutoMessage.getMethod();
        expect(method).toBeInstanceOf(Method);
        // Add more assertions based on the Method class properties and methods
    });

    test('getMethod should throw an error when the identifier is not MessageCode.Method', () => {
        const plutoMessage = new PlutoMessage(MessageCode.Auth, 'test');
        expect(() => plutoMessage.getMethod()).toThrowError(/Can't convert cause/);
    });
});
