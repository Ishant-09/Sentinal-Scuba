let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiClient<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (!options.skipAuth && inMemoryAccessToken) {
    headers.set('Authorization', `Bearer ${inMemoryAccessToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include' // include httpOnly refresh token cookie
  };

  let response = await fetch(url, config);

  // If 401 Unauthorized, attempt token refresh and retry
  if (response.status === 401 && !options.skipAuth && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch('/api/v1/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          inMemoryAccessToken = data.accessToken;
          isRefreshing = false;
          onRefreshed(data.accessToken);
        } else {
          isRefreshing = false;
          inMemoryAccessToken = null;
          throw new Error('Session expired');
        }
      } catch (err) {
        isRefreshing = false;
        inMemoryAccessToken = null;
        throw err;
      }
    }

    // Wait for ongoing refresh
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(async (newToken) => {
        try {
          headers.set('Authorization', `Bearer ${newToken}`);
          const retryRes = await fetch(url, { ...options, headers, credentials: 'include' });
          const retryData = await retryRes.json();
          if (!retryRes.ok) throw retryData.error || retryData;
          resolve(retryData);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  const data = await response.json();
  if (!response.ok) {
    throw data.error || data;
  }

  return data;
}

// API Resource Endpoints
export const api = {
  auth: {
    login: (body: any) => apiClient('/auth/login', { method: 'POST', body: JSON.stringify(body), skipAuth: true }),
    usernameLogin: (username: string) =>
      apiClient<{ user: any; accessToken: string }>('/auth/username-login', {
        method: 'POST',
        body: JSON.stringify({ username }),
        skipAuth: true
      }),
    register: (body: any) => apiClient('/auth/register', { method: 'POST', body: JSON.stringify(body), skipAuth: true }),
    refresh: () => apiClient('/auth/refresh', { method: 'POST', skipAuth: true }),
    logout: () => apiClient('/auth/logout', { method: 'POST' }),
    logoutAll: () => apiClient('/auth/logout-all', { method: 'POST' }),
    getSessions: () => apiClient('/auth/sessions'),
    revokeSession: (id: string) => apiClient(`/auth/sessions/${id}`, { method: 'DELETE' })
  },
  users: {
    getMe: () => apiClient<{ user: any }>('/users/me'),
    updateMe: (body: any) => apiClient<{ user: any }>('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
    updateSettings: (body: any) => apiClient<{ settings: any }>('/users/me/settings', { method: 'PATCH', body: JSON.stringify(body) }),
    getStats: () => apiClient<{ stats: any }>('/users/me/stats'),
    getPublic: (id: string) => apiClient<{ user: any }>(`/users/${id}`)
  },
  guilds: {
    getMyGuilds: () => apiClient<{ guilds: any[] }>('/guilds/mine'),
    getGuild: (id: string) => apiClient<{ guild: any }>(`/guilds/${id}`),
    getMembers: (id: string) => apiClient<{ members: any[] }>(`/guilds/${id}/members`),
    createGuild: (body: any) => apiClient<{ guild: any }>('/guilds', { method: 'POST', body: JSON.stringify(body) }),
    joinGuild: (inviteCode: string) => apiClient<{ guild: any }>('/guilds/join', { method: 'POST', body: JSON.stringify({ inviteCode }) }),
    getActivity: (id: string) => apiClient<{ activities: any[] }>(`/guilds/${id}/activity`),
    rotateInviteCode: (id: string) => apiClient<{ inviteCode: string }>(`/guilds/${id}/invite-code/rotate`, { method: 'POST' })
  },
  quests: {
    getQuests: (track?: string) => apiClient<{ quests: any[] }>(`/quests${track ? `?track=${encodeURIComponent(track)}` : ''}`),
    getQuest: (id: string) => apiClient<{ quest: any }>(`/quests/${id}`),
    startQuest: (id: string) => apiClient(`/quests/${id}/start`, { method: 'POST' }),
    completeStep: (questId: string, stepIndex: number) => apiClient(`/quests/${questId}/steps/${stepIndex}/complete`, { method: 'POST' }),
    completeQuest: (questId: string) => apiClient(`/quests/${questId}/complete`, { method: 'POST' }),
    getChallenge: (questId: string) => apiClient<{ challenge: any }>(`/quests/${questId}/challenge`),
    attemptChallenge: (challengeId: string, selectedIndex: number) => apiClient(`/quests/challenges/${challengeId}/attempt`, { method: 'POST', body: JSON.stringify({ selectedIndex }) })
  },
  studyRooms: {
    getRooms: () => apiClient<{ rooms: any[] }>('/study-rooms'),
    getRoom: (id: string) => apiClient<{ room: any }>(`/study-rooms/${id}`),
    createRoom: (body: any) => apiClient<{ room: any }>('/study-rooms', { method: 'POST', body: JSON.stringify(body) }),
    joinRoom: (id: string) => apiClient(`/study-rooms/${id}/join`, { method: 'POST' }),
    leaveRoom: (id: string) => apiClient(`/study-rooms/${id}/leave`, { method: 'POST' }),
    endRoom: (id: string) => apiClient(`/study-rooms/${id}`, { method: 'DELETE' }),
    updateTimer: (id: string, action: string, durationMinutes?: number) =>
      apiClient<{ timerState: any }>(`/study-rooms/${id}/timer`, { method: 'POST', body: JSON.stringify({ action, durationMinutes }) }),
    getTimer: (id: string) => apiClient<{ timerState: any }>(`/study-rooms/${id}/timer`),
    inviteFriends: (id: string, friends: string[], inviterName?: string) =>
      apiClient<{ success: boolean }>(`/study-rooms/${id}/invite`, { method: 'POST', body: JSON.stringify({ friends, inviterName }) }),
    getWhiteboard: (id: string) => apiClient<{ strokes: any[] }>(`/study-rooms/${id}/whiteboard`),
    getLivekitToken: (id: string) => apiClient<{ token: string; livekitUrl: string }>(`/study-rooms/${id}/livekit-token`, { method: 'POST' }),
    submitScore: (id: string, game: string, score: number) => apiClient(`/study-rooms/${id}/minigames/${game}/score`, { method: 'POST', body: JSON.stringify({ score }) })
  },
  chat: {
    getChannels: () => apiClient<{ channels: any[] }>('/chat/channels'),
    getMessages: (channelId: string, before?: string) => apiClient<{ messages: any[] }>(`/chat/${channelId}/messages${before ? `?before=${before}` : ''}`),
    sendMessage: (channelId: string, body: any) => apiClient(`/chat/${channelId}/messages`, { method: 'POST', body: JSON.stringify(body) }),
    toggleReaction: (messageId: string, emoji: string) => apiClient(`/chat/messages/${messageId}/reactions`, { method: 'POST', body: JSON.stringify({ emoji }) })
  },
  whispers: {
    getConversations: () => apiClient<{ conversations: any[] }>('/whispers'),
    getMessages: (memberId: string, before?: string) => apiClient<{ messages: any[] }>(`/whispers/${memberId}${before ? `?before=${before}` : ''}`),
    sendWhisper: (memberId: string, text: string) => apiClient(`/whispers/${memberId}`, { method: 'POST', body: JSON.stringify({ text }) }),
    markAsRead: (memberId: string) => apiClient(`/whispers/${memberId}/read`, { method: 'POST' })
  },
  boss: {
    getCurrent: () => apiClient<{ boss: any }>('/boss/current'),
    attack: (abilityName: string) => apiClient('/boss/attack', { method: 'POST', body: JSON.stringify({ abilityName }) }),
    getLogs: () => apiClient<{ logs: any[] }>('/boss/logs')
  },
  leaderboard: {
    getWeekly: (guildId?: string) => apiClient<{ leaderboard: any[] }>(`/leaderboard/weekly${guildId ? `?guildId=${guildId}` : ''}`)
  },
  achievements: {
    getAchievements: () => apiClient<{ achievements: any[] }>('/achievements'),
    getNotifications: () => apiClient<{ notifications: any[] }>('/achievements/notifications'),
    markNotificationRead: (id: string) => apiClient(`/achievements/notifications/${id}/read`, { method: 'POST' }),
    markAllNotificationsRead: () => apiClient('/achievements/notifications/read-all', { method: 'POST' })
  },
  friends: {
    getFriends: () => apiClient<{ members: any[] }>('/friends'),
    sendRequest: (userId: string) => apiClient(`/friends/${userId}`, { method: 'POST' }),
    acceptRequest: (userId: string) => apiClient(`/friends/${userId}/accept`, { method: 'POST' }),
    removeFriend: (userId: string) => apiClient(`/friends/${userId}`, { method: 'DELETE' })
  },
  search: {
    search: (q: string, type?: string) => apiClient<{ items: any[] }>(`/search?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ''}`)
  },
  system: {
    getNetworkInfo: () => apiClient<{ hostIp: string; port: number; clientPort: number; networkUrl: string; connectedCount: number }>('/system/network-info')
  }
};
