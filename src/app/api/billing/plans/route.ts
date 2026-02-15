import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api-utils';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with duomatch',
    features: [
      '3 matches per day',
      'Access to 2 games',
      'Basic profile',
      'Text chat',
    ],
    pricing: {
      month: { amount: 0, currency: 'usd' },
      year: { amount: 0, currency: 'usd' },
    },
    limits: {
      daily_matches: 3,
      games_access: 2,
      reveals_per_week: 1,
    },
  },
  {
    id: 'plus',
    name: 'Plus',
    description: 'More matches, more games, more connection',
    features: [
      '10 matches per day',
      'Access to all games',
      'Priority matching',
      'Voice reveals',
      '5 reveals per week',
      'Match statistics',
    ],
    pricing: {
      month: { amount: 999, currency: 'usd' },
      year: { amount: 7999, currency: 'usd' },
    },
    limits: {
      daily_matches: 10,
      games_access: 'all',
      reveals_per_week: 5,
    },
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'The ultimate duomatch experience',
    features: [
      'Unlimited matches',
      'Access to all games',
      'Priority matching with The Referee AI',
      'All reveal levels',
      'Unlimited reveals',
      'Advanced statistics',
      'Profile boost',
      'See who wants to play with you',
    ],
    pricing: {
      month: { amount: 1999, currency: 'usd' },
      year: { amount: 15999, currency: 'usd' },
    },
    limits: {
      daily_matches: 'unlimited',
      games_access: 'all',
      reveals_per_week: 'unlimited',
    },
  },
];

export async function GET(request: NextRequest) {
  return successResponse({ plans: PLANS });
}
