import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getProject, reviewProject, addFeedback } from '../../api/services';
import { ArrowLeft, CheckCircle, XCircle, Eye, MessageSquare, GitBranch, ExternalLink } from 'lucide-react';

const STATUS_COLORS = { APPROVED: 'badge-green', PENDING: 'badge-yellow', REJECTED: 'badge-red', UNDER_REVIEW: 'badge-blue' };

export default function AdminProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewComment, setReviewComment] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [addingFb, setAddingFb] = useState(false);

  useEffect(() => {
    getProject(id)
      .then((response) => setProject(response.data))
      .catch(() => {
        toast.error('Project not found');
        navigate('/admin/projects');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleReview = async (status) => {
    setReviewing(true);

    try {
      const response = await reviewProject(id, status, reviewComment);
      setProject(response.data);
      setReviewComment('');
      toast.success(`Project ${status.toLowerCase()}`);
    } catch {
      toast.error('Review failed');
    } finally {
      setReviewing(false);
    }
  };

  const handleFeedback = async (event) => {
    event.preventDefault();

    if (!feedbackText.trim()) {
      toast.error('Enter feedback text');
      return;
    }

    setAddingFb(true);
    try {
      await addFeedback(id, { comment: feedbackText });
      setProject((currentProject) => ({
        ...currentProject,
        feedbacks: [
          ...(currentProject.feedbacks || []),
          { comment: feedbackText, createdAt: new Date().toISOString(), adminName: 'Admin' },
        ],
      }));
      setFeedbackText('');
      toast.success('Feedback sent to student!');
    } catch {
      toast.error('Failed to send feedback');
    } finally {
      setAddingFb(false);
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
              <button onClick={() => navigate('/admin/projects')} className="btn btn-secondary btn-sm"><ArrowLeft size={16} /></button>
              <h1 className="page-title" style={{ margin: 0 }}>{project?.title}</h1>
              <span className={`badge ${STATUS_COLORS[project?.status] || 'badge-gray'}`}>{project?.status}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card">
                <h2 className="card-title">Project Description</h2>
                <p style={{ color: 'var(--gray-700)', lineHeight: 1.7 }}>{project?.description}</p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  {project?.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm"><GitBranch size={14} /> GitHub</a>}
                  {project?.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm"><ExternalLink size={14} /> Live Demo</a>}
                </div>
              </div>

              {/* Review Actions */}
              {project?.status !== 'APPROVED' && (
                <div className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Eye size={18} color="var(--primary-light)" />
                    <h2 className="card-title" style={{ margin: 0 }}>Review Project</h2>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Review Comment (optional)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Leave a comment for the student..."
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button onClick={() => handleReview('UNDER_REVIEW')} className="btn btn-outline" disabled={reviewing}>
                      Mark Under Review
                    </button>
                    <button onClick={() => handleReview('APPROVED')} className="btn btn-success" disabled={reviewing}>
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button onClick={() => handleReview('REJECTED')} className="btn btn-danger" disabled={reviewing}>
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              )}

              {project?.status === 'APPROVED' && (
                <div className="card" style={{ borderLeft: '4px solid var(--success)', background: '#F0FDF4' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 600 }}>
                    <CheckCircle size={18} /> This project has been approved
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <MessageSquare size={18} color="var(--primary-light)" />
                  <h2 className="card-title" style={{ margin: 0 }}>Send Feedback</h2>
                </div>
                <form onSubmit={handleFeedback}>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Write detailed feedback for the student..."
                      value={feedbackText}
                      onChange={(event) => setFeedbackText(event.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={addingFb}>
                    <MessageSquare size={15} /> {addingFb ? 'Sending...' : 'Send Feedback'}
                  </button>
                </form>

                {project?.feedbacks?.length > 0 && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--gray-200)', paddingTop: '1rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem', color: 'var(--gray-700)' }}>Previous Feedback</p>
                    {project.feedbacks.map((feedback, index) => (
                      <div key={index} style={{ background: 'var(--gray-50)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.5rem' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{feedback.comment}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.4rem' }}>{new Date(feedback.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card">
                <h2 className="card-title">Student Info</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Name</p><p style={{ fontWeight: 600 }}>{project?.studentName}</p></div>
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Student ID</p><p>{project?.studentId}</p></div>
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Department</p><p>{project?.department}</p></div>
                </div>
              </div>

              <div className="card">
                <h2 className="card-title">Project Details</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Category</p><span className="badge badge-blue">{project?.category}</span></div>
                  <div><p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 600 }}>Submitted</p><p style={{ fontSize: '0.875rem' }}>{project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : '-'}</p></div>
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
