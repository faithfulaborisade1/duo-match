export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  profiles: {
    all: ['profiles'] as const,
    list: (params?: Record<string, unknown>) => ['profiles', 'list', params] as const,
    detail: (id: string) => ['profiles', 'detail', id] as const,
    me: ['profiles', 'me'] as const,
  },
  onboarding: {
    progress: ['onboarding', 'progress'] as const,
  },
  matches: {
    all: ['matches'] as const,
    list: (params?: Record<string, unknown>) => ['matches', 'list', params] as const,
    detail: (id: string) => ['matches', 'detail', id] as const,
    stats: ['matches', 'stats'] as const,
  },
  preferences: {
    all: ['preferences'] as const,
  },
  games: {
    all: ['games'] as const,
    list: (params?: Record<string, unknown>) => ['games', 'list', params] as const,
    detail: (slug: string) => ['games', 'detail', slug] as const,
  },
  gameSessions: {
    all: ['game-sessions'] as const,
    detail: (id: string) => ['game-sessions', 'detail', id] as const,
    history: (params?: Record<string, unknown>) => ['game-sessions', 'history', params] as const,
  },
  chat: {
    channels: ['chat', 'channels'] as const,
    messages: (channelId: string, params?: Record<string, unknown>) =>
      ['chat', 'messages', channelId, params] as const,
  },
  leaderboard: {
    all: ['leaderboard'] as const,
    list: (params?: Record<string, unknown>) => ['leaderboard', 'list', params] as const,
    me: ['leaderboard', 'me'] as const,
  },
  achievements: {
    all: ['achievements'] as const,
  },
  reveals: {
    status: (userId: string) => ['reveals', userId] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (params?: Record<string, unknown>) => ['notifications', 'list', params] as const,
  },
  billing: {
    plans: ['billing', 'plans'] as const,
    subscription: ['billing', 'subscription'] as const,
  },
  admin: {
    users: (params?: Record<string, unknown>) => ['admin', 'users', params] as const,
    moderationQueue: (params?: Record<string, unknown>) =>
      ['admin', 'moderation', 'queue', params] as const,
    appeals: (params?: Record<string, unknown>) =>
      ['admin', 'moderation', 'appeals', params] as const,
    analytics: (params?: Record<string, unknown>) => ['admin', 'analytics', params] as const,
  },
} as const;
