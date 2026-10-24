import type { Server } from 'socket.io';

let ioInstance: Server | null = null;

export function setIoInstance(io: Server): void {
  ioInstance = io;
}

export function getIoInstance(): Server | null {
  return ioInstance;
}

export function emitToUser(userId: string, event: string, payload: any): void {
  ioInstance?.to(`user:${userId}`).emit(event, payload);
}

export function emitToGuild(guildId: string, event: string, payload: any): void {
  ioInstance?.to(`guild:${guildId}`).emit(event, payload);
}

export function emitToChannel(channelId: string, event: string, payload: any): void {
  ioInstance?.to(`channel:${channelId}`).emit(event, payload);
}

export function emitToStudyRoom(roomId: string, event: string, payload: any): void {
  ioInstance?.to(`study:${roomId}`).emit(event, payload);
}

export function emitToBoss(bossId: string, event: string, payload: any): void {
  ioInstance?.to(`boss:${bossId}`).emit(event, payload);
}

export function broadcastAll(event: string, payload: any): void {
  ioInstance?.emit(event, payload);
}
