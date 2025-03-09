import { v4 as uuidv4 } from "uuid";

class RoomManager {
    private rooms: Record<string, string[]> = {}; // { roomId: [user1, user2] }

    createRoom(): string {
        const roomId: string = uuidv4();
        this.rooms[roomId] = [];
        return roomId;
    }

    joinRoom(socketId: string, roomId: string): boolean {
        if (!this.rooms[roomId]) {
            this.rooms[roomId] = [];
        }
        if (this.rooms[roomId].length < 2) {
            this.rooms[roomId].push(socketId);
            return true;
        }
        return false;
    }

    leaveRoom(socketId: string): void {
        for (const roomId in this.rooms) {
            this.rooms[roomId] = this.rooms[roomId].filter((id) => id !== socketId);
            if (this.rooms[roomId].length === 0) {
                delete this.rooms[roomId]; // Cleanup empty rooms
            }
        }
    }
}

export default RoomManager;
