import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getPortfolio, getStudentProjects } from '../../api/services';
import { GitBranch, ExternalLink, Mail, BookOpen } from 'lucide-react';

export default function Portfolio() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([getPortfolio(user.id), getStudentProjects(user.id)])
      .then(([pf, pr]) => { setPortfolio(pf.data); setProjects(pr.data); })
      .catch(() => toast.error('Failed to load portfolio'));
  }, [user]);

  const approved = projects.filter(p => p.status === 'APPROVED');

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <h1 className="page-title">My Portfolio</h1>
            <span className="badge badge-blue">Public Showcase</span>
          </div>

          {/* Profile Card */}
          <div className="card" style={{display:'flex',gap:'2rem',alignItems:'flex-start',marginBottom:'1.5rem',flexWrap:'wrap'}}>
            <div className="avatar avatar-xl" style={{background:'var(--primary)',flexShrink:0}}>
              {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div style={{flex:1}}>
              <h2 style={{fontSize:'1.5rem',fontWeight:800,color:'var(--gray-900)'}}>{user?.fullName}</h2>
              <p style={{color:'var(--gray-500)',marginTop:'0.25rem'}}>{user?.studentId} · {user?.department}</p>
              <p style={{color:'var(--gray-500)',display:'flex',alignItems:'center',gap:'0.4rem',marginTop:'0.25rem',fontSize:'0.875rem'}}>
                <Mail size={14}/> {user?.email}
              </p>
              {portfolio?.bio && <p style={{marginTop:'0.75rem',color:'var(--gray-700)',lineHeight:1.7}}>{portfolio.bio}</p>}
              {portfolio?.skills && (
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem',marginTop:'0.75rem'}}>
                  {portfolio.skills.split(',').map(s => (
                    <span key={s} style={{background:'var(--secondary)',color:'var(--primary)',padding:'0.25rem 0.6rem',borderRadius:'50px',fontSize:'0.8rem',fontWeight:500}}>{s.trim()}</span>
                  ))}
                </div>
              )}
              <div style={{display:'flex',gap:'0.75rem',marginTop:'1rem',flexWrap:'wrap'}}>
                {portfolio?.githubUrl && <a href={portfolio.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><GitBranch size={14}/> GitHub</a>}
                {portfolio?.linkedinUrl && <a href={portfolio.linkedinUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><ExternalLink size={14}/> LinkedIn</a>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:'1.5rem'}}>
            <div className="stat-card"><div><div className="stat-number">{projects.length}</div><div className="stat-label">Total Projects</div></div></div>
            <div className="stat-card green"><div><div className="stat-number" style={{color:'var(--success)'}}>{approved.length}</div><div className="stat-label">Approved</div></div></div>
            <div className="stat-card"><div><div className="stat-number">{portfolio?.skills?.split(',').length || 0}</div><div className="stat-label">Skills</div></div></div>
          </div>

          {/* Approved Projects */}
          <div className="card">
            <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.25rem'}}>
              <BookOpen size={18} color="var(--primary-light)"/>
              <h2 className="card-title" style={{margin:0}}>Approved Projects</h2>
            </div>
            {approved.length === 0 ? (
              <div className="empty-state"><p>No approved projects yet. Submit projects for review!</p></div>
            ) : (
              <div className="projects-grid">
                {approved.map(p => (
                  <div key={p.id} className="card" style={{border:'1px solid var(--gray-200)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                      <span className="badge badge-green">Approved</span>
                      <span className="badge badge-blue">{p.category}</span>
                    </div>
                    <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:'0.5rem'}}>{p.title}</h3>
                    <p style={{fontSize:'0.85rem',color:'var(--gray-500)',lineHeight:1.5}}>{p.description?.slice(0,120)}…</p>
                    {p.techStack && (
                      <div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem',marginTop:'0.75rem'}}>
                        {p.techStack.split(',').slice(0,4).map(t=>(
                          <span key={t} style={{background:'var(--secondary)',color:'var(--primary)',padding:'0.15rem 0.5rem',borderRadius:'50px',fontSize:'0.75rem'}}>{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}>
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><GitBranch size={13}/> Code</a>}
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><ExternalLink size={13}/> Demo</a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
