"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const WebRTCServer_1 = __importDefault(require("./WebRTCServer"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Initialize WebRTC Server
const webrtcServer = new WebRTCServer_1.default(server);
// Health check endpoint
app.get("/", (req, res) => {
    res.send("🚀 WebRTC Server is Running!");
});
// Define the port
const PORT = 8080;
// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// Handle unexpected errors
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
});
