import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getMyProjects, deleteProject } from '../../api/services';
import { Plus, Search, FolderOpen, Trash2, Edit, Eye } from 'lucide-react';

const STATUS_COLORS = { APPROVED:'badge-green', PENDING:'badge-yellow', REJECTED:'badge-red', UNDER_REVIEW:'badge-blue' };

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getMyProjects()
      .then(r => { setProjects(r.data); setFiltered(r.data); })
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = projects;
    if (statusFilter !== 'ALL') list = list.filter(p => p.status === statusFilter);
    if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [search, statusFilter, projects]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <h1 className="page-title">My Projects</h1>
            <Link to="/projects/new" className="btn btn-primary"><Plus size={16} /> New Project</Link>
          </div>

          {/* Filters */}
          <div className="search-bar">
            <div className="search-input-wrap">
              <Search size={16} />
              <input className="form-control search-input" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {['ALL','PENDING','UNDER_REVIEW','APPROVED','REJECTED'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}>
                {s === 'ALL' ? 'All' : s.replace('_',' ')}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state card">
              <FolderOpen size={52} />
              <p style={{marginTop:'0.75rem'}}>No projects found. <Link to="/projects/new">Create your first project!</Link></p>
            </div>
          ) : (
            <div className="projects-grid">
              {filtered.map(p => (
                <div className="card" key={p.id} style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <span className={`badge ${STATUS_COLORS[p.status] || 'badge-gray'}`}>{p.status}</span>
                    <span className="badge badge-blue">{p.category}</span>
                  </div>
                  <h3 style={{fontSize:'1.05rem',fontWeight:700,color:'var(--gray-900)'}}>{p.title}</h3>
                  <p style={{fontSize:'0.875rem',color:'var(--gray-500)',lineHeight:1.5,flex:1}}>
                    {p.description?.slice(0,120)}{p.description?.length > 120 ? '…' : ''}
                  </p>
                  {p.techStack && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem'}}>
                      {p.techStack.split(',').slice(0,4).map(t => (
                        <span key={t} style={{background:'var(--secondary)',color:'var(--primary)',padding:'0.2rem 0.55rem',borderRadius:'50px',fontSize:'0.75rem',fontWeight:500}}>{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div style={{display:'flex',gap:'0.5rem',marginTop:'0.5rem'}}>
                    <Link to={`/projects/${p.id}`} className="btn btn-outline btn-sm" style={{flex:1,justifyContent:'center'}}><Eye size={14} /> View</Link>
                    <Link to={`/projects/${p.id}/edit`} className="btn btn-secondary btn-sm"><Edit size={14} /></Link>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm" disabled={deleting === p.id}><Trash2 size={14} /></button>
                  </div>
                  <p style={{fontSize:'0.75rem',color:'var(--gray-500)'}}>{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
