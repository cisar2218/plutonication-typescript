import * as net from 'net';
import { PlutoMessage } from '../src/PlutoMessage';

const serverHost = '127.0.0.1';
const serverPort = 3000;

const server = net.createServer((socket) => {
  console.log('Client connected.');

  socket.on('data', (data: Buffer) => {
    
    // const message = data.toString().trim();
    const incMessage = PlutoMessage.fromBuffer(data);
    console.log(`Received: ${incMessage.customData}`);

    const response = new Uint8Array(1);
    response[0] = 1;
    console.log(`Sending: ${response}`);
    socket.write(response);
  });

  socket.on('end', () => {
    console.log('Client disconnected.');
  });

  socket.on('error', (err: Error) => {
    console.error(`Error: ${err.message}`);
  });
});

server.listen(serverPort, serverHost, () => {
  console.log(`Server started at ${serverHost}:${serverPort}`);
});

server.on('error', (err: Error) => {
  console.error(`Server error: ${err.message}`);
});