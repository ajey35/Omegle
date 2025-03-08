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
const webrtcServer = new WebRTCServer_1.default(server);
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
