"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
class RoomManager {
    constructor() {
        this.rooms = {}; // { roomId: [user1, user2] }
    }
    createRoom() {
        const roomId = (0, uuid_1.v4)();
        this.rooms[roomId] = [];
        return roomId;
    }
    joinRoom(socketId, roomId) {
        if (!this.rooms[roomId])
            this.rooms[roomId] = [];
        if (this.rooms[roomId].length < 2) {
            this.rooms[roomId].push(socketId);
            return true;
        }
        return false;
    }
    leaveRoom(socketId) {
        for (const roomId in this.rooms) {
            this.rooms[roomId] = this.rooms[roomId].filter(id => id !== socketId);
            if (this.rooms[roomId].length === 0)
                delete this.rooms[roomId]; // Cleanup empty rooms
        }
    }
}
exports.default = RoomManager;
