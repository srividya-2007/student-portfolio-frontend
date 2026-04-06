import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/useAuth';
import { getStudent, updateStudent, updatePortfolio, getPortfolio } from '../../api/services';
import { Save, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ fullName:'', email:'', studentId:'', department:'' });
  const [portfolio, setPortfolio] = useState({ bio:'', skills:'', githubUrl:'', linkedinUrl:'', websiteUrl:'' });
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    getStudent(user.id).then(r => {
      const d = r.data;
      setProfile({ fullName:d.fullName||'', email:d.email||'', studentId:d.studentId||'', department:d.department||'' });
    }).catch(()=>{});
    getPortfolio(user.id).then(r => {
      const p = r.data;
      setPortfolio({ bio:p.bio||'', skills:p.skills||'', githubUrl:p.githubUrl||'', linkedinUrl:p.linkedinUrl||'', websiteUrl:p.websiteUrl||'' });
    }).catch(()=>{});
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateStudent(user.id, profile);
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setSaving(false); }
  };

  const handlePortfolioSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePortfolio(user.id, portfolio);
      toast.success('Portfolio updated!');
    } catch { toast.error('Failed to update portfolio'); }
    finally { setSaving(false); }
  };

  const initials = user?.fullName?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) || 'U';

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <h1 className="page-title">My Profile</h1>
          </div>

          {/* Avatar */}
          <div className="card" style={{display:'flex',alignItems:'center',gap:'1.5rem',marginBottom:'1.5rem'}}>
            <div className="avatar avatar-xl" style={{background:'var(--primary)'}}>{initials}</div>
            <div>
              <h2 style={{fontWeight:700}}>{user?.fullName}</h2>
              <p style={{color:'var(--gray-500)',fontSize:'0.875rem'}}>{user?.email}</p>
              <p style={{color:'var(--gray-500)',fontSize:'0.875rem'}}>{user?.studentId} · {user?.department}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className={`tab${tab==='profile'?' active':''}`} onClick={()=>setTab('profile')}>Account Info</button>
            <button className={`tab${tab==='portfolio'?' active':''}`} onClick={()=>setTab('portfolio')}>Portfolio Settings</button>
          </div>

          {tab === 'profile' && (
            <div className="card" style={{maxWidth:600}}>
              <form onSubmit={handleProfileSave}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={profile.fullName} onChange={e=>setProfile({...profile,fullName:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})} />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                  <div className="form-group">
                    <label className="form-label">Student ID</label>
                    <input className="form-control" value={profile.studentId} onChange={e=>setProfile({...profile,studentId:e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input className="form-control" value={profile.department} onChange={e=>setProfile({...profile,department:e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}><Save size={15}/> {saving?'Saving…':'Save Changes'}</button>
              </form>
            </div>
          )}

          {tab === 'portfolio' && (
            <div className="card" style={{maxWidth:600}}>
              <form onSubmit={handlePortfolioSave}>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-control" rows={4} placeholder="Tell us about yourself…" value={portfolio.bio} onChange={e=>setPortfolio({...portfolio,bio:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Skills <span style={{color:'var(--gray-500)',fontSize:'0.8rem'}}>(comma-separated)</span></label>
                  <input className="form-control" placeholder="React, Java, Python…" value={portfolio.skills} onChange={e=>setPortfolio({...portfolio,skills:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input className="form-control" type="url" placeholder="https://github.com/…" value={portfolio.githubUrl} onChange={e=>setPortfolio({...portfolio,githubUrl:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input className="form-control" type="url" placeholder="https://linkedin.com/in/…" value={portfolio.linkedinUrl} onChange={e=>setPortfolio({...portfolio,linkedinUrl:e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Personal Website</label>
                  <input className="form-control" type="url" placeholder="https://…" value={portfolio.websiteUrl} onChange={e=>setPortfolio({...portfolio,websiteUrl:e.target.value})} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}><Save size={15}/> {saving?'Saving…':'Save Portfolio'}</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
