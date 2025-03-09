"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
class WebRTCServer {
    constructor(server) {
        this.senderSocket = null;
        this.receiverSocket = null;
        this.wss = new ws_1.WebSocketServer({ server });
        this.wss.on("connection", (socket) => {
            console.log("🔗 New WebSocket connection");
            socket.on("message", (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    if (data.type === "set-role") {
                        this.handleSetRole(socket, data.role);
                    }
                    else if (data.type === "createOffer") {
                        this.forwardMessage(this.receiverSocket, data);
                    }
                    else if (data.type === "createAnswer") {
                        this.forwardMessage(this.senderSocket, data);
                    }
                    else if (data.type === "iceCandidate") {
                        this.forwardICECandidate(socket, data);
                    }
                    else if (data.type === "send-message") {
                        this.forwardMessage(socket === this.senderSocket ? this.receiverSocket : this.senderSocket, data);
                    }
                }
                catch (error) {
                    console.error("❌ Error processing message:", error);
                }
            });
            socket.on("close", () => {
                console.log("❌ Connection closed");
                if (socket === this.senderSocket)
                    this.senderSocket = null;
                if (socket === this.receiverSocket)
                    this.receiverSocket = null;
            });
        });
    }
    handleSetRole(socket, role) {
        if (role === "sender") {
            console.log("✅ Sender Connected");
            this.senderSocket = socket;
        }
        else if (role === "receiver") {
            console.log("✅ Receiver Connected");
            this.receiverSocket = socket;
        }
    }
    forwardMessage(targetSocket, data) {
        if (targetSocket) {
            targetSocket.send(JSON.stringify(data));
        }
        else {
            console.log("❌ Target socket not available");
        }
    }
    forwardICECandidate(sender, data) {
        const targetSocket = sender === this.senderSocket ? this.receiverSocket : this.senderSocket;
        this.forwardMessage(targetSocket, data);
    }
}
exports.default = WebRTCServer;
