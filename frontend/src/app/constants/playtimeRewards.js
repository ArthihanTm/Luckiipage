/**
 * Daily playtime rewards (local calendar day). Each tier: once per day if you've been
 * online long enough that day (tab visible). Order = ascending time.
 */
export const PLAYTIME_REWARD_TIERS = [
  { id: '5m', label: '5 minutes online today', seconds: 5 * 60, chips: 1_000 },
  { id: '10m', label: '10 minutes online today', seconds: 10 * 60, chips: 2_200 },
  { id: '15m', label: '15 minutes online today', seconds: 15 * 60, chips: 3_800 },
  { id: '30m', label: '30 minutes online today', seconds: 30 * 60, chips: 7_500 },
  { id: '1h', label: '1 hour online today', seconds: 60 * 60, chips: 10_000 },
];
