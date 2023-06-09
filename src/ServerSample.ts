import { WebSocketServer } from "ws";

const server = new WebSocketServer({ port: 3000 });

server.on("connection", (socket) => {
    // send a message to the client
    socket.send(JSON.stringify({
        type: "hello from server",
        content: [1, "2"]
    }));

    socket.on("message", (data) => {
        const packet = JSON.parse(data);

        switch (packet.type) {
            case "hello from client":
                break;
        }
    });
});