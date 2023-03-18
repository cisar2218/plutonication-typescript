// Import the WebSocket type
import {WebSocket} from 'ws';

// Create a WebSocket connection
const socket = new WebSocket('ws://localhost:3000');

// Listen for the 'open' event when the connection is established
socket.on('open', () => {
  console.log('Connected to server');
});

// Listen for the 'message' event to receive messages from the server
socket.on('message', (data: string) => {
  const packet = JSON.parse(data);

  switch (packet.type) {
    case 'hello from server':
      console.log('Received hello from server:', packet.content);
      break;
  }
});

// Listen for the 'close' event when the connection is closed
socket.on('close', () => {
  console.log('Disconnected from server');
});

// Listen for the 'error' event to handle errors
socket.on('error', (error: Error) => {
  console.error('WebSocket error:', error);
});
