import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Sparkles, BookOpen, BarChart2 } from 'lucide-react';
import { signup } from '../lib/auth';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [, setLocation] = useLocation();
  const { login: ctxLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = signup(name, email, password, role);
    if (result.success && result.user) {
      ctxLogin(result.user);
      setLocation(result.user.role === 'instructor' ? '/instructor/dashboard' : '/student/dashboard');
    } else {
      setError(result.error ?? 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-accent/30 via-primary/20 to-secondary/20 p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <GraduationCap className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">MOOC Tracker</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-foreground mb-4">Join thousands of ambitious learners</h2>
          <p className="text-muted-foreground text-lg mb-8">Build skills, earn badges, and transform your career with our premium learning platform.</p>
          <div className="space-y-4">
            {[
              { icon: BookOpen, title: 'Access 500+ Courses', desc: 'From web dev to AI/ML and everything in between' },
              { icon: BarChart2, title: 'Track Your Progress', desc: 'Visual dashboards keep you motivated and on track' },
              { icon: Sparkles, title: 'Earn Achievements', desc: 'Collect badges and showcase your learning milestones' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-muted-foreground">© 2025 MOOC Tracker. All rights reserved.</div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-12 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">MOOC Tracker</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Start your learning journey today — it's free</p>

          {error && (
            <div className="mb-5 p-3.5 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {(['student', 'instructor'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    data-testid={`button-role-${r}`}
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      role === r
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted text-muted-foreground hover:border-primary/30'
                    }`}
                  >
                    {r === 'student' ? <BookOpen className="w-5 h-5" /> : <BarChart2 className="w-5 h-5" />}
                    <span className="text-sm font-semibold capitalize">{r}</span>
                    <span className="text-[10px] text-center">{r === 'student' ? 'I want to learn' : 'I want to teach'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  data-testid="input-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

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
                  placeholder="Min 6 characters"
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
              data-testid="button-signup"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login">
              <span className="text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer">Sign in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
