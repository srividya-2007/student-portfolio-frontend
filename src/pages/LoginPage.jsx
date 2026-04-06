import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';
import { login as loginApi } from '../api/services';
import { Eye, EyeOff, LogIn, Shield, GraduationCap } from 'lucide-react';

const demoAccounts = [
  {
    label: 'Admin Demo',
    icon: <Shield size={16} />,
    email: 'admin@portfoliotrack.com',
    password: 'Admin@123',
    helper: 'Teacher / institution review account',
  },
  {
    label: 'Student Demo',
    icon: <GraduationCap size={16} />,
    email: 'student@portfoliotrack.com',
    password: 'student123',
    helper: 'Student portfolio account',
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const applyDemoAccount = (account) => {
    setForm({ email: account.email, password: account.password });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi(form);
      login(response.data);
      toast.success('Welcome back!');
      navigate(response.data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <h1>Portfolio<span>Track</span></h1>
          <p>Sign in as admin or student</p>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {demoAccounts.map((account) => (
            <button
              key={account.label}
              type="button"
              onClick={() => applyDemoAccount(account)}
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', width: '100%' }}
            >
              {account.icon}
              <span>{account.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--gray-500)' }}>{account.helper}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary-light)' }}>Forgot password?</Link>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPass ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button id="login-btn" type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            <LogIn size={16} /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', padding: '0.9rem 1rem', borderRadius: 10, background: 'var(--gray-50)', color: 'var(--gray-600)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Students can create accounts from the registration page. Admin accounts are intended for teachers and institutions and sign in from this page.
        </div>

        <div className="auth-divider">Student account needed? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Register</Link></div>
      </div>
    </div>
  );
}
