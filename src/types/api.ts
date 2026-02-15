// ============================================================
// Core API Types
// ============================================================

export interface ApiError {
  message: string;
  code?: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  meta: {
    cursor: string | null;
    hasMore: boolean;
    total?: number;
  };
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
}

// ============================================================
// Auth Types
// ============================================================

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
  subscription: Subscription | null;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

// ============================================================
// Profile Types
// ============================================================

export interface Profile {
  id: string;
  userId: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  interests: string[];
  age: number | null;
  location: string | null;
  revealLevel: number;
  gamesPlayed: number;
  connectionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileListItem {
  id: string;
  userId: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  interests: string[];
  revealLevel: number;
  gamesPlayed: number;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  interests?: string[];
  age?: number;
  location?: string;
}

export interface ProfilesListParams {
  page?: number;
  pageSize?: number;
  interests?: string[];
}

// ============================================================
// Onboarding Types
// ============================================================

export type OnboardingStep =
  | 'welcome'
  | 'profile_setup'
  | 'interests'
  | 'preferences'
  | 'tutorial'
  | 'first_match';

export interface OnboardingProgress {
  userId: string;
  completedSteps: OnboardingStep[];
  currentStep: OnboardingStep;
  isComplete: boolean;
}

export interface CompleteStepRequest {
  step: OnboardingStep;
}

// ============================================================
// Match Types
// ============================================================

export type MatchStatus = 'pending' | 'liked' | 'passed' | 'matched' | 'expired';

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedProfile: ProfileListItem;
  score: number;
  status: MatchStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MatchDetail {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedProfile: ProfileListItem;
  score: number;
  scoreBreakdown: {
    interestOverlap: number;
    activityLevel: number;
    gameCompatibility: number;
    responseRate: number;
  };
  status: MatchStatus;
  gamesPlayedTogether: number;
  revealLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchesListParams {
  status?: MatchStatus;
  sort?: 'score' | 'recent' | 'activity';
  page?: number;
  pageSize?: number;
}

export interface UpdateMatchRequest {
  status: 'liked' | 'passed';
}

export interface MatchStats {
  totalMatches: number;
  mutualMatches: number;
  pendingMatches: number;
  gamesPlayedWithMatches: number;
  averageMatchScore: number;
  topInterests: string[];
}

export interface MatchEvent {
  type: 'new_match' | 'match_update' | 'match_expired';
  matchId: string;
  data: Match;
}

// ============================================================
// Preferences Types
// ============================================================

export interface MatchPreferences {
  userId: string;
  ageRange: { min: number; max: number };
  maxDistance: number | null;
  interests: string[];
  gameTypes: string[];
  activityLevel: 'casual' | 'moderate' | 'active';
  updatedAt: string;
}

export interface UpdatePreferencesRequest {
  ageRange?: { min: number; max: number };
  maxDistance?: number | null;
  interests?: string[];
  gameTypes?: string[];
  activityLevel?: 'casual' | 'moderate' | 'active';
}

// ============================================================
// Game Types
// ============================================================

export type GameCategory = 'puzzle' | 'trivia' | 'word' | 'strategy' | 'creative' | 'casual';

export interface Game {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: GameCategory;
  thumbnailUrl: string;
  minPlayers: number;
  maxPlayers: number;
  estimatedDuration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface GamesListParams {
  category?: GameCategory;
  difficulty?: 'easy' | 'medium' | 'hard';
  search?: string;
}

// ============================================================
// Game Session Types
// ============================================================

export type GameSessionStatus = 'waiting' | 'active' | 'paused' | 'completed' | 'abandoned';

export interface GameSession {
  id: string;
  gameId: string;
  game: Game;
  matchId: string;
  players: {
    userId: string;
    profile: ProfileListItem;
    score: number;
    isReady: boolean;
  }[];
  status: GameSessionStatus;
  state: Record<string, unknown>;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
}

export interface CreateGameSessionRequest {
  gameId: string;
  matchId: string;
}

export interface UpdateGameSessionRequest {
  state?: Record<string, unknown>;
  playerScore?: number;
  status?: GameSessionStatus;
}

export interface EndGameSessionResponse {
  session: GameSession;
  results: {
    winnerId: string | null;
    scores: { userId: string; score: number }[];
    xpEarned: { userId: string; xp: number }[];
    revealProgress: number;
  };
}

export interface GameSessionHistoryParams {
  page?: number;
  pageSize?: number;
  gameId?: string;
  status?: GameSessionStatus;
}

// ============================================================
// Chat Types
// ============================================================

export interface ChatChannel {
  id: string;
  matchId: string;
  participants: {
    userId: string;
    profile: ProfileListItem;
  }[];
  lastMessage: ChatMessage | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  type: 'text' | 'system' | 'game_invite';
  metadata: Record<string, unknown> | null;
  isModerated: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  type?: 'text' | 'game_invite';
  metadata?: Record<string, unknown>;
}

export interface MessagesListParams {
  cursor?: string;
  limit?: number;
}

// ============================================================
// Leaderboard Types
// ============================================================

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  profile: ProfileListItem;
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
}

export interface LeaderboardParams {
  period?: LeaderboardPeriod;
  cursor?: string;
  limit?: number;
}

export interface LeaderboardMyStats {
  rank: number;
  score: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  percentile: number;
  streaks: {
    current: number;
    best: number;
  };
}

// ============================================================
// Achievement Types
// ============================================================

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  xpReward: number;
  unlockedAt: string | null;
  progress: number;
  target: number;
}

// ============================================================
// Reveal Types
// ============================================================

export interface RevealStatus {
  userId: string;
  targetUserId: string;
  level: number;
  maxLevel: number;
  unlockedFields: string[];
  nextUnlockAt: number;
  gamesRequired: number;
  gamesPlayed: number;
}

export interface InitiateRevealRequest {
  targetUserId: string;
}

export interface RevealResponse {
  reveal: RevealStatus;
  newlyUnlockedFields: string[];
}

// ============================================================
// Report Types
// ============================================================

export type ReportReason =
  | 'harassment'
  | 'inappropriate_content'
  | 'spam'
  | 'cheating'
  | 'impersonation'
  | 'other';

export type ReportTargetType = 'user' | 'message' | 'content';

export interface SubmitReportRequest {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
}

// ============================================================
// Notification Types
// ============================================================

export type NotificationType =
  | 'match'
  | 'message'
  | 'game_invite'
  | 'achievement'
  | 'reveal'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsListParams {
  page?: number;
  pageSize?: number;
  unreadOnly?: boolean;
}

export interface MarkNotificationsReadRequest {
  notificationIds: string[];
}

// ============================================================
// Billing Types
// ============================================================

export interface BillingPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  isPopular: boolean;
  stripePriceId: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: BillingPlan;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  usage: {
    matchesUsed: number;
    matchesLimit: number;
    gamesPlayed: number;
    gamesLimit: number;
  };
}

