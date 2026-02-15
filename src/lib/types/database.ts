// ============================================================
// duomatch — TypeScript Types for All Database Tables
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================================
// Enum Types
// ============================================================

export type UserRole = 'user' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'banned' | 'deactivated';
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';

export type SubscriptionPlan = 'free' | 'plus' | 'premium';
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'paused';

export type ConnectionType = 'friendship' | 'romantic' | 'any';
export type PlayStyle = 'casual' | 'competitive' | 'social' | 'any';

export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'completed' | 'blocked';
export type MatchDecision = 'accept' | 'decline' | 'pending';

export type GameCategory = 'word' | 'trivia' | 'creative' | 'puzzle' | 'social';
export type GameDifficulty = 'easy' | 'medium' | 'hard';

export type GameSessionStatus = 'waiting' | 'in_progress' | 'completed' | 'abandoned' | 'timed_out';

export type ChatChannelStatus = 'active' | 'muted' | 'blocked' | 'archived';

export type MessageType = 'text' | 'system' | 'referee_prompt' | 'game_event' | 'image';

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all_time';
export type LeaderboardTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type AchievementCategory = 'games' | 'social' | 'cooperation' | 'streak' | 'milestone' | 'special';

export type PointTransactionType =
  | 'game_played'
  | 'achievement_earned'
  | 'cooperation_bonus'
  | 'streak_bonus'
  | 'daily_login'
  | 'referral'
  | 'admin_adjustment';

export type PointReferenceType = 'game_session' | 'achievement' | 'match' | 'admin';

export type RevealLevel = 'stats' | 'bio' | 'voice' | 'photo';

export type NotificationType =
  | 'match_new'
  | 'match_accepted'
  | 'match_expired'
  | 'game_invite'
  | 'game_started'
  | 'game_ended'
  | 'message_new'
  | 'reveal_received'
  | 'reveal_mutual'
  | 'achievement_earned'
  | 'streak_reminder'
  | 'system'
  | 'moderation';

export type ReportReason =
  | 'harassment'
  | 'inappropriate_content'
  | 'spam'
  | 'cheating'
  | 'underage'
  | 'impersonation'
  | 'threats'
  | 'other';

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export type ModerationActionType =
  | 'warning'
  | 'mute'
  | 'suspend'
  | 'ban'
  | 'unban'
  | 'unsuspend'
  | 'content_removal'
  | 'note';

export type AppealStatus = 'pending' | 'reviewing' | 'approved' | 'denied';

export type ContentFlagType = 'message' | 'profile_bio' | 'username' | 'image';
export type ContentFlaggedBy = 'ai' | 'user' | 'moderator';
export type ContentFlagSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ContentFlagStatus = 'pending' | 'reviewed' | 'actioned' | 'dismissed';

