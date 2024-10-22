import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients = {
  chat: [],
  quiz: [],
  quizmaster: [],
};

wss.on("connection", (ws, req) => {
  console.log("Client connected");

  // Parse the URL to extract query params
  const urlParams = new URLSearchParams(req?.url?.split("?")[1]);
  const clientType = urlParams.get("client"); // 'chat', 'quiz', etc.

  // Store the client under its type
  if (clientType && clients[clientType]) {
    clients[clientType].push(ws);
  } else {
    console.log("Unknown client type or missing client type in URL");
  }

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "users") {
        // Broadcast the new user to all clients of the same type
        const username = data.username;
        const broadcastData = JSON.stringify({ type: "users", username });

        clients[clientType].forEach((clientWs) => {
          if (clientWs.readyState === ws.OPEN) {
            clientWs.send(broadcastData);
          }
        });

        console.log("Broadcasted user:", username);
      }

      if (data.type === "questions") {
        const questions = data.questions;
        console.log("Questions received from quizmaster:", questions);
    
        // Broadcast the questions to all clients of type 'quiz'
        const broadcastData = JSON.stringify({ type: "questions", questions });
        
        clients["quiz"].forEach((clientWs) => {
            if (clientWs.readyState === ws.OPEN) {
                clientWs.send(broadcastData);
            }
        });
    
        console.log("Questions broadcasted to quiz clients");
    }
    } catch (e) {
      console.log("Error parsing message:", e.message);
    }
  });

  // Handle client disconnect
  ws.on("close", () => {
    // Remove the client from the list on disconnection
    clients[clientType] = clients[clientType].filter((client) => client !== ws);
    console.log("Client disconnected");
    console.log("Remaining clients in type", clientType, ":", clients[clientType].length);
  });
});