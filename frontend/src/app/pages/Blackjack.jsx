import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PlayingCard } from '../components/PlayingCard';
import { CasinoChip } from '../components/CasinoChip';
import { Disclaimer } from '../components/Disclaimer';
import { hitBlackjack, standBlackjack, startBlackjack } from '../api/blackjack';
import { formatChips } from '../utils/chips';

const chipValues = [1, 5, 25, 100, 500];

const CARD_ANIM_MS = 480;
/** Stagger matches server deal order: player, dealer, player, dealer */
const DEAL_STAGGER_MS = 120;

function FlyFromShoe({ fly, delayMs, reducedMotion, shoeRef, children }) {
  const wrapRef = useRef(null);
  const ranRef = useRef(false);
  const [showCard, setShowCard] = useState(() => !fly || reducedMotion);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    if (reducedMotion) {
      el.classList.remove('bj-fly-active');
      ranRef.current = false;
      setShowCard(true);
      return;
    }

    if (!fly) {
      setShowCard(true);
      return;
    }

    if (ranRef.current) return;
    ranRef.current = true;
    setShowCard(false);

    const shoe = shoeRef?.current;
    if (!shoe) {
      setShowCard(true);
      return;
    }

    const sr = shoe.getBoundingClientRect();
    const cr = el.getBoundingClientRect();
    const ox = sr.left + sr.width / 2 - (cr.left + cr.width / 2);
    const oy = sr.top + sr.height / 2 - (cr.top + cr.height / 2);
    el.style.setProperty('--bj-ox', `${ox}px`);
    el.style.setProperty('--bj-oy', `${oy}px`);
    el.style.animationDelay = delayMs > 0 ? `${delayMs}ms` : '';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.classList.add('bj-fly-active');
        setShowCard(true);
      });
    });
  }, [fly, reducedMotion, delayMs, shoeRef]);

  const needsFly = fly && !reducedMotion;

  return (
    <div
      ref={wrapRef}
      className={`shrink-0 relative ${needsFly ? 'bj-fly-root z-[15]' : ''}`}
      style={{ visibility: showCard ? 'visible' : 'hidden' }}
    >
      {children}
    </div>
  );
}

function mapSuit(suit) {
  switch (String(suit || '').toUpperCase()) {
    case 'HEARTS':
      return 'hearts';
    case 'DIAMONDS':
      return 'diamonds';
    case 'CLUBS':
      return 'clubs';
    case 'SPADES':
      return 'spades';
    default:
      return 'spades';
  }
}

function mapRank(rank) {
  switch (String(rank || '').toUpperCase()) {
    case 'ACE':
      return 'A';
    case 'KING':
      return 'K';
    case 'QUEEN':
      return 'Q';
    case 'JACK':
      return 'J';
    case 'TEN':
      return '10';
    case 'NINE':
      return '9';
    case 'EIGHT':
      return '8';
    case 'SEVEN':
      return '7';
    case 'SIX':
      return '6';
    case 'FIVE':
      return '5';
    case 'FOUR':
      return '4';
    case 'THREE':
      return '3';
    case 'TWO':
      return '2';
    default:
      return '';
  }
}

function toUiCard(card) {
  return {
    rank: mapRank(card?.rank),
    suit: mapSuit(card?.suit),
  };
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

function DeckStack({ className = '' }) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: 88, height: 118 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-[3px] bj-deck-pulse"
          style={{
            left: i * 3,
            top: i * 2,
            width: 80,
            height: 112,
            background: 'repeating-linear-gradient(45deg, #6B1414, #6B1414 2px, #4A0E0E 2px, #4A0E0E 4px)',
            border: '2px solid #9A7A2A',
            boxShadow: '2px 4px 10px rgba(0,0,0,0.45)',
            zIndex: 3 - i,
          }}
        />
      ))}
      <div
        className="absolute text-[9px] uppercase tracking-widest text-[#8A8A7A] whitespace-nowrap"
        style={{ left: '50%', transform: 'translateX(-50%)', bottom: -22, fontFamily: "'Barlow', sans-serif" }}
      >
        Shoe
      </div>
    </div>
  );
}

