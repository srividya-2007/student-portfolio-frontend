import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getProject, updateProject } from '../../api/services';
import { ArrowLeft, Save } from 'lucide-react';

const CATEGORIES = ['Web Development', 'Mobile App', 'Machine Learning', 'Data Science', 'IoT', 'Cybersecurity', 'Game Development', 'Blockchain', 'Other'];

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', techStack: '', githubUrl: '', liveUrl: '', documentationUrl: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProject(id)
      .then((response) => {
        const project = response.data;
        setForm({
          title: project.title || '',
          description: project.description || '',
          category: project.category || '',
          techStack: project.techStack || '',
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          documentationUrl: project.documentationUrl || '',
        });
      })
      .catch(() => {
        toast.error('Failed to load project');
        navigate('/projects');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title || !form.description || !form.category) {
      toast.error('Required fields missing');
      return;
    }

    setSaving(true);
    try {
      await updateProject(id, form);
      toast.success('Project updated!');
      navigate(`/projects/${id}`);
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
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
              <button onClick={() => navigate(`/projects/${id}`)} className="btn btn-secondary btn-sm"><ArrowLeft size={16} /></button>
              <h1 className="page-title" style={{ margin: 0 }}>Edit Project</h1>
            </div>
          </div>

          <div className="card" style={{ maxWidth: 760 }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input name="title" className="form-control" value={form.title} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-control" rows={5} value={form.description} onChange={handleChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tech Stack</label>
                  <input name="techStack" className="form-control" placeholder="Comma-separated" value={form.techStack} onChange={handleChange} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input name="githubUrl" type="url" className="form-control" value={form.githubUrl} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Live Demo URL</label>
                  <input name="liveUrl" type="url" className="form-control" value={form.liveUrl} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Documentation URL</label>
                <input name="documentationUrl" type="url" className="form-control" value={form.documentationUrl} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(`/projects/${id}`)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}><Save size={16} />{saving ? 'Saving...' : ' Save Changes'}</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
