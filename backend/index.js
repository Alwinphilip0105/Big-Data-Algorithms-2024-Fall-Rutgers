const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Store connected WebSocket clients
const clients = new Map(); // Use a Map to track WebSocket connections with unique IDs

// Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("New WebSocket connection");
    
    // Assign a unique ID to the WebSocket
    const clientId = Date.now(); // Simple unique ID based on timestamp
    clients.set(clientId, ws);

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            console.log("Data from Python ==>>"+JSON.stringify(data, null, 2));
            
            
                // Send the final_scores as the response to the pending POST request
                ws.pendingResponse.status(200).send(data);
                ws.pendingResponse = null; // Clear the pending response
        } catch (error) {
            console.error("Error processing message from client:", error);
        }
    });

    ws.on("close", () => {
        console.log("WebSocket connection closed");
        clients.delete(clientId);
    });

    // Store the clientId in the WebSocket object
    ws.clientId = clientId;
});

// Handle HTTP POST requests from React
app.post("/data", (req, res) => {
    const data = req.body;
    console.log("Received data from React:", data);

    // Check if there are any connected WebSocket clients
    if (clients.size === 0) {
        return res.status(503).send({ message: "No WebSocket clients connected" });
    }

    // Pick an available WebSocket client (e.g., the first one)
    const [clientId, ws] = clients.entries().next().value;

    if (ws && ws.readyState === WebSocket.OPEN) {
        // Send data to the WebSocket client
        ws.send(JSON.stringify(data));

        // Store the HTTP response object in the WebSocket for later use
        ws.pendingResponse = res;
    } else {
        res.status(503).send({ message: "No available WebSocket client to handle the request" });
    }
});

// Start HTTP and WebSocket server
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
    });
});
