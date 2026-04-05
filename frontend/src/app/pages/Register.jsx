import { Link } from 'react-router-dom';
import { Diamond } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

/** Matches backend StrongPasswordValidator (see RegisterRequest / StrongPasswordValidator.java). */
const STRONG_PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()]).{8,}$/;

export default function Register() {
  const [currency, setCurrency] = useState('coins');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const trimmedEmail = String(email || '').trim();
    if (!trimmedEmail) {
      setError('Email is required.');
      return;
    }
    if (!STRONG_PASSWORD.test(password || '')) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character from: @ # $ % ^ & + = ! * ( )',
      );
      return;
    }
    setSubmitting(true);
    try {
      await register({ email: trimmedEmail, password });
      navigate('/app');
    } catch (err) {
      setError(err?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0E1310' }}>
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center border-r border-[#2A3A28] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1647222148007-f2910658aea7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2FzaW5vJTIwdGFibGUlMjBmZWx0JTIwZ3JlZW58ZW58MXx8fHwxNzczODIzMTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(14,19,16,0.5) 0%, #0E1310 80%)' }} />
        <div className="relative text-center px-12">
          <div className="w-12 h-12 mx-auto rounded-[2px] flex items-center justify-center mb-6" style={{ background: '#8B1A1A' }}>
            <Diamond size={24} className="text-[#C8A84B]" />
          </div>
          <h2 className="text-[#E8E0D0] text-2xl mb-3" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
            Start Playing Free
          </h2>
          <p className="text-[#8A8A7A] text-sm max-w-xs mx-auto">Get 25,000 virtual chips instantly. No credit card required.</p>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-[2px] border border-[#2A3A28]" style={{ background: '#141C16' }}>
            <span className="text-[#C8A84B] text-lg">◆</span>
            <span className="text-[#E8E0D0]" style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>
              25,000
            </span>
            <span className="text-[#8A8A7A] text-xs">free chips</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-[2px] flex items-center justify-center" style={{ background: '#8B1A1A' }}>
              <Diamond size={16} className="text-[#C8A84B]" />
            </div>
            <span className="text-[#E8E0D0]" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
              LuckiiPage
            </span>
          </div>

          <h1 className="text-[#E8E0D0] text-xl mb-1" style={{ fontFamily: "'Spectral', serif" }}>
            Create Account
          </h1>
          <p className="text-[#8A8A7A] text-xs mb-6">Free to play - entertainment only</p>

          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8A8A7A] text-xs mb-1.5">Username</label>
                <input
                  className="w-full px-3 py-2 rounded-[2px] border border-[#2A3A28] text-[#E8E0D0] text-sm placeholder-[#555] focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] outline-none"
                  style={{ background: '#141C16' }}
                  placeholder="Player_7291"
                />
              </div>
              <div>
                <label className="block text-[#8A8A7A] text-xs mb-1.5">Display Name</label>
                <input
                  className="w-full px-3 py-2 rounded-[2px] border border-[#2A3A28] text-[#E8E0D0] text-sm placeholder-[#555] focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] outline-none"
                  style={{ background: '#141C16' }}
                  placeholder="HighRoller"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#8A8A7A] text-xs mb-1.5">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 py-2 rounded-[2px] border border-[#2A3A28] text-[#E8E0D0] text-sm placeholder-[#555] focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] outline-none"
                style={{ background: '#141C16' }}
                placeholder="player@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[#8A8A7A] text-xs mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-[2px] border border-[#2A3A28] text-[#E8E0D0] text-sm placeholder-[#555] focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] outline-none"
                style={{ background: '#141C16' }}
                placeholder="e.g. LuckiiP@ss1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-1.5 text-[10px] text-[#8A8A7A] leading-relaxed">
                At least 8 characters, with uppercase, lowercase, a number, and one special character from{' '}
                <span className="text-[#6A6A5A]" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {'@ # $ % ^ & + = ! * ( )'}
                </span>
                .
              </p>
            </div>

            <div>
              <label className="block text-[#8A8A7A] text-xs mb-1.5">Virtual Currency</label>
              <div className="flex border border-[#2A3A28] rounded-[2px] overflow-hidden">
                {['coins', 'gems'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`flex-1 py-2 text-xs uppercase tracking-wider transition-colors ${
                      currency === c ? 'text-[#E8E0D0]' : 'text-[#8A8A7A]'
                    }`}
                    style={{ background: currency === c ? '#8B1A1A' : '#141C16' }}
                  >
                    {c === 'coins' ? '◆ Chips' : '◇ Gems'}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-[#8A8A7A] cursor-pointer pt-1">
              <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 rounded-[2px] accent-[#8B1A1A]" />
              <span>I understand this is entertainment only with virtual currency. No real money involved.</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="block w-full text-center px-4 py-2.5 text-sm text-[#E8E0D0] rounded-[2px] hover:bg-[#A02020] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#8B1A1A' }}
            >
              {submitting ? 'Creating...' : 'Create Account & Get 25,000 Chips'}
            </button>
          </form>

          {error ? (
            <div className="mt-4 text-xs text-[#F87171] border border-[#3A1A1A] rounded-[2px] px-3 py-2" style={{ background: '#1A2119' }}>
              {error}
            </div>
          ) : null}

          <div className="mt-4 text-center text-xs text-[#8A8A7A]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C8A84B] hover:underline">
              Sign in
            </Link>
          </div>
          <div className="mt-6 text-center text-[10px] text-[#8A8A7A]">LuckiiPage is for entertainment only. No real money. No gambling.</div>
        </div>
      </div>
    </div>
  );
}
