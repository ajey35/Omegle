import express from "express";
import http from "http";
import WebRTCServer from "./WebRTCServer";


const app = express();
const server = http.createServer(app);

// Initialize WebRTC Server
const webrtcServer = new WebRTCServer(server);

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
