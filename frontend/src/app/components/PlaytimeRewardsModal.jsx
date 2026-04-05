import { Gift, X } from 'lucide-react';
import { PLAYTIME_REWARD_TIERS } from '../constants/playtimeRewards';
import { formatChips } from '../utils/chips';

function formatTodayTime(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function timeNeeded(secondsRequired, todaySeconds) {
  const need = Math.max(0, secondsRequired - todaySeconds);
  const m = Math.ceil(need / 60);
  if (need <= 0) return null;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm > 0 ? `~${h}h ${rm}m more` : `~${h}h more`;
  }
  return `~${m} min more`;
}

export function PlaytimeRewardsModal({ open, onClose, todaySeconds, claimedTierIds, onClaimTier }) {
  if (!open) return null;

  const claimedSet = new Set(claimedTierIds || []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="playtime-rewards-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[4px] border border-[#2A3A28] shadow-xl overflow-hidden"
        style={{ background: '#141C16' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A3A28]">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-[#C8A84B]" />
            <h2 id="playtime-rewards-title" className="text-[#E8E0D0] text-sm font-semibold uppercase tracking-wider">
              Daily online time
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-[2px] text-[#8A8A7A] hover:text-[#E8E0D0] hover:bg-[#1A2119]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-[#2A3A28]" style={{ background: '#0E1310' }}>
          <p className="text-[11px] text-[#8A8A7A] leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Time counts only while this tab is <span className="text-[#C8A84B]">open and visible</span>. Progress and
            claims reset at <span className="text-[#C8A84B]">local midnight</span>. Each reward can be claimed{' '}
            <span className="text-[#C8A84B]">once per day</span>.
          </p>
          <div
            className="mt-3 text-center py-2 rounded-[2px] border border-[#C8A84B]/25"
            style={{ background: 'rgba(200,168,75,0.06)' }}
          >
            <div className="text-[10px] text-[#8A8A7A] uppercase tracking-wider mb-0.5">Today (visible)</div>
            <div className="text-[#C8A84B] text-xl" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {formatTodayTime(todaySeconds)}
            </div>
          </div>
        </div>

        <ul className="p-3 space-y-2 max-h-[min(52vh,380px)] overflow-y-auto">
          {PLAYTIME_REWARD_TIERS.map((tier) => {
            const claimed = claimedSet.has(tier.id);
            const eligible = todaySeconds >= tier.seconds && !claimed;
            const needLabel = timeNeeded(tier.seconds, todaySeconds);

            return (
              <li
                key={tier.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-[2px] border border-[#2A3A28]"
                style={{ background: '#0E1310' }}
              >
                <div className="min-w-0">
                  <div className="text-[#E8E0D0] text-sm">{tier.label}</div>
                  <div className="text-[11px] text-[#8A8A7A] mt-0.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                    +{formatChips(tier.chips)} chips
                  </div>
                  {!claimed && needLabel && (
                    <div className="text-[10px] text-[#5A5A4A] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      {needLabel}
                    </div>
                  )}
                </div>
                {claimed ? (
                  <span
                    className="shrink-0 px-3 py-1.5 text-xs uppercase tracking-wider rounded-[2px] text-[#5A5A4A] border border-[#2A3A28]"
                    style={{ background: '#141C16' }}
                  >
                    Claimed
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!eligible}
                    onClick={() => onClaimTier(tier)}
                    className="shrink-0 px-3 py-1.5 text-xs uppercase tracking-wider rounded-[2px] text-[#E8E0D0] disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#A02020]"
                    style={{ background: '#8B1A1A' }}
                  >
                    Claim
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
