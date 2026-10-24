import { ChatMessage, ChatReaction } from '../types';
import { api } from '../api/client';

export type ChatStore = Record<string, ChatMessage[]>;

export interface NetworkInfo {
  hostIp: string;
  port: number;
  clientPort: number;
  connectedCount: number;
  networkUrl: string;
}

// Lightweight Web Audio API synthesizer for live message chimes
let audioCtx: AudioContext | null = null;
export function playIncomingChime() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.08); // E6

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch {
    // audio interaction prevented
  }
}

export class LiveChatManager {
  private messageListeners = new Set<(store: ChatStore) => void>();
  private deviceCountListeners = new Set<(count: number) => void>();
  private store: ChatStore = {};
  private connectedCount = 1;
  private socketEmit: ((event: string, data: any) => void) | null = null;

  public setSocketEmit(fn: (event: string, data: any) => void) {
    this.socketEmit = fn;
  }

  public subscribeMessages(listener: (store: ChatStore) => void): () => void {
    this.messageListeners.add(listener);
    listener(this.store);
    return () => {
      this.messageListeners.delete(listener);
    };
  }

  public subscribeDeviceCount(listener: (count: number) => void): () => void {
    this.deviceCountListeners.add(listener);
    listener(this.connectedCount);
    return () => {
      this.deviceCountListeners.delete(listener);
    };
  }

  public setStore(newStore: ChatStore) {
    this.store = newStore;
    this.notifyMessageListeners();
  }

  public handleSocketMessage(channelId: string, message: ChatMessage, playSound = true) {
    const list = this.store[channelId] || [];
    if (list.some((m) => m.id === message.id)) return;

    this.store = {
      ...this.store,
      [channelId]: [...list, message]
    };
    this.notifyMessageListeners();

    if (playSound) {
      playIncomingChime();
    }
  }

  public handleSocketReaction(channelId: string, messageId: string, reactions: ChatReaction[]) {
    const list = this.store[channelId] || [];
    const updated = list.map((m) => (m.id === messageId ? { ...m, reactions } : m));

    this.store = {
      ...this.store,
      [channelId]: updated
    };
    this.notifyMessageListeners();
  }

  public setDeviceCount(count: number) {
    this.connectedCount = count;
    for (const listener of this.deviceCountListeners) {
      listener(count);
    }
  }

  private notifyMessageListeners() {
    for (const listener of this.messageListeners) {
      listener(this.store);
    }
  }

  public async sendMessage(channelId: string, message: ChatMessage): Promise<void> {
    // 1. Optimistic local append
    this.handleSocketMessage(channelId, message, false);

    // 2. Direct real-time socket emit
    if (this.socketEmit) {
      this.socketEmit('chat:message', { channelId, message });
    }

    // 3. HTTP API persistence
    try {
      await api.chat.sendMessage(channelId, {
        text: message.text,
        codeSnippet: message.codeSnippet,
        codeLanguage: 'sql',
        clientMsgId: message.id,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar,
        senderRole: message.senderRole
      });
    } catch {
      // server handles or retries
    }
  }

  public async toggleReaction(channelId: string, messageId: string, emoji: string, userName: string): Promise<void> {
    try {
      await api.chat.toggleReaction(messageId, emoji);
    } catch {
      // ignore
    }
  }

  public async getNetworkInfo(): Promise<NetworkInfo> {
    try {
      return await api.system.getNetworkInfo();
    } catch {
      const host = window.location.hostname || 'localhost';
      const port = parseInt(window.location.port || '3000', 10);
      return {
        hostIp: host,
        port: 4000,
        clientPort: port,
        connectedCount: this.connectedCount,
        networkUrl: `${window.location.protocol}//${host}:${port}/?tab=study_chat`
      };
    }
  }
}

export const liveChatManager = new LiveChatManager();
