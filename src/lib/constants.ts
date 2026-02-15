export const SITE_NAME = 'duomatch';
export const SITE_URL = 'https://duomatch.app';
export const SITE_DESCRIPTION =
  'duomatch is a social connection platform that matches people by shared interests and connects them through cooperative two-player games. Build meaningful connections through play.';
export const SITE_TAGLINE = 'Connect Through Play';

export const CONTACT_INFO = {
  address: {
    street: '580 Market Street, Suite 400',
    city: 'San Francisco',
    region: 'CA',
    postalCode: '94104',
    country: 'US',
    full: '580 Market Street, Suite 400, San Francisco, CA 94104',
  },
  phone: '+1 (415) 555-0192',
  email: 'hello@duomatch.app',
  hours: 'Monday–Friday, 9:00 AM – 6:00 PM PT',
};

export const SOCIAL_LINKS = [
  {
    platform: 'Twitter',
    url: 'https://twitter.com/duomatch',
    icon: 'twitter',
  },
  {
    platform: 'Instagram',
    url: 'https://instagram.com/duomatch',
    icon: 'instagram',
  },
  {
    platform: 'TikTok',
    url: 'https://tiktok.com/@duomatch',
    icon: 'tiktok',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/company/duomatch',
    icon: 'linkedin',
  },
  {
    platform: 'Discord',
    url: 'https://discord.gg/duomatch',
    icon: 'discord',
  },
];

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Games', href: '/games' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_LINKS = {
  product: [
    { label: 'Games Library', href: '/games' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Safety', href: '/safety' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/about#careers' },
    { label: 'Press', href: '/about#press' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Community Guidelines', href: '/safety' },
  ],
};

export const FEATURES = [
  {
    id: 'matching',
    title: 'AI-Powered Matching',
    description:
      'Our intelligent algorithm pairs you with people who share your interests, play style, and communication preferences. No swiping—just smart connections.',
    icon: 'sparkles',
  },
  {
    id: 'games',
    title: 'Cooperative Game Library',
    description:
      'Choose from dozens of two-player cooperative games designed to spark conversation and reveal personality. From word puzzles to strategy challenges.',
    icon: 'gamepad',
  },
  {
    id: 'profiles',
    title: 'Progressive Profile Reveals',
    description:
      'Profiles are earned, not curated. The more you play together, the more you learn about each other. Authentic connections start with shared experiences.',
    icon: 'layers',
  },
  {
    id: 'chat',
    title: 'Safe, Moderated Chat',
    description:
      'AI-powered moderation keeps conversations respectful and welcoming. Chat flows naturally during gameplay, making ice-breakers effortless.',
    icon: 'shield',
  },
  {
    id: 'leaderboard',
    title: 'Leaderboards & Achievements',
    description:
      'Track your cooperative scores, unlock achievements, and climb the leaderboard together. Every game you play strengthens your connection.',
    icon: 'trophy',
  },
  {
    id: 'safety',
    title: 'Safety First',
    description:
      'Comprehensive reporting tools, community guidelines, and proactive moderation ensure duomatch is a safe space for everyone.',
    icon: 'heart',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Create Your Profile',
    description:
      'Tell us about your interests, preferred game types, and what kind of connections you are looking for. Our onboarding takes less than 3 minutes.',
  },
  {
    step: 2,
    title: 'Get Matched',
    description:
      'Our AI analyzes your interests and preferences to find people you will genuinely click with. Quality over quantity—every match is intentional.',
  },
  {
    step: 3,
    title: 'Play Together',
    description:
      'Jump into a cooperative game with your match. Conversation flows naturally as you work together toward a shared goal.',
  },
  {
    step: 4,
    title: 'Build Connections',
    description:
      'As you play more games, profiles progressively reveal more about each person. Real connections are built through shared experiences, not selfies.',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah K.',
    quote:
      'I was tired of dating apps where conversations fizzled after "hey." On duomatch, we were laughing together within minutes of our first game. Now we play every evening.',
    role: 'Member since 2024',
  },
  {
    id: 2,
    name: 'Marcus T.',
    quote:
      'The progressive reveal system is genius. Instead of judging someone by their photos, I got to know my match through how they think, strategize, and communicate.',
    role: 'Member since 2024',
  },
  {
    id: 3,
    name: 'Priya R.',
    quote:
      'I moved to a new city and needed friends, not dates. duomatch matched me with someone who loves the same obscure board games I do. We meet up weekly now.',
    role: 'Member since 2024',
  },
];

export const STATS = [
  { label: 'Active Players', value: '50K+' },
  { label: 'Games Played', value: '2M+' },
  { label: 'Connections Made', value: '500K+' },
  { label: 'Games Available', value: '30+' },
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Get started and discover what duomatch is all about.',
    features: [
      '3 matches per day',
      'Access to 10 free games',
      'Basic profile',
      'Standard chat',
      'Community leaderboard',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 9.99,
    period: 'month',
    description: 'Unlock more connections and the full game library.',
    features: [
      'Unlimited matches',
      'Full game library access',
      'Advanced AI matching',
      'Priority profile reveals',
      'Detailed match insights',
      'Custom game preferences',
      'Ad-free experience',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    period: 'month',
    description: 'The ultimate duomatch experience with exclusive perks.',
    features: [
      'Everything in Plus',
      'Exclusive premium games',
      'See who wants to match',
      'Profile boost (2x visibility)',
      'Priority support',
      'Early access to new games',
      'Custom profile themes',
      'Achievement badges',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
];

export const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'Co-Founder & CEO',
    bio: 'Former game designer at Riot Games. Believes the best relationships are forged through shared challenges.',
  },
  {
    id: 2,
    name: 'Jordan Okafor',
    role: 'Co-Founder & CTO',
    bio: 'Ex-Google engineer with a passion for AI and social technology. Built matching systems used by millions.',
  },
  {
    id: 3,
    name: 'Mia Rodriguez',
    role: 'Head of Game Design',
    bio: 'Award-winning indie game developer. Designs games that bring people together, one puzzle at a time.',
  },
  {
    id: 4,
    name: 'Sam Patel',
    role: 'Head of Safety',
    bio: 'Former Trust & Safety lead at Discord. Committed to making online spaces safe and inclusive for everyone.',
  },
];
