import express from "express";
import http from "http";
import WebRTCServer from "./WebRTCServer";

const app = express();
const server = http.createServer(app);
const webrtcServer = new WebRTCServer(server);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
