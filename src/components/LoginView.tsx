import React, { useState } from 'react';
import { StorageService } from '../services/store';
import { User, ActiveTab } from '../types';
import { LogIn, KeyRound, ShieldAlert, Sparkles, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function LoginView({ onLoginSuccess, setActiveTab }: LoginViewProps) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!usernameOrEmail.trim() || !password) {
      setError('Please provide your Username/Email and Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = StorageService.login(usernameOrEmail, password);
      setIsLoading(false);

      if (res.success && res.user) {
        setSuccess('Authentication verified! Redirecting to dashboard...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 800);
      } else {
        setError(res.message);
      }
    }, 350);
  };

  const handleQuickLogin = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setUsernameOrEmail('rahul_sharma');
      setPassword('password123');
      const res = StorageService.login('rahul_sharma', 'password123');
      if (res.user) onLoginSuccess(res.user);
    } else {
      setUsernameOrEmail('admin');
      setPassword('admin123');
      const res = StorageService.login('admin', 'admin123');
      if (res.user) onLoginSuccess(res.user);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 sm:px-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            User Authentication
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to start your GPS location session and view live tracking telemetry.
          </p>
        </div>

        {/* Demo Fast Logins for Viva evaluation */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
            1-Click Demo Accounts
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-quick-student"
              onClick={() => handleQuickLogin('student')}
              className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/60 text-left transition"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Student</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">rahul_sharma</div>
            </button>

            <button
              type="button"
              id="btn-quick-admin"
              onClick={() => handleQuickLogin('admin')}
              className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100/60 text-left transition"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                <span>Admin</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">admin / admin123</div>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="e.g. rahul_sharma or rahul@college.edu"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition"
            />
          </div>

          <button
            type="submit"
            id="btn-submit-login"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>Sign In to Dashboard</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600 dark:text-slate-400">
          Don't have an account yet?{' '}
          <button
            onClick={() => setActiveTab('register')}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Register new account
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-base">
              <KeyRound className="w-5 h-5" />
              <span>Password Recovery</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In this BTech project demo, standard test passwords for registered students is{' '}
              <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-semibold">
                password123
              </code>
              , and for administrator is{' '}
              <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-semibold">
                admin123
              </code>
              .
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              In production, the PHP backend triggers an SMTP email token via PHPMailer to reset the bcrypt hash in MySQL.
            </p>
            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
