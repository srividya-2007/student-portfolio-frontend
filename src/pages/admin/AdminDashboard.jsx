import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getAdminDashboard } from '../../api/services';
import { BarChart3, CheckCircle, Clock, FolderOpen, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const STATUS_COLORS = { APPROVED: 'badge-green', PENDING: 'badge-yellow', REJECTED: 'badge-red', UNDER_REVIEW: 'badge-blue' };
const CHART_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((response) => setData(response.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const statusCounts = data?.projectStatusDistribution || {};
  const statusChartData = [
    { name: 'Pending', value: statusCounts.PENDING || data?.pendingCount || 0, color: '#F59E0B' },
    { name: 'Approved', value: statusCounts.APPROVED || data?.approvedCount || 0, color: '#10B981' },
    { name: 'Rejected', value: statusCounts.REJECTED || data?.rejectedCount || 0, color: '#EF4444' },
    { name: 'Under Review', value: statusCounts.UNDER_REVIEW || data?.underReviewCount || 0, color: '#3B82F6' },
  ];

  const categoryData = data?.categoryDistribution || [];
  const techStackData = data?.topTechStack || [];
  const monthlyTrendData = data?.monthlySubmissions || [];
  const allDepartmentData = data?.departmentDistribution || [];
  const departmentData = allDepartmentData.slice(0, 5);
  const resourceCoverage = data?.resourceCoverage || [];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p style={{ color: 'var(--gray-500)', marginTop: '0.25rem' }}>Monitor student projects, resource quality, and submission trends</p>
            </div>
            <Link to="/admin/projects" className="btn btn-primary">Review Projects</Link>
          </div>

          {loading ? <div className="loading-center"><div className="spinner" /></div> : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon"><Users size={22} color="var(--primary-light)" /></div>
                  <div><div className="stat-number">{data?.totalStudents || 0}</div><div className="stat-label">Total Students</div></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon"><FolderOpen size={22} color="var(--primary-light)" /></div>
                  <div><div className="stat-number">{data?.totalProjects || 0}</div><div className="stat-label">Total Projects</div></div>
                </div>
                <div className="stat-card green">
                  <div className="stat-icon"><CheckCircle size={22} color="var(--success)" /></div>
                  <div><div className="stat-number" style={{ color: 'var(--success)' }}>{data?.approvedCount || 0}</div><div className="stat-label">Approved</div></div>
                </div>
                <div className="stat-card yellow">
                  <div className="stat-icon"><Clock size={22} color="var(--warning)" /></div>
                  <div><div className="stat-number" style={{ color: 'var(--warning)' }}>{data?.pendingReviews || 0}</div><div className="stat-label">Review Queue</div></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="card">
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Approval Rate</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)', marginTop: '0.4rem' }}>{data?.approvalRate || 0}%</p>
                </div>
                <div className="card">
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Avg Projects / Student</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: '0.4rem' }}>{data?.averageProjectsPerStudent || 0}</p>
                </div>
                <div className="card">
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Departments Active</p>
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)', marginTop: '0.4rem' }}>{allDepartmentData.length}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <TrendingUp size={18} color="var(--primary-light)" />
                    <h2 className="card-title" style={{ margin: 0 }}>Project Status Distribution</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={statusChartData} barSize={36}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {statusChartData.map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <BarChart3 size={18} color="var(--primary-light)" />
                    <h2 className="card-title" style={{ margin: 0 }}>Submission Trend</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <TrendingUp size={18} color="var(--primary-light)" />
                    <h2 className="card-title" style={{ margin: 0 }}>Projects by Category</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={categoryData} dataKey="count" nameKey="category" innerRadius={55} outerRadius={86} paddingAngle={4}>
                        {categoryData.map((entry, index) => <Cell key={`${entry.category}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <BarChart3 size={18} color="var(--primary-light)" />
                    <h2 className="card-title" style={{ margin: 0 }}>Top Tech Stack</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={techStackData} layout="vertical" margin={{ left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                      <YAxis dataKey="tech" type="category" width={90} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <Users size={18} color="var(--primary-light)" />
                    <h2 className="card-title" style={{ margin: 0 }}>Department Activity</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="department" tick={{ fontSize: 11 }} interval={0} angle={-10} height={50} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <FolderOpen size={18} color="var(--primary-light)" />
                    <h2 className="card-title" style={{ margin: 0 }}>Submission Readiness</h2>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {resourceCoverage.map((metric) => (
                      <div key={metric.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
                          <span style={{ color: 'var(--gray-600)' }}>{metric.label}</span>
                          <strong>{metric.value}/{data?.totalProjects || 0}</strong>
                        </div>
                        <div className="progress-bar" style={{ height: 10 }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${data?.totalProjects ? (metric.value / data.totalProjects) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 className="card-title" style={{ margin: 0 }}>Recent Submissions</h2>
                  <Link to="/admin/projects" style={{ fontSize: '0.875rem', color: 'var(--primary-light)' }}>View all -&gt;</Link>
                </div>
                {data?.recentProjects?.length === 0 ? (
                  <div className="empty-state"><p>No recent projects</p></div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {(data?.recentProjects || []).map((project) => (
                      <div key={project.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{project.title}</p>
                          <p style={{ color: 'var(--gray-500)', fontSize: '0.78rem' }}>{project.studentName}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge ${STATUS_COLORS[project.status] || 'badge-gray'}`}>{project.status}</span>
                          <Link to={`/admin/projects/${project.id}`} className="btn btn-sm btn-outline">Review</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
