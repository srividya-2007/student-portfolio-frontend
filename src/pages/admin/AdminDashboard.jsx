import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getAdminDashboard } from '../../api/services';
import { Users, FolderOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STATUS_COLORS = { APPROVED:'badge-green', PENDING:'badge-yellow', REJECTED:'badge-red', UNDER_REVIEW:'badge-blue' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(r => setData(r.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = data ? [
    { name: 'Pending', value: data.pendingCount, color: '#F59E0B' },
    { name: 'Approved', value: data.approvedCount, color: '#10B981' },
    { name: 'Rejected', value: data.rejectedCount, color: '#EF4444' },
    { name: 'Under Review', value: data.underReviewCount || 0, color: '#3B82F6' },
  ] : [];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p style={{color:'var(--gray-500)',marginTop:'0.25rem'}}>Monitor all student projects and activity</p>
            </div>
            <Link to="/admin/projects" className="btn btn-primary">Review Projects</Link>
          </div>

          {loading ? <div className="loading-center"><div className="spinner"/></div> : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon"><Users size={22} color="var(--primary-light)"/></div>
                  <div><div className="stat-number">{data?.totalStudents || 0}</div><div className="stat-label">Total Students</div></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><FolderOpen size={22} color="var(--primary-light)"/></div>
                  <div><div className="stat-number">{data?.totalProjects || 0}</div><div className="stat-label">Total Projects</div></div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon"><CheckCircle size={22} color="var(--success)"/></div>
                  <div><div className="stat-number" style={{color:'var(--success)'}}>{data?.approvedCount || 0}</div><div className="stat-label">Approved</div></div>
                </div>
                <div className="stat-card yellow">
                  <div className="stat-icon"><Clock size={22} color="var(--warning)"/></div>
                  <div><div className="stat-number" style={{color:'var(--warning)'}}>{data?.pendingCount || 0}</div><div className="stat-label">Pending</div></div>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
                {/* Chart */}
                <div className="card">
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.25rem'}}>
                    <TrendingUp size={18} color="var(--primary-light)"/>
                    <h2 className="card-title" style={{margin:0}}>Project Status Distribution</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} barSize={36}>
                      <XAxis dataKey="name" tick={{fontSize:12}} />
                      <YAxis allowDecimals={false} tick={{fontSize:12}} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6,6,0,0]}>
                        {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Projects */}
                <div className="card">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem'}}>
                    <h2 className="card-title" style={{margin:0}}>Recent Submissions</h2>
                    <Link to="/admin/projects" style={{fontSize:'0.875rem',color:'var(--primary-light)'}}>View all →</Link>
                  </div>
                  {data?.recentProjects?.length === 0 ? (
                    <div className="empty-state"><p>No recent projects</p></div>
                  ) : (
                    <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                      {(data?.recentProjects || []).slice(0,5).map(p => (
                        <div key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.6rem 0',borderBottom:'1px solid var(--gray-100)'}}>
                          <div>
                            <p style={{fontWeight:600,fontSize:'0.875rem'}}>{p.title}</p>
                            <p style={{color:'var(--gray-500)',fontSize:'0.78rem'}}>{p.studentName}</p>
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                            <span className={`badge ${STATUS_COLORS[p.status]||'badge-gray'}`}>{p.status}</span>
                            <Link to={`/admin/projects/${p.id}`} className="btn btn-sm btn-outline">Review</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
