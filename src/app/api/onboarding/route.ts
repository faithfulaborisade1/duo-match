import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-utils';

const ONBOARDING_STEPS = [
  { step: 1, key: 'profile_basics', label: 'Set up your profile', description: 'Add your display name and basic info' },
  { step: 2, key: 'preferences', label: 'Set your preferences', description: 'Tell us who you want to meet' },
  { step: 3, key: 'interests', label: 'Pick your interests', description: 'Choose topics and activities you enjoy' },
  { step: 4, key: 'game_tutorial', label: 'Play the tutorial', description: 'Learn how duomatch games work' },
  { step: 5, key: 'first_match', label: 'Get your first match', description: 'The Referee will find your first duo' },
];

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_step')
      .eq('id', user.id)
      .single();

    if (error) {
      return errorResponse('Profile not found', 404);
    }

    const currentStep = profile.onboarding_step || 1;

    return successResponse({
      completed: profile.onboarding_completed,
      currentStep,
      totalSteps: ONBOARDING_STEPS.length,
      steps: ONBOARDING_STEPS.map((s) => ({
        ...s,
        completed: s.step < currentStep,
        current: s.step === currentStep,
      })),
    });
  } catch (error) {
    console.error('Onboarding error:', error);
    return errorResponse('Internal server error', 500);
  }
}
