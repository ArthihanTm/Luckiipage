export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Games', path: '/games' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Rewards', path: '/rewards' },
];

export const games = [
  {
    title: 'Blackjack',
    description: 'Beat the dealer to 21 in this classic card game.',
    icon: 'BJ',
  },
  {
    title: 'Mines',
    description: 'Navigate the grid and avoid hidden mines for big multipliers.',
    icon: 'MN',
  },
  {
    title: 'Slots',
    description: 'Spin the reels and match symbols for virtual coin wins.',
    icon: 'SL',
  },
  {
    title: 'Poker',
    description: 'Outsmart opponents in this strategic card showdown.',
    icon: 'PK',
  },
];

export const features = [
  {
    title: 'No Real Money',
    description: '100% virtual coins. No deposits, no withdrawals, no risk.',
    icon: 'NM',
  },
  {
    title: 'Instant Play',
    description: 'Jump into any game instantly. No downloads required.',
    icon: 'IP',
  },
  {
    title: 'Compete & Climb',
    description: 'Rise through leaderboards and earn achievement badges.',
    icon: 'CC',
  },
  {
    title: 'Daily Rewards',
    description: 'Collect free virtual coins every day. Streak bonuses included.',
    icon: 'DR',
  },
];

export const faqs = [
  {
    question: 'Is LuckiiPage real gambling?',
    answer:
      'No. LuckiiPage uses only virtual coins and offers entertainment without real-money betting.',
  },
  {
    question: 'Do I need to pay anything?',
    answer: 'No purchase is required. You can play and earn virtual coins for free.',
  },
  {
    question: 'How do I earn virtual coins?',
    answer:
      'You can earn coins through daily rewards, game performance, and leaderboard progress.',
  },
  {
    question: 'What games are available?',
    answer: 'Blackjack, Mines, Slots, and Poker are currently featured.',
  },
];

export const footerGroups = [
  {
    title: 'GAMES',
    items: [
      { label: 'Blackjack', isLink: true, path: '/games' },
      { label: 'Mines', isLink: true, path: '/games' },
      { label: 'Slots', isLink: true, path: '/games' },
      { label: 'Poker', isLink: true, path: '/games' },
    ],
  },
  {
    title: 'PLATFORM',
    items: [
      { label: 'Dashboard', isLink: true, path: '/dashboard' },
      { label: 'Leaderboard', isLink: true, path: '/leaderboard' },
      { label: 'Rewards', isLink: true, path: '/rewards' },
      { label: 'Profile', isLink: true, path: '/dashboard' },
    ],
  },
  {
    title: 'LEGAL',
    items: [
      { label: 'No real money involved', isLink: false },
      { label: 'Virtual coins only', isLink: false },
      { label: '18+ entertainment', isLink: false },
    ],
  },
];
