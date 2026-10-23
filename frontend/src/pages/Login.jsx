import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Phone, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, token, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect straight to dashboard
  useEffect(() => {
    if (token && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(phone, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'లాగిన్ విఫలమైంది. సరైన వివరాలు నమోదు చేయండి.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-stone-100 px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-stone-200 p-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-emerald-100 rounded-full text-emerald-700 mb-2">
            <Sprout className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800">రైతు లాగిన్ (Farmer Login)</h2>
          <p className="text-xs text-stone-500 mt-1">తిరుపతి జిల్లా వ్యవసాయ సమాచార కేంద్రం</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
              మొబైల్ సంఖ్య (10-Digit Mobile)
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <input
                type="tel"
                required
                maxLength="10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">
              పాస్‌వర్డ్ (Password)
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-md text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-md transition shadow disabled:opacity-50 text-sm"
          >
            {submitting ? 'లాగిన్ అవుతోంది...' : 'ప్రవేశించండి (Sign In)'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-stone-600">
          ఇంకా నమోదు చేసుకోలేదా?{' '}
          <Link to="/register" className="text-emerald-700 font-semibold hover:underline">
            ఖాతా తెరవండి (Register here)
          </Link>
        </div>
      </div>
    </div>
  );
}