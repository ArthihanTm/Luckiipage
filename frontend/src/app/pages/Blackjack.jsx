import { useMemo, useState } from 'react';
import { PlayingCard } from '../components/PlayingCard';
import { CasinoChip } from '../components/CasinoChip';
import { Disclaimer } from '../components/Disclaimer';
import { hitBlackjack, standBlackjack, startBlackjack } from '../api/blackjack';

const chipValues = [1, 5, 25, 100, 500];

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

export default function Blackjack() {
  const [selectedChip, setSelectedChip] = useState(25);
  const [game, setGame] = useState(null); // backend GameResponse
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const gameId = game?.id || '';
  const finished = !!game?.finished;
  const message = game?.message || '';

  const dealerTotal = game?.dealerTotal == null ? '?' : game.dealerTotal;
  const playerTotal = game?.playerTotal ?? '-';

  const uiPlayerCards = useMemo(() => (game?.playerCards || []).map(toUiCard), [game?.playerCards]);
  const uiDealerCards = useMemo(() => {
    const cards = (game?.dealerCards || []).map(toUiCard);
    if (game?.dealerTotal == null && cards.length >= 2) {
      return [cards[0], { ...cards[1], faceDown: true }];
    }
    return cards;
  }, [game?.dealerCards, game?.dealerTotal]);

  async function deal() {
    setError('');
    setSubmitting(true);
    try {
      const next = await startBlackjack({ bet: selectedChip });
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
      <div
        className="flex-1 relative flex flex-col items-center justify-between py-6 px-4"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, #245024 0%, #1a3a1a 40%, #0E1310 80%)' }}
      >
        <div
          className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '80%',
            maxWidth: 700,
            height: 300,
            border: '1px solid rgba(200,168,75,0.15)',
            borderRadius: '0 0 50% 50%',
            borderTop: 'none',
          }}
        />

        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="text-[#8A8A7A] text-[11px] uppercase tracking-widest" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Dealer - {dealerTotal}
          </div>
          <div className="flex gap-2">
            {uiDealerCards.map((c, i) => (
              <PlayingCard key={i} rank={c.rank} suit={c.suit} faceDown={c.faceDown} size="lg" />
            ))}
          </div>
        </div>

        {message && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="px-6 py-3 rounded-[4px] border border-[#C8A84B]/30" style={{ background: 'rgba(14,19,16,0.9)' }}>
              <span className="text-[#C8A84B] text-lg" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
                {message}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="flex gap-2">
            {uiPlayerCards.map((c, i) => (
              <PlayingCard key={i} rank={c.rank} suit={c.suit} size="lg" />
            ))}
          </div>
          <div className="text-[#E8E0D0] text-xs uppercase tracking-widest">
            Your Hand - <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#C8A84B' }}>{playerTotal}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2A3A28] px-4 py-3" style={{ background: '#141C16' }}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            {chipValues.map((v) => (
              <CasinoChip key={v} value={v} selected={selectedChip === v} onClick={() => setSelectedChip(v)} size={40} />
            ))}
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#8A8A7A] uppercase tracking-wider">Current Bet</div>
            <div className="text-[#C8A84B] text-lg" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>
              {selectedChip.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={gameId ? hit : deal}
              disabled={submitting || (gameId && finished)}
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
