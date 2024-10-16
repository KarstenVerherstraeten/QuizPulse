import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map();

wss.on("connection", (ws) => {
    console.log("Client connected");

    
    const clientId = Date.now();
    clients.set(clientId, ws);


    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === "users") {
                // Broadcast the new user to all clients
                const username = data.username;
                const broadcastData = JSON.stringify({ type: "users", username });

                clients.forEach((clientWs) => {
                    if (clientWs.readyState === ws.OPEN) {
                        clientWs.send(broadcastData);
                    }
                });

                console.log("Broadcasted user:", username);
            }
        } catch (e) {
            console.log("Error parsing message:", e.message);
        }
    });

    // Handle client disconnect
    ws.on("close", () => {
        clients.delete(clientId);
        console.log("Client disconnected");
        console.log("Remaining clients:", clients.size);
    });
});