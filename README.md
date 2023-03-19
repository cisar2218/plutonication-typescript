# plutonication-typescript
Typescript version of C# .NET class library [Plutonication](https://github.com/cisar2218/Plutonication).

## Instalation
[Npm package](https://www.npmjs.com/package/plutonication-typescript) can be installed with command:

```
npm install plutonication-typescript
```

## Deve
Polkadot JS Transaction object example:
```json
{
   "signature":{
      "signer":{
         "id":"5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM"
      },
      "signature":{
         "ed25519":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      },
      "era":{
         "immortalEra":"0x00"
      },
      "nonce":0,
      "tip":0
   },
   "method":{
      "callIndex":"0x0901",
      "args":{
         "event":"0x61686f6a",
         "result":0
      }
   }
```
- To clarify, callIndex is of type "Uint8Array" of length 2, args is also of type "Uint8Array"

What we want:
1) callIndex[0] => moduleIndex
2) callIndex[1] => callIndex
3) args => data


# Resources:

- https://polkadot.js.org/docs/api/start/api.tx
- https://github.com/polkadot-js/extension
