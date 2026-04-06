import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '../api/services';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch {
      toast.error('Failed to send reset email');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <h1>Portfolio<span>Track</span></h1>
          <p>Reset your password</p>
        </div>

        {sent ? (
          <div style={{textAlign:'center',padding:'2rem 0'}}>
            <div style={{width:64,height:64,background:'#D1FAE5',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}>
              <Mail size={28} color="#10B981" />
            </div>
            <h3 style={{marginBottom:'0.5rem'}}>Check your inbox!</h3>
            <p style={{color:'var(--gray-500)',fontSize:'0.9rem'}}>We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="btn btn-primary" style={{marginTop:'1.5rem',display:'inline-flex'}}>Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              <p style={{fontSize:'0.8rem',color:'var(--gray-500)',marginTop:'0.4rem'}}>We'll send a password reset link to this email.</p>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%'}} disabled={loading}>
              <Mail size={16} /> {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
            <div style={{textAlign:'center',marginTop:'1rem'}}>
              <Link to="/login" style={{color:'var(--gray-500)',fontSize:'0.875rem',display:'inline-flex',alignItems:'center',gap:'0.3rem'}}>
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