export default function Blackjack() {
  const { balance, setBalance } = useOutletContext();
  const reducedMotion = useReducedMotion();
  const [selectedChip, setSelectedChip] = useState(25);
  const [betAmount, setBetAmount] = useState(25);
  const [game, setGame] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const settledGameIdRef = useRef('');
  const shoeRef = useRef(null);

  const initialGameIdRef = useRef('');
  const prevDealerRevealedRef = useRef(false);
  const [holeRevealKey, setHoleRevealKey] = useState(0);

  const gameId = game?.id || '';
  const finished = !!game?.finished;
  const message = game?.message || '';
  const playerTotal = game?.playerTotal ?? '-';

  const balanceFloor = Math.max(0, Math.floor(Number(balance) || 0));
  const betFloor = Math.max(0, Math.floor(Number(betAmount) || 0));
  const effectiveBet = Math.min(betFloor, balanceFloor);

  useEffect(() => {
    setBetAmount((prev) =>
      Math.min(Math.max(0, Math.floor(Number(prev) || 0)), balanceFloor),
    );
  }, [balanceFloor]);

  const rawPlayer = useMemo(() => (game?.playerCards || []).map(toUiCard), [game?.playerCards]);
  const rawDealer = useMemo(() => (game?.dealerCards || []).map(toUiCard), [game?.dealerCards]);

  const dealerRevealed = game?.finished || game?.dealerTotal != null;

  useEffect(() => {
    if (!game?.id) {
      initialGameIdRef.current = '';
      prevDealerRevealedRef.current = false;
      setHoleRevealKey(0);
      return;
    }

    if (game.id === initialGameIdRef.current) {
      return;
    }

    initialGameIdRef.current = game.id;
    prevDealerRevealedRef.current = game.finished || game.dealerTotal != null;
    setHoleRevealKey(0);
  }, [game?.id]);

  useEffect(() => {
    if (!gameId) return;
    if (dealerRevealed && !prevDealerRevealedRef.current && rawDealer.length >= 2) {
      setHoleRevealKey((k) => k + 1);
    }
    prevDealerRevealedRef.current = dealerRevealed;
  }, [gameId, dealerRevealed, rawDealer.length]);

  const displayPlayer = gameId ? rawPlayer : [];
  const displayDealer = gameId ? rawDealer : [];

  const showDealerHole =
    !game?.finished && game?.dealerTotal == null && displayDealer.length >= 2;

  const uiDealerCards = useMemo(() => {
    const cards = displayDealer.map((c) => ({ ...c }));
    if (showDealerHole && cards.length >= 2) {
      cards[1] = { ...cards[1], faceDown: true };
    }
    return cards;
  }, [displayDealer, showDealerHole]);

  const flyDealer = (i) => {
    if (!gameId) return false;
    if (i <= 1 && rawDealer.length >= 2) return true;
    if (dealerRevealed && i >= 2) return true;
    return false;
  };

  const flyDealerDelay = (i) => {
    if (i <= 1 && rawDealer.length >= 2) {
      return i === 0 ? DEAL_STAGGER_MS : DEAL_STAGGER_MS * 3;
    }
    if (i >= 2) return (i - 2) * 95;
    return 0;
  };

  const flyPlayer = (i) => {
    if (!gameId) return false;
    if (i <= 1 && rawPlayer.length >= 2) return true;
    const n = rawPlayer.length;
    return n > 2 && i === n - 1;
  };

  const flyPlayerDelay = (i) => {
    if (i <= 1 && rawPlayer.length >= 2) return i === 0 ? 0 : DEAL_STAGGER_MS * 2;
    return 0;
  };

  const dealerTotalLabel = useMemo(() => {
    if (!gameId) return '—';
    if (game.dealerTotal != null) return game.dealerTotal;
    if (game.finished && rawDealer.length > 0) {
      let low = 0;
      let high = 0;
      for (const c of game.dealerCards || []) {
        const r = String(c?.rank || '').toUpperCase();
        if (r === 'ACE') {
          low += 1;
          high += 11;
        } else if (['KING', 'QUEEN', 'JACK', 'TEN'].includes(r)) {
          low += 10;
          high += 10;
        } else {
          const n = Number.parseInt(r.replace(/\D/g, ''), 10) || 0;
          low += n;
          high += n;
        }
      }
      return high <= 21 ? high : low;
    }
    return '?';
  }, [gameId, game?.dealerTotal, game?.finished, game?.dealerCards, rawDealer.length]);

  useEffect(() => {
    if (!gameId || !finished) return;
    if (settledGameIdRef.current === gameId) return;

    const bet = Number(game?.bet || 0);
    let payout = 0;
    switch (game?.status) {
      case 'PLAYER_BLACKJACK':
        payout = bet * 2.5;
        break;
      case 'PLAYER_WIN':
      case 'DEALER_BUST':
        payout = bet * 2;
        break;
      case 'PUSH':
        payout = bet;
        break;
      default:
        payout = 0;
    }

    settledGameIdRef.current = gameId;
    if (payout > 0) {
      setBalance((b) => b + payout);
    }
  }, [finished, gameId, game?.bet, game?.status, setBalance]);

  async function deal() {
    setError('');
    setSubmitting(true);
    try {
      if (effectiveBet < 1) {
        setError('Not enough chips to play');
        return;
      }

      setBetAmount(effectiveBet);
      setBalance((b) => b - effectiveBet);
      settledGameIdRef.current = '';
      const next = await startBlackjack({ bet: effectiveBet });
      setGame(next);
    } catch (err) {
      setError(err?.message || 'Failed to start game');
    } finally {
      setSubmitting(false);
    }
  }

  async function hit() {
    if (!gameId) return;
    setError('');
    setSubmitting(true);
    try {
      const next = await hitBlackjack(gameId);
      setGame(next);
    } catch (err) {
      setError(err?.message || 'Hit failed');
    } finally {
      setSubmitting(false);
    }
  }

  async function stand() {
    if (!gameId) return;
    setError('');
    setSubmitting(true);
    try {
      const next = await standBlackjack(gameId);
      setGame(next);
    } catch (err) {
      setError(err?.message || 'Stand failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden" style={{ background: '#0E1310' }}>
      <style>{`
        @keyframes bjDeckPulse {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.92; transform: translateY(-2px); }
        }
        @keyframes bjHoleReveal {
          from {
            opacity: 1;
            transform: rotateY(-75deg) scale(0.94);
          }
          to {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
          }
        }
        @keyframes bjFlyFromShoe {
          from {
            opacity: 1;
            transform: translate(var(--bj-ox, 0px), var(--bj-oy, 0px)) rotate(11deg) scale(0.88);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
        }
        @keyframes bjToastIn {
          from {
            opacity: 1;
            transform: translate(0, 8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }
        .bj-deck-pulse {
          animation: bjDeckPulse 2.8s ease-in-out infinite;
        }
        .bj-hole-reveal {
          animation: bjHoleReveal ${CARD_ANIM_MS}ms cubic-bezier(0.34, 1.2, 0.64, 1) both;
          transform-style: preserve-3d;
        }
        .bj-fly-root.bj-fly-active {
          animation: bjFlyFromShoe ${CARD_ANIM_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .bj-deck-pulse, .bj-hole-reveal, .bj-fly-root.bj-fly-active {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div
        className="flex-1 relative flex flex-col items-center justify-between py-6 px-4 min-h-[320px]"
        style={{ background: 'radial-gradient(ellipse at 50% 38%, #2a5a2a 0%, #1a3a1a 38%, #0E1310 78%)' }}
      >
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '82%',
            maxWidth: 720,
            height: 280,
            border: '1px solid rgba(200,168,75,0.12)',
            borderRadius: '0 0 50% 50%',
            borderTop: 'none',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.25)',
          }}
        />

        <div
          ref={shoeRef}
          className="absolute z-[5] bottom-6 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:right-[8%] sm:top-[22%] pointer-events-none"
        >
          <DeckStack />
        </div>

        <div className="flex flex-col items-center gap-3 relative z-10 w-full max-w-2xl">
          <div className="text-[#8A8A7A] text-[11px] uppercase tracking-widest" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Dealer —{' '}
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#C8A84B' }}>{dealerTotalLabel}</span>
          </div>
          <div
            className="flex gap-2 min-h-[120px] items-center justify-center flex-wrap px-2 rounded-[6px] border border-[#2A3A28]/50"
            style={{ background: 'rgba(14,19,16,0.35)', minWidth: 200 }}
          >
            {!gameId && (
              <span className="text-[10px] text-[#5A5A4A] uppercase tracking-wider" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Dealer area
              </span>
            )}
            {uiDealerCards.map((c, i) => {
              const isHoleReveal = i === 1 && dealerRevealed && !c.faceDown && holeRevealKey > 0;
              const cardEl = <PlayingCard rank={c.rank} suit={c.suit} faceDown={!!c.faceDown} size="lg" />;
              const inner = isHoleReveal ? (
                <div key={`hole-${holeRevealKey}`} className="bj-hole-reveal shrink-0 perspective-[600px]">
                  {cardEl}
                </div>
              ) : (
                cardEl
              );

              return (
                <div key={`d-${gameId}-${i}`} className="shrink-0">
                  <FlyFromShoe
                    fly={flyDealer(i)}
                    delayMs={flyDealerDelay(i)}
                    reducedMotion={reducedMotion}
                    shoeRef={shoeRef}
                  >
                    {inner}
                  </FlyFromShoe>
                </div>
              );
            })}
          </div>
        </div>

        {message && gameId && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
            <div
              className="px-6 py-3 rounded-[4px] border border-[#C8A84B]/35 shadow-lg"
              style={{
                background: 'rgba(14,19,16,0.92)',
                animation: reducedMotion ? 'none' : 'bjToastIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
              }}
            >
              <span className="text-[#C8A84B] text-lg" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
                {message}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 w-full max-w-3xl relative z-10">
          <div className="flex flex-col items-center gap-3 flex-1">
            <div
              className="flex gap-2 min-h-[120px] items-center justify-center flex-wrap px-2 rounded-[6px] border border-[#2A3A28]/50"
              style={{ background: 'rgba(14,19,16,0.35)', minWidth: 200 }}
            >
              {!gameId && (
                <span className="text-[10px] text-[#5A5A4A] uppercase tracking-wider" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Your hand
                </span>
              )}
              {displayPlayer.map((c, i) => (
                <div key={`p-${gameId}-${i}`} className="shrink-0">
                  <FlyFromShoe
                    fly={flyPlayer(i)}
                    delayMs={flyPlayerDelay(i)}
                    reducedMotion={reducedMotion}
                    shoeRef={shoeRef}
                  >
                    <PlayingCard rank={c.rank} suit={c.suit} size="lg" />
                  </FlyFromShoe>
                </div>
              ))}
            </div>
            <div className="text-[#E8E0D0] text-xs uppercase tracking-widest">
              Your hand —{' '}
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#C8A84B' }}>
                {gameId ? playerTotal : '—'}
              </span>
            </div>
          </div>

          {!gameId && (
            <div className="hidden sm:block text-center max-w-[200px]">
              <p className="text-[11px] text-[#8A8A7A] leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Set your bet, then <span className="text-[#C8A84B]">Deal</span> to play. Cards are dealt from the shoe.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[#2A3A28] px-4 py-3" style={{ background: '#141C16' }}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            {chipValues.map((v) => (
              <CasinoChip
                key={v}
                value={v}
                selected={selectedChip === v}
                onClick={() => {
                  setSelectedChip(v);
                  setBetAmount((b) => {
                    const base = Math.max(0, Math.floor(Number(b) || 0));
                    const next = base === 0 ? v : base + v;
                    return Math.min(next, balanceFloor);
                  });
                }}
                size={40}
              />
            ))}
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#8A8A7A] uppercase tracking-wider">Current Bet</div>
            <div className="text-[#C8A84B] text-lg" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
              {formatChips(effectiveBet)}
            </div>
            <div className="mt-1 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setBetAmount(0)}
                disabled={submitting || (!!gameId && !finished)}
                className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#8A8A7A] rounded-[2px] border border-[#2A3A28] hover:bg-[#1A2119] hover:text-[#E8E0D0] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#0E1310' }}
              >
                Clear bet
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={gameId ? hit : deal}
              disabled={
                submitting ||
                (gameId && finished) ||
                (!gameId && effectiveBet < 1)
              }
              className="px-5 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px] hover:bg-[#A02020] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#8B1A1A' }}
            >
              {gameId ? 'Hit' : 'Deal'}
            </button>
            <button
              onClick={stand}
              disabled={submitting || !gameId || finished}
              className="px-5 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px] border border-[#2A3A28] hover:bg-[#1A2119] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#0E1310' }}
            >
              Stand
            </button>
            <button
              disabled
              className="px-5 py-2 text-xs uppercase tracking-wider text-[#C8A84B] rounded-[2px] border border-[#C8A84B]/30 hover:bg-[#C8A84B]/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Double
            </button>
            <button
              disabled
              className="px-5 py-2 text-xs uppercase tracking-wider text-[#8A8A7A] rounded-[2px] border border-[#2A3A28] opacity-40 cursor-not-allowed"
              style={{ background: '#0E1310' }}
            >
              Split
            </button>
          </div>
        </div>

        {error ? (
          <div className="max-w-3xl mx-auto mt-3">
            <div className="text-xs text-[#F87171] border border-[#3A1A1A] rounded-[2px] px-3 py-2" style={{ background: '#1A2119' }}>
              {error}
            </div>
          </div>
        ) : null}

        {gameId && finished && (
          <div className="flex justify-center mt-3">
            <button
              onClick={deal}
              disabled={submitting}
              className="px-6 py-2 text-xs uppercase tracking-wider text-[#E8E0D0] rounded-[2px]"
              style={{ background: '#8B1A1A' }}
            >
              {submitting ? 'Dealing...' : 'Deal Again'}
            </button>
          </div>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
