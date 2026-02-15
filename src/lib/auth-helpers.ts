import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export interface AuthUser {
  id: string
  email: string
  profile: Profile
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new AuthError('Authentication required', 401)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    throw new AuthError('Profile not found', 404)
  }

  if (profile.status === 'suspended' || profile.status === 'banned') {
    throw new AuthError(
      `Your account has been ${profile.status}. Please contact support.`,
      403
    )
  }

  if (profile.status === 'deactivated') {
    throw new AuthError('Your account has been deactivated.', 403)
  }

  return {
    id: user.id,
    email: user.email!,
    profile,
  }
}

export async function requireAdmin(): Promise<AuthUser> {
  const authUser = await requireAuth()

  if (authUser.profile.role !== 'admin') {
    throw new AuthError('Admin access required', 403)
  }

  return authUser
}

export async function requireModerator(): Promise<AuthUser> {
  const authUser = await requireAuth()

  if (authUser.profile.role !== 'admin' && authUser.profile.role !== 'moderator') {
    throw new AuthError('Moderator access required', 403)
  }

  return authUser
}

export function handleAuthError(error: unknown): Response {
  if (error instanceof AuthError) {
    return Response.json(
      { error: error.message },
      { status: error.statusCode }
    )
  }

  console.error('Unexpected auth error:', error)
  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
