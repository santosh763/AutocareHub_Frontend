import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAuth } from '../hooks/useAuth';
import { loginThunk, registerThunk, clearError } from '../store/slices/authSlice';
import { Button } from '../components/ui/Button';
import { Input, PasswordInput } from '../components/ui/Input';

// ─── Feature list shown on the left panel ────────────────────────────────────
const features = [
  { icon: '🔧', title: 'Certified Mechanics', desc: 'All mechanics verified & background checked' },
  { icon: '📍', title: 'Doorstep Service', desc: 'We come to your home or office' },
  { icon: '💳', title: 'Secure Payments', desc: 'Razorpay-powered, fully encrypted' },
  { icon: '📊', title: 'Live Tracking', desc: 'Track your service in real time' },
];

// ─── Login Page ───────────────────────────────────────────────────────────────
export const Login: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { isAuthenticated, loading, error } = useAuth();

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
    return () => { dispatch(clearError()); };
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name.split(' ')[0]}!`);
      navigate(result.payload.user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }else{
      toast.error('Login failed');
    }
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to your account" isLogin>
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        leftIcon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        }
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      <div className="flex justify-end">
        <button type="button" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
          Forgot password?
        </button>
      </div>
      <Button type="submit" fullWidth loading={loading} size="lg">
        Sign In
      </Button>
    </form>
    <p className="text-center text-sm text-gray-500 dark:text-zinc-400 mt-5">
      Don't have an account?{' '}
      <Link to="/register" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
        Create one
      </Link>
    </p>
  </AuthLayout>;
};

// ─── Register Page ────────────────────────────────────────────────────────────
export const Register: React.FC = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { isAuthenticated, loading, error } = useAuth();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
    return () => { dispatch(clearError()); };
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password !== confirm)         { toast.error('Passwords do not match'); return; }
    if (password.length < 6)          { toast.error('Password must be at least 6 characters'); return; }

    const result = await dispatch(registerThunk({ name, email, password }));
    if (registerThunk.fulfilled.match(result)) {
      toast.success('Account created! Welcome to AutoCare Hub 🎉');
      navigate('/dashboard', { replace: true });
    }
  };

  return <AuthLayout title="Create your account" subtitle="Start booking services in minutes">
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full name"
        type="text"
        placeholder="Rahul Sharma"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
      />
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        leftIcon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        }
      />
      <PasswordInput
        label="Password"
        placeholder="Min. 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />
      <PasswordInput
        label="Confirm password"
        placeholder="Repeat your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        autoComplete="new-password"
        required
        error={confirm && password !== confirm ? 'Passwords do not match' : undefined}
      />
      <Button type="submit" fullWidth loading={loading} size="lg">
        Create Account
      </Button>
    </form>
    <p className="text-center text-sm text-gray-500 dark:text-zinc-400 mt-5">
      Already have an account?{' '}
      <Link to="/login" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
        Sign in
      </Link>
    </p>
  </AuthLayout>;
};

// ─── Shared Auth Layout ───────────────────────────────────────────────────────
interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  isLogin?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => (
  <div className="min-h-screen flex">
    {/* Left panel */}
    <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-brand-500 to-brand-400 flex-col justify-between p-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-brand-500/60 to-transparent pointer-events-none" />

      <Link to="/" className="flex items-center gap-2.5 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-lg">🔧</div>
        <span className="font-display font-bold text-white text-lg">AutoCare Hub</span>
      </Link>

      <div className="relative z-10">
        <h2 className="font-display font-bold text-3xl text-white mb-3">Vehicle service,<br />simplified.</h2>
        <p className="text-brand-100 text-sm mb-8">Join 50,000+ customers who trust us for honest, expert car care.</p>
        <div className="space-y-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-white/12 border border-white/20 flex items-center justify-center text-base flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{f.title}</div>
                <div className="text-xs text-brand-100">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="text-xs text-brand-200 relative z-10">© 2026 AutoCare Hub. All rights reserved.</p>
    </div>

    {/* Right panel */}
    <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-200 flex items-center justify-center text-white text-sm">🔧</div>
            <span className="font-display font-bold text-gray-900 dark:text-zinc-100 text-sm">AutoCare Hub</span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-zinc-50 mb-1">{title}</h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">{subtitle}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-card p-6">
          {children}
        </div>
      </motion.div>
    </div>
  </div>
);
