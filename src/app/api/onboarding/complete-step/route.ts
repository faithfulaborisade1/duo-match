import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { completeStepSchema } from '@/lib/validations/onboarding';
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api-utils';

const STEP_MAP: Record<string, number> = {
  profile_basics: 1,
  preferences: 2,
  interests: 3,
  game_tutorial: 4,
  first_match: 5,
};

const TOTAL_STEPS = 5;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = completeStepSchema.safeParse(body);
    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { step } = parsed.data;
    const stepNumber = STEP_MAP[step];

    // Get current onboarding state
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_step')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return errorResponse('Profile not found', 404);
    }

    if (profile.onboarding_completed) {
      return errorResponse('Onboarding already completed', 400);
    }

    const currentStep = profile.onboarding_step || 1;

    // Must complete steps in order
    if (stepNumber !== currentStep) {
      return errorResponse(`Please complete step ${currentStep} first`, 400);
    }

    const nextStep = currentStep + 1;
    const isCompleted = nextStep > TOTAL_STEPS;

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        onboarding_step: isCompleted ? TOTAL_STEPS : nextStep,
        onboarding_completed: isCompleted,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('onboarding_completed, onboarding_step')
      .single();

    if (updateError) {
      return errorResponse('Failed to update onboarding progress', 500);
    }

    return successResponse({
      completed: updatedProfile.onboarding_completed,
      currentStep: updatedProfile.onboarding_step,
      totalSteps: TOTAL_STEPS,
      justCompleted: step,
    });
  } catch (error) {
    console.error('Onboarding complete step error:', error);
    return errorResponse('Internal server error', 500);
  }
}
