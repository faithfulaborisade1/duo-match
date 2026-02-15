"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingProgress, useCompleteOnboardingStep } from "@/hooks/use-onboarding";
import { useUpdateMyProfile } from "@/hooks/use-profiles";
import { useUpdatePreferences } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  "Strategy Games", "Puzzle Solving", "Word Games", "Trivia", "Card Games",
  "Board Games", "Music", "Movies", "Books", "Cooking",
  "Travel", "Photography", "Art", "Technology", "Science",
  "Sports", "Fitness", "Nature", "History", "Philosophy",
];

const GAME_STYLE_OPTIONS = [
  { id: "competitive", label: "Competitive", description: "I love a good challenge" },
  { id: "cooperative", label: "Cooperative", description: "Teamwork makes the dream work" },
  { id: "casual", label: "Casual", description: "Just here to have fun" },
  { id: "strategic", label: "Strategic", description: "I think 5 moves ahead" },
];

const AGE_RANGE_OPTIONS = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55+", label: "55+" },
];

interface OnboardingData {
  displayName: string;
  bio: string;
  interests: string[];
  gameStyles: string[];
  ageRange: string;
  matchGoal: string;
}

export function OnboardingWizard() {
  const router = useRouter();
  const { data: progress, isLoading, isError } = useOnboardingProgress();
  const completeStep = useCompleteOnboardingStep();
  const updateProfile = useUpdateMyProfile();
  const updatePreferences = useUpdatePreferences();

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    displayName: "",
    bio: "",
    interests: [],
    gameStyles: [],
    ageRange: "",
    matchGoal: "",
  });

  const steps = [
    { id: "welcome", title: "Welcome to duomatch", description: "Let's get you set up" },
    { id: "profile", title: "Create your profile", description: "Tell us a bit about yourself" },
    { id: "interests", title: "Pick your interests", description: "Select at least 3 interests" },
    { id: "game-style", title: "Your play style", description: "How do you like to play?" },
    { id: "preferences", title: "Match preferences", description: "Who would you like to connect with?" },
    { id: "complete", title: "You're all set!", description: "Time to start matching" },
  ];

  const toggleInterest = useCallback((interest: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }, []);

  const toggleGameStyle = useCallback((style: string) => {
    setData((prev) => ({
      ...prev,
      gameStyles: prev.gameStyles.includes(style)
        ? prev.gameStyles.filter((s) => s !== style)
        : [...prev.gameStyles, style],
    }));
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return data.displayName.trim().length >= 2;
      case 2:
        return data.interests.length >= 3;
      case 3:
        return data.gameStyles.length >= 1;
      case 4:
        return data.ageRange !== "" && data.matchGoal !== "";
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const stepId = steps[currentStep].id;

    if (currentStep === 1) {
      updateProfile.mutate({ bio: data.bio } as any);
    }

    if (currentStep === 4) {
      updatePreferences.mutate({} as any);
    }

    completeStep.mutate(
      { stepId },
      {
        onSuccess: () => {
          if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
          }
        },
      }
    );
  };

  const handleFinish = () => {
    completeStep.mutate(
      { stepId: "complete" },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <Alert variant="error">Failed to load onboarding. Please refresh the page.</Alert>
      </div>
    );
  }

  const progressPercent = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Back
              </button>
            )}
          </div>
          <ProgressBar value={progressPercent} variant="primary" size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{steps[currentStep].title}</h1>
            <p className="mt-2 text-neutral-600">{steps[currentStep].description}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-neutral-900">Connect through play</h2>
                  <p className="text-neutral-600 max-w-md mx-auto">
                    duomatch pairs you with people who share your interests, then lets you build real connections through cooperative two-player games. No swiping, no curated photos — just genuine interaction.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-xl bg-primary-50">
                    <div className="text-2xl mb-2">🎯</div>
                    <h3 className="font-medium text-neutral-900 text-sm">Smart Matching</h3>
                    <p className="text-xs text-neutral-600 mt-1">AI finds your ideal play partners</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary-50">
                    <div className="text-2xl mb-2">🎮</div>
                    <h3 className="font-medium text-neutral-900 text-sm">Play Together</h3>
                    <p className="text-xs text-neutral-600 mt-1">Cooperative games break the ice</p>
                  </div>
                  <div className="p-4 rounded-xl bg-success-50">
                    <div className="text-2xl mb-2">🤝</div>
                    <h3 className="font-medium text-neutral-900 text-sm">Real Connections</h3>
                    <p className="text-xs text-neutral-600 mt-1">Profiles reveal as you interact</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Profile */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="onboard-name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Display name
                  </label>
                  <Input
                    id="onboard-name"
                    type="text"
                    placeholder="What should people call you?"
                    value={data.displayName}
                    onChange={(e) => setData((prev) => ({ ...prev, displayName: e.target.value }))}
                  />
                  <p className="text-xs text-neutral-500 mt-1">This is how other players will see you</p>
                </div>

                <div>
                  <label htmlFor="onboard-bio" className="block text-sm font-medium text-neutral-700 mb-1">
                    Short bio <span className="text-neutral-400">(optional)</span>
                  </label>
                  <Textarea
                    id="onboard-bio"
                    placeholder="Tell us something interesting about yourself..."
                    value={data.bio}
                    onChange={(e) => setData((prev) => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                  <p className="text-xs text-neutral-500 mt-1">{data.bio.length}/200 characters</p>
                </div>
              </div>
            )}

            {/* Step 2: Interests */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">Select at least 3 interests to help us find your best matches.</p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                        data.interests.includes(interest)
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-neutral-700 border-neutral-300 hover:border-primary-400 hover:text-primary-600"
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-neutral-500">
                  {data.interests.length} selected{data.interests.length < 3 ? ` (${3 - data.interests.length} more needed)` : " ✓"}
                </p>
              </div>
            )}

            {/* Step 3: Game Style */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600">How do you prefer to play? Select all that apply.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GAME_STYLE_OPTIONS.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => toggleGameStyle(style.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        data.gameStyles.includes(style.id)
                          ? "border-primary-600 bg-primary-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      <h3 className="font-semibold text-neutral-900">{style.label}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Preferred age range of matches
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AGE_RANGE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setData((prev) => ({ ...prev, ageRange: option.value }))}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                          data.ageRange === option.value
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-neutral-700 border-neutral-300 hover:border-primary-400"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    What are you looking for?
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "friendship", label: "New friends", icon: "👋" },
                      { id: "gaming-buddy", label: "Gaming buddies", icon: "🎮" },
                      { id: "conversation", label: "Interesting conversations", icon: "💬" },
                      { id: "all", label: "Open to anything", icon: "✨" },
                    ].map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() => setData((prev) => ({ ...prev, matchGoal: goal.id }))}
                        className={cn(
                          "w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all",
                          data.matchGoal === goal.id
                            ? "border-primary-600 bg-primary-50"
                            : "border-neutral-200 hover:border-neutral-300"
                        )}
                      >
                        <span className="text-xl">{goal.icon}</span>
                        <span className="font-medium text-neutral-900">{goal.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-success-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-neutral-900">Profile created!</h2>
                  <p className="text-neutral-600 max-w-md mx-auto">
                    You&apos;re ready to start matching with people who share your interests. Your profile will reveal more as you play and connect.
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 text-left space-y-2">
                  <h3 className="font-medium text-neutral-900 text-sm">Your setup:</h3>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(data.interests) && data.interests.map((interest) => (
                      <Tag key={interest}>{interest}</Tag>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(data.gameStyles) && data.gameStyles.map((style) => (
                      <Tag key={style}>{style}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            {currentStep < steps.length - 1 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!canProceed() || completeStep.isPending}
                className="min-w-[200px]"
              >
                {completeStep.isPending ? "Saving..." : currentStep === 0 ? "Get started" : "Continue"}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinish}
                disabled={completeStep.isPending}
                className="min-w-[200px]"
              >
                {completeStep.isPending ? "Finishing..." : "Start matching"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
