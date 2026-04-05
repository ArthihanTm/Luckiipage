import { Link, useNavigate } from 'react-router-dom';
import { Diamond } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';
import { login } from '../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate('/app');
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0E1310' }}>
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center border-r border-[#2A3A28] overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1686832018701-cb403d474579?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwcG9rZXIlMjBjaGlwcyUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzczODIzMTM0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(14,19,16,0.5) 0%, #0E1310 80%)' }} />
        <div className="relative text-center px-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-[2px] flex items-center justify-center" style={{ background: '#8B1A1A' }}>
              <Diamond size={24} className="text-[#C8A84B]" />
            </div>
          </div>
          <h2 className="text-[#E8E0D0] text-2xl mb-3" style={{ fontFamily: "'Spectral', serif", fontWeight: 600 }}>
            Welcome Back
          </h2>
          <p className="text-[#8A8A7A] text-sm max-w-xs mx-auto">Your table is waiting. Pick up where you left off.</p>
          <div className="mt-8 flex items-center justify-center gap-6 text-[#8A8A7A] text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
            <div>
              <span className="text-[#C8A84B]">12,847</span> online
            </div>
            <div className="w-px h-3 bg-[#2A3A28]" />
            <div>
              <span className="text-[#C8A84B]">342</span> tables
            </div>
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
            Sign In
          </h1>
          <p className="text-[#8A8A7A] text-xs mb-6">Enter your credentials to continue</p>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="block text-[#8A8A7A] text-xs mb-1.5">Email</label>
              <input
                type="text"
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
                className="w-full px-3 py-2 rounded-[2px] border border-[#2A3A28] text-[#E8E0D0] text-sm placeholder-[#555] focus:border-[#C8A84B] focus:ring-1 focus:ring-[#C8A84B] outline-none"
                style={{ background: '#141C16' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[#8A8A7A] cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded-[2px] border-[#2A3A28] accent-[#8B1A1A]" />
                Remember me
              </label>
              <a href="#" className="text-xs text-[#C8A84B] hover:underline">
                Forgot?
              </a>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="block w-full text-center px-4 py-2.5 text-sm text-[#E8E0D0] rounded-[2px] hover:bg-[#A02020] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#8B1A1A' }}
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {error ? (
            <div className="mt-4 text-xs text-[#F87171] border border-[#3A1A1A] rounded-[2px] px-3 py-2" style={{ background: '#1A2119' }}>
              {error}
            </div>
          ) : null}

          <div className="mt-6 text-center text-xs text-[#8A8A7A]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#C8A84B] hover:underline">
              Create one free
            </Link>
          </div>
          <div className="mt-6 text-center text-[10px] text-[#8A8A7A]">LuckiiPage is for entertainment only. No real money.</div>
        </div>
      </div>
    </div>
  );
}
