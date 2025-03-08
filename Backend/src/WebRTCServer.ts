import { Server } from "socket.io";
import { Server as HttpServer } from "http";

class WebRTCServer {
    private io: Server;
    private senderSocket: string | null = null;
    private receiverSocket: string | null = null;

    constructor(server: HttpServer) {
        this.io = new Server(server, { cors: { origin: "*" } });
        this.setupSocketEvents();
    }

    private setupSocketEvents(): void {
        this.io.on("connection", (socket) => {
            console.log(`🔗 New connection: ${socket.id}`);

            socket.on("set-role", ({ role }: { role: "sender" | "receiver" }) => {
                if (role === "sender") {
                    console.log("✅ Sender Connected");
                    this.senderSocket = socket.id;
                } else if (role === "receiver") {
                    console.log("✅ Receiver Connected");
                    this.receiverSocket = socket.id;
                }
            });

            // Handle Offer/Answer exchange
            socket.on("createOffer", (data) => {
                if (this.receiverSocket) {
                    console.log("📨 Forwarding Offer to Receiver");
                    this.io.to(this.receiverSocket).emit("createOffer", data);
                }
                else{
                    console.log("Reciver Needed!");
                    
                }
            });

            socket.on("createAnswer", (data) => {
                if (this.senderSocket) {
                    console.log("📨 Forwarding Answer to Sender");
                    this.io.to(this.senderSocket).emit("createAnswer", data);
                }
            });

            socket.on("iceCandidate", (data) => {
                if (socket.id === this.senderSocket && this.receiverSocket) {
                    console.log("📨 Forwarding ICE Candidate to Receiver");
                    this.io.to(this.receiverSocket).emit("iceCandidate", data);
                } else if (socket.id === this.receiverSocket && this.senderSocket) {
                    console.log("📨 Forwarding ICE Candidate to Sender");
                    this.io.to(this.senderSocket).emit("iceCandidate", data);
                }
            });

            // 💬 Handle Chat Messages
            socket.on("send-message", ({ text, timestamp }) => {
                console.log(`📨 Message from ${socket.id}: ${text}`);

                const recipientSocket = socket.id === this.senderSocket ? this.receiverSocket : this.senderSocket;

                if (recipientSocket) {
                    this.io.to(recipientSocket).emit("receive-message", {
                        sender: socket.id,
                        text,
                        timestamp,
                    });
                }
            });

            socket.on("disconnect", () => {
                console.log(`❌ Disconnected: ${socket.id}`);
                if (socket.id === this.senderSocket) this.senderSocket = null;
                if (socket.id === this.receiverSocket) this.receiverSocket = null;
            });
        });
    }
}

export default WebRTCServer;