// ============================================================
// Table Row Types
// ============================================================

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  gender: Gender | null;
  location: string | null;
  timezone: string | null;
  role: UserRole;
  status: UserStatus;
  onboarding_completed: boolean;
  onboarding_step: number;
  last_active_at: string | null;
  streak_count: number;
  streak_last_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  trial_start: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchPreference {
  id: string;
  user_id: string;
  age_min: number;
  age_max: number;
  preferred_genders: string[];
  interests: string[];
  game_preferences: string[];
  connection_type: ConnectionType;
  play_style: PlayStyle;
  availability: Json;
  max_distance_km: number | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user_a_id: string;
  user_b_id: string;
  status: MatchStatus;
  compatibility_score: number;
  referee_intro: string | null;
  user_a_decision: MatchDecision | null;
  user_b_decision: MatchDecision | null;
  matched_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatchScore {
  id: string;
  match_id: string;
  cooperation_score: number;
  game_performance_score: number;
  duo_score: number;
  vibe_check: string | null;
  games_played: number;
  total_play_time_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string | null;
  rules: string | null;
  icon_url: string | null;
  cover_image_url: string | null;
  category: GameCategory;
  min_players: number;
  max_players: number;
  avg_duration_seconds: number;
  difficulty: GameDifficulty;
  is_active: boolean;
  sort_order: number;
  tags: string[];
  config: Json;
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  id: string;
  match_id: string;
  game_id: string;
  player_a_id: string;
  player_b_id: string;
  status: GameSessionStatus;
  game_state: Json;
  player_a_score: number;
  player_b_score: number;
  cooperation_rating: number | null;
  duration_seconds: number | null;
  started_at: string | null;
  ended_at: string | null;
  referee_prompts: Json;
  created_at: string;
  updated_at: string;
}

export interface ChatChannel {
  id: string;
  match_id: string;
  user_a_id: string;
  user_b_id: string;
  status: ChatChannelStatus;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  is_flagged: boolean;
  flag_reason: string | null;
  is_deleted: boolean;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  period: LeaderboardPeriod;
  period_start: string | null;
  cooperation_score: number;
  game_score: number;
  total_score: number;
  games_played: number;
  rank: number | null;
  tier: LeaderboardTier;
  created_at: string;
  updated_at: string;
}

export interface DuoLeaderboardEntry {
  id: string;
  match_id: string;
  user_a_id: string;
  user_b_id: string;
  period: LeaderboardPeriod;
  period_start: string | null;
  duo_score: number;
  games_played: number;
  rank: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_games_played: number;
  total_matches: number;
  total_play_time_seconds: number;
  avg_cooperation_score: number;
  avg_game_score: number;
  avg_duo_score: number;
  favorite_game_id: string | null;
  best_duo_partner_id: string | null;
  games_won: number;
  games_lost: number;
  games_drawn: number;
  current_streak: number;
  longest_streak: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon_url: string | null;
  category: AchievementCategory;
  points: number;
  requirement: Json;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  created_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: PointTransactionType;
  description: string | null;
  reference_id: string | null;
  reference_type: PointReferenceType | null;
  created_at: string;
}

export interface ProfileReveal {
  id: string;
  revealer_id: string;
  revealed_to_id: string;
  match_id: string;
  reveal_level: RevealLevel;
  is_mutual: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Json;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: ReportReason;
  description: string | null;
  evidence: Json;
  status: ReportStatus;
  resolved_by: string | null;
  resolution_note: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ModerationAction {
  id: string;
  moderator_id: string;
  target_user_id: string;
  report_id: string | null;
  action_type: ModerationActionType;
  reason: string;
  details: Json;
  expires_at: string | null;
  created_at: string;
}

export interface UserSuspension {
  id: string;
  user_id: string;
  moderation_action_id: string | null;
  reason: string;
  suspended_at: string;
  expires_at: string | null;
  is_permanent: boolean;
  is_active: boolean;
  lifted_at: string | null;
  lifted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Appeal {
  id: string;
  user_id: string;
  suspension_id: string;
  reason: string;
  status: AppealStatus;
  reviewed_by: string | null;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentFlag {
  id: string;
  content_type: ContentFlagType;
  content_id: string;
  flagged_by: ContentFlaggedBy;
  user_id: string | null;
  reason: string;
  severity: ContentFlagSeverity;
  status: ContentFlagStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface DailyMetric {
  id: string;
  date: string;
  new_signups: number;
  active_users: number;
  matches_created: number;
  matches_accepted: number;
  games_played: number;
  messages_sent: number;
  reports_filed: number;
  revenue_cents: number;
  avg_session_duration_seconds: number;
  avg_cooperation_score: number;
  churn_count: number;
  conversion_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Insert Types (for creating new rows)
// ============================================================

export interface ProfileInsert {
  id: string;
  email: string;
  username?: string | null;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: Gender | null;
  location?: string | null;
  timezone?: string | null;
  role?: UserRole;
  status?: UserStatus;
  onboarding_completed?: boolean;
  onboarding_step?: number;
  last_active_at?: string | null;
  streak_count?: number;
  streak_last_date?: string | null;
}

export interface ProfileUpdate {
  username?: string | null;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  date_of_birth?: string | null;
  gender?: Gender | null;
  location?: string | null;
  timezone?: string | null;
  role?: UserRole;
  status?: UserStatus;
  onboarding_completed?: boolean;
  onboarding_step?: number;
  last_active_at?: string | null;
  streak_count?: number;
  streak_last_date?: string | null;
}

export interface SubscriptionInsert {
  user_id: string;
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  trial_start?: string | null;
  trial_end?: string | null;
}

export interface SubscriptionUpdate {
  stripe_customer_id?: string | null;
  stripe_subscription_id?: string | null;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean;
  trial_start?: string | null;
  trial_end?: string | null;
}

export interface MatchPreferenceInsert {
  user_id: string;
  age_min?: number;
  age_max?: number;
  preferred_genders?: string[];
  interests?: string[];
  game_preferences?: string[];
  connection_type?: ConnectionType;
  play_style?: PlayStyle;
  availability?: Json;
  max_distance_km?: number | null;
}

export interface MatchPreferenceUpdate {
  age_min?: number;
  age_max?: number;
  preferred_genders?: string[];
  interests?: string[];
  game_preferences?: string[];
  connection_type?: ConnectionType;
  play_style?: PlayStyle;
  availability?: Json;
  max_distance_km?: number | null;
}

export interface MatchInsert {
  user_a_id: string;
  user_b_id: string;
  status?: MatchStatus;
  compatibility_score?: number;
  referee_intro?: string | null;
  user_a_decision?: MatchDecision | null;
  user_b_decision?: MatchDecision | null;
  matched_at?: string | null;
  expires_at?: string | null;
}

export interface MatchUpdate {
  status?: MatchStatus;
  compatibility_score?: number;
  referee_intro?: string | null;
  user_a_decision?: MatchDecision | null;
  user_b_decision?: MatchDecision | null;
  matched_at?: string | null;
  expires_at?: string | null;
}

export interface MatchScoreInsert {
  match_id: string;
  cooperation_score?: number;
  game_performance_score?: number;
  vibe_check?: string | null;
  games_played?: number;
  total_play_time_seconds?: number;
}

export interface MatchScoreUpdate {
  cooperation_score?: number;
  game_performance_score?: number;
  vibe_check?: string | null;
  games_played?: number;
  total_play_time_seconds?: number;
}

export interface GameInsert {
  slug: string;
  name: string;
  description: string;
  short_description?: string | null;
  rules?: string | null;
  icon_url?: string | null;
  cover_image_url?: string | null;
  category: GameCategory;
  min_players?: number;
  max_players?: number;
  avg_duration_seconds?: number;
  difficulty?: GameDifficulty;
  is_active?: boolean;
  sort_order?: number;
  tags?: string[];
  config?: Json;
}

export interface GameUpdate {
  slug?: string;
  name?: string;
  description?: string;
  short_description?: string | null;
  rules?: string | null;
  icon_url?: string | null;
  cover_image_url?: string | null;
  category?: GameCategory;
  min_players?: number;
  max_players?: number;
  avg_duration_seconds?: number;
  difficulty?: GameDifficulty;
  is_active?: boolean;
  sort_order?: number;
  tags?: string[];
  config?: Json;
}

export interface GameSessionInsert {
  match_id: string;
  game_id: string;
  player_a_id: string;
  player_b_id: string;
  status?: GameSessionStatus;
  game_state?: Json;
  player_a_score?: number;
  player_b_score?: number;
  cooperation_rating?: number | null;
  duration_seconds?: number | null;
  started_at?: string | null;
  ended_at?: string | null;
  referee_prompts?: Json;
}

export interface GameSessionUpdate {
  status?: GameSessionStatus;
  game_state?: Json;
  player_a_score?: number;
  player_b_score?: number;
  cooperation_rating?: number | null;
  duration_seconds?: number | null;
  started_at?: string | null;
  ended_at?: string | null;
  referee_prompts?: Json;
}

export interface ChatChannelInsert {
  match_id: string;
  user_a_id: string;
  user_b_id: string;
  status?: ChatChannelStatus;
  last_message_at?: string | null;
}

export interface ChatChannelUpdate {
  status?: ChatChannelStatus;
  last_message_at?: string | null;
}

export interface MessageInsert {
  channel_id: string;
  sender_id: string;
  content: string;
  message_type?: MessageType;
  is_flagged?: boolean;
  flag_reason?: string | null;
  is_deleted?: boolean;
  metadata?: Json;
}

export interface MessageUpdate {
  content?: string;
  is_flagged?: boolean;
  flag_reason?: string | null;
  is_deleted?: boolean;
  metadata?: Json;
}

export interface LeaderboardEntryInsert {
  user_id: string;
  period?: LeaderboardPeriod;
  period_start?: string | null;
  cooperation_score?: number;
  game_score?: number;
  total_score?: number;
  games_played?: number;
  rank?: number | null;
  tier?: LeaderboardTier;
}

export interface LeaderboardEntryUpdate {
  cooperation_score?: number;
  game_score?: number;
  total_score?: number;
  games_played?: number;
  rank?: number | null;
  tier?: LeaderboardTier;
}

export interface DuoLeaderboardEntryInsert {
  match_id: string;
  user_a_id: string;
  user_b_id: string;
  period?: LeaderboardPeriod;
  period_start?: string | null;
  duo_score?: number;
  games_played?: number;
  rank?: number | null;
}

export interface DuoLeaderboardEntryUpdate {
  duo_score?: number;
  games_played?: number;
  rank?: number | null;
}

export interface UserStatsInsert {
  user_id: string;
  total_games_played?: number;
  total_matches?: number;
  total_play_time_seconds?: number;
  avg_cooperation_score?: number;
  avg_game_score?: number;
  avg_duo_score?: number;
  favorite_game_id?: string | null;
  best_duo_partner_id?: string | null;
  games_won?: number;
  games_lost?: number;
  games_drawn?: number;
  current_streak?: number;
  longest_streak?: number;
  total_points?: number;
}

export interface UserStatsUpdate {
  total_games_played?: number;
  total_matches?: number;
  total_play_time_seconds?: number;
  avg_cooperation_score?: number;
  avg_game_score?: number;
  avg_duo_score?: number;
  favorite_game_id?: string | null;
  best_duo_partner_id?: string | null;
  games_won?: number;
  games_lost?: number;
  games_drawn?: number;
  current_streak?: number;
  longest_streak?: number;
  total_points?: number;
}

export interface AchievementInsert {
  slug: string;
  name: string;
  description: string;
  icon_url?: string | null;
  category: AchievementCategory;
  points?: number;
  requirement?: Json;
  is_active?: boolean;
  sort_order?: number;
}

export interface AchievementUpdate {
  slug?: string;
  name?: string;
  description?: string;
  icon_url?: string | null;
  category?: AchievementCategory;
  points?: number;
  requirement?: Json;
  is_active?: boolean;
  sort_order?: number;
}

export interface UserAchievementInsert {
  user_id: string;
  achievement_id: string;
  earned_at?: string;
}

export interface PointTransactionInsert {
  user_id: string;
  amount: number;
  type: PointTransactionType;
  description?: string | null;
  reference_id?: string | null;
  reference_type?: PointReferenceType | null;
}

export interface ProfileRevealInsert {
  revealer_id: string;
  revealed_to_id: string;
  match_id: string;
  reveal_level: RevealLevel;
  is_mutual?: boolean;
}

export interface NotificationInsert {
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Json;
  is_read?: boolean;
  read_at?: string | null;
}

export interface NotificationUpdate {
  is_read?: boolean;
  read_at?: string | null;
}

export interface ReportInsert {
  reporter_id: string;
  reported_user_id: string;
  reason: ReportReason;
  description?: string | null;
  evidence?: Json;
  status?: ReportStatus;
}

export interface ReportUpdate {
  status?: ReportStatus;
  resolved_by?: string | null;
  resolution_note?: string | null;
  resolved_at?: string | null;
}

export interface ModerationActionInsert {
  moderator_id: string;
  target_user_id: string;
  report_id?: string | null;
  action_type: ModerationActionType;
  reason: string;
  details?: Json;
  expires_at?: string | null;
}

export interface UserSuspensionInsert {
  user_id: string;
  moderation_action_id?: string | null;
  reason: string;
  suspended_at?: string;
  expires_at?: string | null;
  is_permanent?: boolean;
  is_active?: boolean;
}

export interface UserSuspensionUpdate {
  is_active?: boolean;
  lifted_at?: string | null;
  lifted_by?: string | null;
  expires_at?: string | null;
}

export interface AppealInsert {
  user_id: string;
  suspension_id: string;
  reason: string;
  status?: AppealStatus;
}

export interface AppealUpdate {
  status?: AppealStatus;
  reviewed_by?: string | null;
  review_note?: string | null;
  reviewed_at?: string | null;
}

export interface ContentFlagInsert {
  content_type: ContentFlagType;
  content_id: string;
  flagged_by?: ContentFlaggedBy;
  user_id?: string | null;
  reason: string;
  severity?: ContentFlagSeverity;
  status?: ContentFlagStatus;
  metadata?: Json;
}

export interface ContentFlagUpdate {
  status?: ContentFlagStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  severity?: ContentFlagSeverity;
}

export interface DailyMetricInsert {
  date: string;
  new_signups?: number;
  active_users?: number;
  matches_created?: number;
  matches_accepted?: number;
  games_played?: number;
  messages_sent?: number;
  reports_filed?: number;
  revenue_cents?: number;
  avg_session_duration_seconds?: number;
  avg_cooperation_score?: number;
  churn_count?: number;
  conversion_count?: number;
}

export interface DailyMetricUpdate {
  new_signups?: number;
  active_users?: number;
  matches_created?: number;
  matches_accepted?: number;
  games_played?: number;
  messages_sent?: number;
  reports_filed?: number;
  revenue_cents?: number;
  avg_session_duration_seconds?: number;
  avg_cooperation_score?: number;
  churn_count?: number;
  conversion_count?: number;
}

// ============================================================
// Supabase Database Type (for createClient<Database>)
// ============================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      subscriptions: {
        Row: Subscription;
        Insert: SubscriptionInsert;
        Update: SubscriptionUpdate;
      };
      match_preferences: {
        Row: MatchPreference;
        Insert: MatchPreferenceInsert;
        Update: MatchPreferenceUpdate;
      };
      matches: {
        Row: Match;
        Insert: MatchInsert;
        Update: MatchUpdate;
      };
      match_scores: {
        Row: MatchScore;
        Insert: MatchScoreInsert;
        Update: MatchScoreUpdate;
      };
      games: {
        Row: Game;
        Insert: GameInsert;
        Update: GameUpdate;
      };
      game_sessions: {
        Row: GameSession;
        Insert: GameSessionInsert;
        Update: GameSessionUpdate;
      };
      chat_channels: {
        Row: ChatChannel;
        Insert: ChatChannelInsert;
        Update: ChatChannelUpdate;
      };
      messages: {
        Row: Message;
        Insert: MessageInsert;
        Update: MessageUpdate;
      };
      leaderboard_entries: {
        Row: LeaderboardEntry;
        Insert: LeaderboardEntryInsert;
        Update: LeaderboardEntryUpdate;
      };
      duo_leaderboard_entries: {
        Row: DuoLeaderboardEntry;
        Insert: DuoLeaderboardEntryInsert;
        Update: DuoLeaderboardEntryUpdate;
      };
      user_stats: {
        Row: UserStats;
        Insert: UserStatsInsert;
        Update: UserStatsUpdate;
      };
      achievements: {
        Row: Achievement;
        Insert: AchievementInsert;
        Update: AchievementUpdate;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: UserAchievementInsert;
        Update: never;
      };
      point_transactions: {
        Row: PointTransaction;
        Insert: PointTransactionInsert;
        Update: never;
      };
      profile_reveals: {
        Row: ProfileReveal;
        Insert: ProfileRevealInsert;
        Update: never;
      };
      notifications: {
        Row: Notification;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
      };
      reports: {
        Row: Report;
        Insert: ReportInsert;
        Update: ReportUpdate;
      };
      moderation_actions: {
        Row: ModerationAction;
        Insert: ModerationActionInsert;
        Update: never;
      };
      user_suspensions: {
        Row: UserSuspension;
        Insert: UserSuspensionInsert;
        Update: UserSuspensionUpdate;
      };
      appeals: {
        Row: Appeal;
        Insert: AppealInsert;
        Update: AppealUpdate;
      };
      content_flags: {
        Row: ContentFlag;
        Insert: ContentFlagInsert;
        Update: ContentFlagUpdate;
      };
      daily_metrics: {
        Row: DailyMetric;
        Insert: DailyMetricInsert;
        Update: DailyMetricUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: { uid: string };
        Returns: boolean;
      };
      is_moderator_or_admin: {
        Args: { uid: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
}

// ============================================================
// Joined / Extended Types (for API responses)
// ============================================================

export interface MatchWithProfiles extends Match {
  user_a: Profile;
  user_b: Profile;
  match_score: MatchScore | null;
}

export interface MatchWithScore extends Match {
  match_score: MatchScore | null;
}

export interface GameSessionWithDetails extends GameSession {
  game: Game;
  player_a: Profile;
  player_b: Profile;
}

export interface ChatChannelWithLastMessage extends ChatChannel {
  last_message: Message | null;
  other_user: Profile;
  unread_count: number;
}

export interface MessageWithSender extends Message {
  sender: Profile;
}

export interface LeaderboardEntryWithProfile extends LeaderboardEntry {
  profile: Profile;
}

export interface DuoLeaderboardEntryWithProfiles extends DuoLeaderboardEntry {
  user_a: Profile;
  user_b: Profile;
}

export interface UserAchievementWithDetails extends UserAchievement {
  achievement: Achievement;
}

export interface ReportWithUsers extends Report {
  reporter: Profile;
  reported_user: Profile;
}

export interface AppealWithDetails extends Appeal {
  user: Profile;
  suspension: UserSuspension;
}

export interface ProfileWithStats extends Profile {
  user_stats: UserStats | null;
  subscription: Subscription | null;
}

export interface ContentFlagWithDetails extends ContentFlag {
  user: Profile | null;
  reviewed_by_user: Profile | null;
}

// ============================================================
// Pagination Types
// ============================================================

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}