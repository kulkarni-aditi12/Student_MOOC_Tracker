import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { login } from '../lib/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login: ctxLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(email, password);
    if (result.success && result.user) {
      ctxLogin(result.user);
      setLocation(result.user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard');
    } else {
      setError(result.error ?? 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/20 p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <GraduationCap className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">MOOC Tracker</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-foreground mb-4">Welcome back to your learning journey</h2>
          <p className="text-muted-foreground text-lg">Track your progress, continue where you left off, and keep growing every day.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { value: '50K+', label: 'Active Students' },
              { value: '500+', label: 'Premium Courses' },
              { value: '95%', label: 'Completion Rate' },
              { value: '4.8★', label: 'Average Rating' },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-4">
                <div className="text-xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-muted-foreground">© 2025 MOOC Tracker. All rights reserved.</div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">MOOC Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Sign in to your account</h1>
          <p className="text-muted-foreground mb-8">Continue your learning journey</p>

          {error && (
            <div className="mb-5 p-3.5 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  data-testid="input-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  data-testid="input-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              data-testid="button-login"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link href="/signup">
              <span className="text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer">Create one free</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
