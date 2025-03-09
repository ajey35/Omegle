import { WebSocketServer, WebSocket } from "ws";
import { Server as HttpServer } from "http";

class WebRTCServer {
    private wss: WebSocketServer;
    private senderSocket: WebSocket | null = null;
    private receiverSocket: WebSocket | null = null;

    constructor(server: HttpServer) {
        this.wss = new WebSocketServer({ server });

        this.wss.on("connection", (socket: WebSocket) => { // 👈 Explicitly type 'socket' as WebSocket
            console.log("🔗 New WebSocket connection");

            socket.on("message", (message: string) => { // 👈 Explicitly type message as string
                try {
                    const data = JSON.parse(message.toString());

                    if (data.type === "set-role") {
                        this.handleSetRole(socket, data.role);
                    } else if (data.type === "createOffer") {
                        this.forwardMessage(this.receiverSocket, data);
                    } else if (data.type === "createAnswer") {
                        this.forwardMessage(this.senderSocket, data);
                    } else if (data.type === "iceCandidate") {
                        this.forwardICECandidate(socket, data);
                    } else if (data.type === "send-message") {
                        this.forwardMessage(socket === this.senderSocket ? this.receiverSocket : this.senderSocket, data);
                    }
                } catch (error) {
                    console.error("❌ Error processing message:", error);
                }
            });

            socket.on("close", () => {
                console.log("❌ Connection closed");
                if (socket === this.senderSocket) this.senderSocket = null;
                if (socket === this.receiverSocket) this.receiverSocket = null;
            });
        });
    }

    private handleSetRole(socket: WebSocket, role: "sender" | "receiver") {
        if (role === "sender") {
            console.log("✅ Sender Connected");
            this.senderSocket = socket;
        } else if (role === "receiver") {
            console.log("✅ Receiver Connected");
            this.receiverSocket = socket;
        }
    }

    private forwardMessage(targetSocket: WebSocket | null, data: any) {
        if (targetSocket) {
            targetSocket.send(JSON.stringify(data));
        } else {
            console.log("❌ Target socket not available");
        }
    }

    private forwardICECandidate(sender: WebSocket, data: any) {
        const targetSocket = sender === this.senderSocket ? this.receiverSocket : this.senderSocket;
        this.forwardMessage(targetSocket, data);
    }
}

export default WebRTCServer;