export interface CheckoutRequest {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResponse {
  url: string;
  sessionId: string;
}

export interface PortalRequest {
  returnUrl?: string;
}

export interface PortalResponse {
  url: string;
}

// ============================================================
// Admin Types
// ============================================================

export interface AdminUsersListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: 'user' | 'admin' | 'moderator';
  status?: 'active' | 'suspended' | 'banned';
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
  profile: Profile | null;
  subscription: Subscription | null;
  reportsCount: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface ModerationQueueParams {
  status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  type?: ReportTargetType;
  page?: number;
  pageSize?: number;
}

export interface ModerationItem {
  id: string;
  report: Report;
  reporter: ProfileListItem;
  target: {
    type: ReportTargetType;
    id: string;
    content: Record<string, unknown>;
    user: ProfileListItem;
  };
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  assignedTo: string | null;
  createdAt: string;
}

export interface ModerationActionRequest {
  reportId: string;
  action: 'warn' | 'mute' | 'suspend' | 'ban' | 'dismiss';
  reason: string;
  duration?: number;
}

export interface Appeal {
  id: string;
  userId: string;
  user: ProfileListItem;
  reportId: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  reviewedBy: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppealDecisionRequest {
  status: 'approved' | 'denied';
  reviewNote: string;
}

export interface AppealsListParams {
  status?: 'pending' | 'approved' | 'denied';
  page?: number;
  pageSize?: number;
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  granularity?: 'day' | 'week' | 'month';
}

export interface Analytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalMatches: number;
  totalGamesPlayed: number;
  averageSessionDuration: number;
  revenue: number;
  dailyMetrics: {
    date: string;
    newUsers: number;
    activeUsers: number;
    matches: number;
    gamesPlayed: number;
    revenue: number;
  }[];
}

// ============================================================
// Contact Types
// ============================================================

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}
