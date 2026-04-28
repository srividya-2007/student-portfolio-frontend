import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword, resetPassword, verifyResetOtp } from '../api/services';
import { getApiErrorMessage } from '../api/axios';
import { ArrowLeft, CheckCircle2, KeyRound, Mail, RefreshCw, ShieldCheck } from 'lucide-react';

const STEP_COPY = {
  request: {
    title: 'Request OTP',
    description: 'Enter your email and we will send a 6-digit reset code.',
  },
  verify: {
    title: 'Verify OTP',
    description: 'Check your inbox, then enter the code to continue.',
  },
  reset: {
    title: 'Set New Password',
    description: 'Create a new password after your OTP is verified.',
  },
};

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentStepCopy = STEP_COPY[step];

  const handleSendOtp = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error('Enter your email');
      return;
    }

    setSending(true);
    try {
      await forgotPassword(email.trim());
      setStep('verify');
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to send OTP'));
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!otp.trim()) {
      toast.error('Enter the 6-digit OTP');
      return;
    }

    setVerifying(true);
    try {
      await verifyResetOtp({ email: email.trim(), otp: otp.trim() });
      setStep('reset');
      toast.success('OTP verified');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to verify OTP'));
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Enter and confirm your new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setResetting(true);
    try {
      await resetPassword({ email: email.trim(), otp: otp.trim(), newPassword });
      setCompleted(true);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to reset password'));
    } finally {
      setResetting(false);
    }
  };

  const resendOtp = async () => {
    setSending(true);
    try {
      await forgotPassword(email.trim());
      toast.success('A fresh OTP has been sent');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to resend OTP'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <h1>Portfolio<span>Track</span></h1>
          <p>Secure password reset with email OTP</p>
        </div>

        {completed ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0 0.5rem' }}>
            <div style={{ width: 68, height: 68, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={30} color="#16A34A" />
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>Password updated</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
              Your password has been reset for <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: '0.85rem', marginBottom: '1.35rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.9rem 1rem', borderRadius: 12, background: 'var(--gray-50)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step === 'request' && <Mail size={18} color="var(--primary-light)" />}
                  {step === 'verify' && <ShieldCheck size={18} color="var(--primary-light)" />}
                  {step === 'reset' && <KeyRound size={18} color="var(--primary-light)" />}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{currentStepCopy.title}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.15rem' }}>{currentStepCopy.description}</p>
                </div>
              </div>

              <div style={{ padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid var(--gray-200)', background: '#F8FAFC', fontSize: '0.84rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                If SMTP is not configured in local development, the generated OTP is printed in the backend logs so you can still test the flow.
              </div>
            </div>

            {step === 'request' && (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={sending}>
                  <Mail size={16} /> {sending ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyOtp}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={email} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">6-digit OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123456"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={verifying}>
                  <ShieldCheck size={16} /> {verifying ? 'Verifying...' : 'Verify OTP'}
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStep('request')}>
                    Change Email
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={resendOtp} disabled={sending}>
                    <RefreshCw size={14} /> {sending ? 'Sending...' : 'Resend OTP'}
                  </button>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label className="form-label">Verified Email</label>
                  <input type="email" className="form-control" value={email} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">Verified OTP</label>
                  <input type="text" className="form-control" value={otp} readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={resetting}>
                  <KeyRound size={16} /> {resetting ? 'Updating Password...' : 'Reset Password'}
                </button>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: 'var(--gray-500)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <ArrowLeft size={14} /> Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
