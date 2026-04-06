import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi } from '../api/services';
import { Eye, EyeOff, UserPlus, Shield } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: 'STUDENT', studentId: '', department: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const isStudent = form.role === 'STUDENT';

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.role) {
      toast.error('Please fill all fields');
      return;
    }
    if (isStudent && (!form.studentId || !form.department)) {
      toast.error('Student ID and department are required for student registration');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await registerApi({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        studentId: isStudent ? form.studentId : '',
        department: form.department,
      });
      toast.success(`${form.role === 'ADMIN' ? 'Admin' : 'Student'} account created! Please sign in.`);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <h1>Portfolio<span>Track</span></h1>
          <p>Create your account</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'var(--gray-50)', borderRadius: 12, padding: '0.9rem 1rem', marginBottom: '1.25rem' }}>
          <Shield size={18} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
            Choose the role you want while creating the account. Students can add academic details, and admins can register directly from this page too.
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="fullName" type="text" className="form-control" placeholder="John Doe" value={form.fullName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-control" value={form.role} onChange={handleChange}>
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>

          {isStudent && (
            <>
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input name="studentId" type="text" className="form-control" placeholder="22BCE7890" value={form.studentId} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <select name="department" className="form-control" value={form.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  <option>Computer Science & Engineering</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                  <option>Electronics & Communication</option>
                  <option>Information Technology</option>
                </select>
              </div>
            </>
          )}

          {!isStudent && (
            <div className="form-group">
              <label className="form-label">Department / Institution (optional)</label>
              <input name="department" type="text" className="form-control" placeholder="CSE Department / KL University" value={form.department} onChange={handleChange} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input name="password" type={showPass ? 'text' : 'password'} className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input name="confirmPassword" type="password" className="form-control" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            <UserPlus size={16} /> {loading ? 'Creating account...' : `Create ${form.role === 'ADMIN' ? 'Admin' : 'Student'} Account`}
          </button>
        </form>

        <div className="auth-divider">Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign In</Link></div>
      </div>
    </div>
  );
}
