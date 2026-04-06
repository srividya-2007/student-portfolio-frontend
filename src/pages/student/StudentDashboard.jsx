import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/useAuth';
import { getMyProjects, getUnreadCount } from '../../api/services';
import { FolderOpen, CheckCircle, Clock, AlertCircle, Plus, TrendingUp } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyProjects(), getUnreadCount()])
      .then(([projectResponse, unreadResponse]) => {
        setProjects(projectResponse.data);
        setUnread(unreadResponse.data.count || 0);
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const total = projects.length;
  const approved = projects.filter((project) => project.status === 'APPROVED').length;
  const pending = projects.filter((project) => project.status === 'PENDING').length;
  const rejected = projects.filter((project) => project.status === 'REJECTED').length;
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const statusBadge = (status) => {
    const map = {
      APPROVED: 'badge-green',
      PENDING: 'badge-yellow',
      REJECTED: 'badge-red',
      UNDER_REVIEW: 'badge-blue',
    };

    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <div>
              <h1 className="page-title">Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
              <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                {unread > 0
                  ? `You have ${unread} unread notification${unread === 1 ? '' : 's'} and ${total} project${total === 1 ? '' : 's'} in your portfolio.`
                  : "Here's an overview of your project portfolio"}
              </p>
            </div>
            <Link to="/projects/new" className="btn btn-primary">
              <Plus size={16} /> New Project
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><FolderOpen size={22} color="var(--primary-light)" /></div>
              <div><div className="stat-number">{total}</div><div className="stat-label">Total Projects</div></div>
            </div>
            <div className="stat-card green">
              <div className="stat-icon"><CheckCircle size={22} color="var(--success)" /></div>
              <div><div className="stat-number" style={{ color: 'var(--success)' }}>{approved}</div><div className="stat-label">Approved</div></div>
            </div>
            <div className="stat-card yellow">
              <div className="stat-icon"><Clock size={22} color="var(--warning)" /></div>
              <div><div className="stat-number" style={{ color: 'var(--warning)' }}>{pending}</div><div className="stat-label">Pending Review</div></div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon"><AlertCircle size={22} color="var(--danger)" /></div>
              <div><div className="stat-number" style={{ color: 'var(--danger)' }}>{rejected}</div><div className="stat-label">Rejected</div></div>
            </div>
          </div>

          {/* Progress */}
          {total > 0 && (
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <TrendingUp size={18} color="var(--primary-light)" />
                <span className="card-title" style={{ margin: 0 }}>Approval Rate</span>
                <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--primary-light)' }}>{Math.round((approved / total) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(approved / total) * 100}%` }} />
              </div>
            </div>
          )}

          {/* Recent Projects */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>Recent Projects</h2>
              <Link to="/projects" style={{ fontSize: '0.875rem', color: 'var(--primary-light)' }}>View all -&gt;</Link>
            </div>

            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : recentProjects.length === 0 ? (
              <div className="empty-state">
                <FolderOpen size={48} />
                <p>No projects yet. <Link to="/projects/new">Create your first project!</Link></p>
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Project</th><th>Category</th><th>Status</th><th>Date</th><th></th></tr>
                  </thead>
                  <tbody>
                    {recentProjects.map((project) => (
                      <tr key={project.id}>
                        <td><strong>{project.title}</strong></td>
                        <td><span className="badge badge-blue">{project.category}</span></td>
                        <td>{statusBadge(project.status)}</td>
                        <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{new Date(project.createdAt).toLocaleDateString()}</td>
                        <td><Link to={`/projects/${project.id}`} className="btn btn-sm btn-outline">View</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
