import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getAllStudents, toggleUserStatus } from '../../api/services';
import { Search, UserCheck, UserX, FolderOpen } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllStudents()
      .then((response) => setStudents(response.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter((student) => {
    if (!search) {
      return true;
    }

    const searchTerm = search.toLowerCase();
    return (
      student.fullName?.toLowerCase().includes(searchTerm) ||
      student.email?.toLowerCase().includes(searchTerm) ||
      student.studentId?.toLowerCase().includes(searchTerm)
    );
  });

  const handleToggleStatus = async (id) => {
    try {
      const response = await toggleUserStatus(id);
      setStudents((currentStudents) => currentStudents.map(
        (student) => (student.id === id ? { ...student, active: response.data.active } : student),
      ));
      toast.success('Student status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const initials = (name) => name?.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <h1 className="page-title">Students</h1>
            <span className="badge badge-blue">{students.length} registered</span>
          </div>

          <div className="search-bar">
            <div className="search-input-wrap">
              <Search size={16} />
              <input
                className="form-control search-input"
                placeholder="Search by name, email, or ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>Student</th><th>Department</th><th>Projects</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0
                      ? <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)' }}>No students found</td></tr>
                      : filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div className="avatar" style={{ background: 'var(--primary)', color: 'white', fontSize: '0.75rem', width: 36, height: 36 }}>{initials(student.fullName)}</div>
                              <div>
                                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{student.fullName}</p>
                                <p style={{ fontSize: '0.775rem', color: 'var(--gray-500)' }}>{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>{student.department || '-'}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                              <FolderOpen size={14} color="var(--gray-500)" /> {student.projectCount || 0}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${student.active !== false ? 'badge-green' : 'badge-red'}`}>
                              {student.active !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '-'}</td>
                          <td>
                            <button
                              onClick={() => handleToggleStatus(student.id)}
                              className={`btn btn-sm ${student.active !== false ? 'btn-danger' : 'btn-success'}`}
                            >
                              {student.active !== false ? <><UserX size={13} /> Disable</> : <><UserCheck size={13} /> Enable</>}
                            </button>
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
