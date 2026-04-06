import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getProjects } from '../../api/services';
import { Search, Eye, Clock, AlertCircle } from 'lucide-react';

const STATUS_COLORS = { APPROVED: 'badge-green', PENDING: 'badge-yellow', REJECTED: 'badge-red', UNDER_REVIEW: 'badge-blue' };

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((response) => setProjects(response.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (statusFilter !== 'ALL' && project.status !== statusFilter) {
      return false;
    }

    if (!search) {
      return true;
    }

    const searchTerm = search.toLowerCase();
    return (
      project.title?.toLowerCase().includes(searchTerm) ||
      project.studentName?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <h1 className="page-title">All Projects</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-yellow"><Clock size={12} /> {projects.filter((project) => project.status === 'PENDING').length} pending</span>
              <span className="badge badge-blue"><AlertCircle size={12} /> {projects.filter((project) => project.status === 'UNDER_REVIEW').length} reviewing</span>
            </div>
          </div>

          {/* Filters */}
          <div className="search-bar">
            <div className="search-input-wrap">
              <Search size={16} />
              <input
                className="form-control search-input"
                placeholder="Search by project or student name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            {['ALL', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              >
                {status === 'ALL' ? 'All' : status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Student</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>No projects found</td></tr>
                    ) : filteredProjects.map((project) => (
                      <tr key={project.id}>
                        <td>
                          <strong style={{ fontSize: '0.9rem' }}>{project.title}</strong>
                          {project.techStack && <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>{project.techStack.split(',').slice(0, 2).join(', ')}</p>}
                        </td>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{project.studentName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{project.studentId}</div>
                        </td>
                        <td><span className="badge badge-blue">{project.category}</span></td>
                        <td><span className={`badge ${STATUS_COLORS[project.status] || 'badge-gray'}`}>{project.status}</span></td>
                        <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{new Date(project.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/admin/projects/${project.id}`} className="btn btn-primary btn-sm">
                            <Eye size={14} /> Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
