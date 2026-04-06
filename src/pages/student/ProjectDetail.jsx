import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getProject, deleteProject, addMilestone } from '../../api/services';
import { ArrowLeft, Edit, Trash2, ExternalLink, GitBranch, Plus, CheckCircle } from 'lucide-react';

const STATUS_COLORS = { APPROVED: 'badge-green', PENDING: 'badge-yellow', REJECTED: 'badge-red', UNDER_REVIEW: 'badge-blue' };

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [milestone, setMilestone] = useState({ title: '', description: '', dueDate: '' });
  const [addingMilestone, setAddingMilestone] = useState(false);

  useEffect(() => {
    getProject(id)
      .then((response) => setProject(response.data))
      .catch(() => {
        toast.error('Project not found');
        navigate('/projects');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this project permanently?')) {
      return;
    }

    try {
      await deleteProject(id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleAddMilestone = async (event) => {
    event.preventDefault();

    if (!milestone.title) {
      toast.error('Title required');
      return;
    }

    setAddingMilestone(true);
    try {
      const response = await addMilestone(id, milestone);
      setProject((currentProject) => ({
        ...currentProject,
        milestones: [...(currentProject.milestones || []), response.data],
      }));
      setMilestone({ title: '', description: '', dueDate: '' });
      setShowMilestoneForm(false);
      toast.success('Milestone added!');
    } catch {
      toast.error('Failed to add milestone');
    } finally {
      setAddingMilestone(false);
    }
  };

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => navigate('/projects')} className="btn btn-secondary btn-sm"><ArrowLeft size={16} /></button>
              <h1 className="page-title" style={{ margin: 0 }}>{project?.title}</h1>
              <span className={`badge ${STATUS_COLORS[project?.status] || 'badge-gray'}`}>{project?.status}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to={`/projects/${id}/edit`} className="btn btn-secondary"><Edit size={16} /> Edit</Link>
              <button onClick={handleDelete} className="btn btn-danger"><Trash2 size={16} /> Delete</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <h2 className="card-title">Description</h2>
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.7 }}>{project?.description}</p>
              </div>

              {/* Feedback */}
              {project?.feedbacks?.length > 0 && (
                <div className="card">
                  <h2 className="card-title">Faculty Feedback</h2>
                  {project.feedbacks.map((feedback, index) => (
                    <div key={index} style={{ border: '1px solid var(--gray-200)', borderRadius: 8, padding: '1rem', marginBottom: '0.75rem', background: 'var(--gray-50)' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{feedback.comment}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}>- {feedback.adminName} | {new Date(feedback.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Milestones */}
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 className="card-title" style={{ margin: 0 }}>Milestones</h2>
                  <button onClick={() => setShowMilestoneForm(!showMilestoneForm)} className="btn btn-outline btn-sm"><Plus size={14} /> Add</button>
                </div>

                {showMilestoneForm && (
                  <form onSubmit={handleAddMilestone} style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <input className="form-control" placeholder="Milestone title" value={milestone.title} onChange={(event) => setMilestone({ ...milestone, title: event.target.value })} />
                    </div>
                    <div className="form-group">
                      <input className="form-control" placeholder="Description (optional)" value={milestone.description} onChange={(event) => setMilestone({ ...milestone, description: event.target.value })} />
                    </div>
                    <div className="form-group">
                      <input className="form-control" type="date" value={milestone.dueDate} onChange={(event) => setMilestone({ ...milestone, dueDate: event.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={addingMilestone}>Save Milestone</button>
                  </form>
                )}

                {project?.milestones?.length === 0 && <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>No milestones added yet.</p>}
                {project?.milestones?.map((milestoneItem, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <CheckCircle size={18} color={milestoneItem.completed ? 'var(--success)' : 'var(--gray-300)'} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{milestoneItem.title}</p>
                      {milestoneItem.description && <p style={{ color: 'var(--gray-500)', fontSize: '0.825rem' }}>{milestoneItem.description}</p>}
                      {milestoneItem.dueDate && <p style={{ color: 'var(--gray-500)', fontSize: '0.775rem' }}>Due: {new Date(milestoneItem.dueDate).toLocaleDateString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card">
                <h2 className="card-title">Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Category</p><span className="badge badge-blue">{project?.category}</span></div>
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Submitted</p><p style={{ fontSize: '0.875rem' }}>{project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</p></div>
                  {project?.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><GitBranch size={14} /> GitHub</a>}
                  {project?.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><ExternalLink size={14} /> Live Demo</a>}
                </div>
              </div>

              {project?.techStack && (
                <div className="card">
                  <h2 className="card-title">Tech Stack</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {project.techStack.split(',').map((tech) => (
                      <span key={tech} style={{ background: 'var(--secondary)', color: 'var(--primary)', padding: '0.25rem 0.6rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 500 }}>{tech.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
