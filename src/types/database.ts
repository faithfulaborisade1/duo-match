export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          role: 'user' | 'moderator' | 'admin'
          status: 'active' | 'suspended' | 'banned' | 'deactivated'
          onboarding_completed: boolean
          onboarding_step: number
          date_of_birth: string | null
          gender: string | null
          location: string | null
          timezone: string | null
          last_active_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'moderator' | 'admin'
          status?: 'active' | 'suspended' | 'banned' | 'deactivated'
          onboarding_completed?: boolean
          onboarding_step?: number
          date_of_birth?: string | null
          gender?: string | null
          location?: string | null
          timezone?: string | null
          last_active_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'moderator' | 'admin'
          status?: 'active' | 'suspended' | 'banned' | 'deactivated'
          onboarding_completed?: boolean
          onboarding_step?: number
          date_of_birth?: string | null
          gender?: string | null
          location?: string | null
          timezone?: string | null
          last_active_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'free' | 'plus' | 'premium'
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive'
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'free' | 'plus' | 'premium'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'free' | 'plus' | 'premium'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'inactive'
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      match_preferences: {
        Row: {
          id: string
          user_id: string
          age_min: number
          age_max: number
          preferred_genders: string[]
          interests: string[]
          game_preferences: string[]
          connection_type: 'friendship' | 'romantic' | 'both'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age_min?: number
          age_max?: number
          preferred_genders?: string[]
          interests?: string[]
          game_preferences?: string[]
          connection_type?: 'friendship' | 'romantic' | 'both'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age_min?: number
          age_max?: number
          preferred_genders?: string[]
          interests?: string[]
          game_preferences?: string[]
          connection_type?: 'friendship' | 'romantic' | 'both'
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          user_a_id: string
          user_b_id: string
          status: 'pending' | 'accepted' | 'declined' | 'expired' | 'completed'
          compatibility_score: number
          referee_intro: string | null
          matched_at: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_a_id: string
          user_b_id: string
          status?: 'pending' | 'accepted' | 'declined' | 'expired' | 'completed'
          compatibility_score?: number
          referee_intro?: string | null
          matched_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_a_id?: string
          user_b_id?: string
          status?: 'pending' | 'accepted' | 'declined' | 'expired' | 'completed'
          compatibility_score?: number
          referee_intro?: string | null
          matched_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      match_scores: {
        Row: {
          id: string
          match_id: string
          game_session_id: string
          cooperation_score: number
          performance_score: number
          duo_score: number
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          game_session_id: string
          cooperation_score?: number
          performance_score?: number
          duo_score?: number
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          game_session_id?: string
          cooperation_score?: number
          performance_score?: number
          duo_score?: number
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          short_description: string | null
          rules: string | null
          min_players: number
          max_players: number
          estimated_duration_minutes: number
          category: string
          thumbnail_url: string | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description: string
          short_description?: string | null
          rules?: string | null
          min_players?: number
          max_players?: number
          estimated_duration_minutes?: number
          category?: string
          thumbnail_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          short_description?: string | null
          rules?: string | null
          min_players?: number
          max_players?: number
          estimated_duration_minutes?: number
          category?: string
          thumbnail_url?: string | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      game_sessions: {
        Row: {
          id: string
          game_id: string
          match_id: string
          player_a_id: string
          player_b_id: string
          status: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          game_state: Json | null
          started_at: string | null
          ended_at: string | null
          duration_seconds: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          game_id: string
          match_id: string
          player_a_id: string
          player_b_id: string
          status?: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          game_state?: Json | null
          started_at?: string | null
          ended_at?: string | null
          duration_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          match_id?: string
          player_a_id?: string
          player_b_id?: string
          status?: 'waiting' | 'in_progress' | 'completed' | 'abandoned'
          game_state?: Json | null
          started_at?: string | null
          ended_at?: string | null
          duration_seconds?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          channel_id: string
          sender_id: string
          content: string
          message_type: 'text' | 'system' | 'game_event'
          is_flagged: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          sender_id: string
          content: string
          message_type?: 'text' | 'system' | 'game_event'
          is_flagged?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          sender_id?: string
          content?: string
          message_type?: 'text' | 'system' | 'game_event'
          is_flagged?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_channels: {
        Row: {
          id: string
          match_id: string
          user_a_id: string
          user_b_id: string
          is_active: boolean
          unlocked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          user_a_id: string
          user_b_id: string
          is_active?: boolean
          unlocked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          user_a_id?: string
          user_b_id?: string
          is_active?: boolean
          unlocked_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leaderboard_entries: {
        Row: {
          id: string
          user_id: string
          total_score: number
          cooperation_score: number
          games_played: number
          rank: number | null
          tier: string | null
          season: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_score?: number
          cooperation_score?: number
          games_played?: number
          rank?: number | null
          tier?: string | null
          season?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_score?: number
          cooperation_score?: number
          games_played?: number
          rank?: number | null
          tier?: string | null
          season?: string
          created_at?: string
          updated_at?: string
        }
      }
      duo_leaderboard_entries: {
        Row: {
          id: string
          user_a_id: string
          user_b_id: string
          duo_score: number
          games_played: number
          rank: number | null
          season: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_a_id: string
          user_b_id: string
          duo_score?: number
          games_played?: number
          rank?: number | null
          season?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_a_id?: string
          user_b_id?: string
          duo_score?: number
          games_played?: number
          rank?: number | null
          season?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          total_games_played: number
          total_matches: number
          total_cooperation_score: number
          average_duo_score: number
          win_streak: number
          longest_win_streak: number
          favorite_game_id: string | null
          play_streak_days: number
          last_played_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_games_played?: number
          total_matches?: number
          total_cooperation_score?: number
          average_duo_score?: number
          win_streak?: number
          longest_win_streak?: number
          favorite_game_id?: string | null
          play_streak_days?: number
          last_played_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_games_played?: number
          total_matches?: number
          total_cooperation_score?: number
          average_duo_score?: number
          win_streak?: number
          longest_win_streak?: number
          favorite_game_id?: string | null
          play_streak_days?: number
          last_played_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          icon_url: string | null
          category: string
          threshold: number
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description: string
          icon_url?: string | null
          category?: string
          threshold?: number
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          icon_url?: string | null
          category?: string
          threshold?: number
          points?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
      point_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string | null
          reference_id: string | null
          reference_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: string
          description?: string | null
          reference_id?: string | null
          reference_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: string
          description?: string | null
          reference_id?: string | null
          reference_type?: string | null
          created_at?: string
        }
      }
      profile_reveals: {
        Row: {
          id: string
          revealer_id: string
          target_id: string
          reveal_level: 'stats' | 'bio' | 'voice' | 'photo'
          is_mutual: boolean
          created_at: string
        }
        Insert: {
          id?: string
          revealer_id: string
          target_id: string
          reveal_level: 'stats' | 'bio' | 'voice' | 'photo'
          is_mutual?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          revealer_id?: string
          target_id?: string
          reveal_level?: 'stats' | 'bio' | 'voice' | 'photo'
          is_mutual?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          body: string
          data: Json | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          body: string
          data?: Json | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          body?: string
          data?: Json | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string
          reason: string
          description: string | null
          status: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          reference_type: string | null
          reference_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id: string
          reason: string
          description?: string | null
          status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          reference_type?: string | null
          reference_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          reported_user_id?: string
          reason?: string
          description?: string | null
          status?: 'pending' | 'reviewing' | 'resolved' | 'dismissed'
          reference_type?: string | null
          reference_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      moderation_actions: {
        Row: {
          id: string
          moderator_id: string
          target_user_id: string
          action: 'warning' | 'mute' | 'suspend' | 'ban' | 'dismiss'
          reason: string
          report_id: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          moderator_id: string
          target_user_id: string
          action: 'warning' | 'mute' | 'suspend' | 'ban' | 'dismiss'
          reason: string
          report_id?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          moderator_id?: string
          target_user_id?: string
          action?: 'warning' | 'mute' | 'suspend' | 'ban' | 'dismiss'
          reason?: string
          report_id?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      user_suspensions: {
        Row: {
          id: string
          user_id: string
          moderation_action_id: string
          reason: string
          suspended_at: string
          expires_at: string | null
          lifted_at: string | null
          is_permanent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          moderation_action_id: string
          reason: string
          suspended_at?: string
          expires_at?: string | null
          lifted_at?: string | null
          is_permanent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          moderation_action_id?: string
          reason?: string
          suspended_at?: string
          expires_at?: string | null
          lifted_at?: string | null
          is_permanent?: boolean
          created_at?: string
        }
      }
      appeals: {
        Row: {
          id: string
          user_id: string
          suspension_id: string
          reason: string
          status: 'pending' | 'approved' | 'denied'
          reviewer_id: string | null
          reviewer_notes: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          suspension_id: string
          reason: string
          status?: 'pending' | 'approved' | 'denied'
          reviewer_id?: string | null
          reviewer_notes?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          suspension_id?: string
          reason?: string
          status?: 'pending' | 'approved' | 'denied'
          reviewer_id?: string | null
          reviewer_notes?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      content_flags: {
        Row: {
          id: string
          content_type: string
          content_id: string
          flagged_by: 'ai' | 'user' | 'system'
          reason: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          status: 'pending' | 'reviewed' | 'dismissed'
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          content_type: string
          content_id: string
          flagged_by: 'ai' | 'user' | 'system'
          reason: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'pending' | 'reviewed' | 'dismissed'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          content_type?: string
          content_id?: string
          flagged_by?: 'ai' | 'user' | 'system'
          reason?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'pending' | 'reviewed' | 'dismissed'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      daily_metrics: {
        Row: {
          id: string
          date: string
          new_signups: number
          active_users: number
          games_played: number
          matches_created: number
          messages_sent: number
          reports_filed: number
          revenue_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          new_signups?: number
          active_users?: number
          games_played?: number
          matches_created?: number
          messages_sent?: number
          reports_filed?: number
          revenue_cents?: number
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          new_signups?: number
          active_users?: number
          games_played?: number
          matches_created?: number
          messages_sent?: number
          reports_filed?: number
          revenue_cents?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
