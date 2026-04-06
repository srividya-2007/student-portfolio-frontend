import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { createProject } from '../../api/services';
import { ArrowLeft, Save } from 'lucide-react';

const CATEGORIES = ['Web Development','Mobile App','Machine Learning','Data Science','IoT','Cybersecurity','Game Development','Blockchain','Other'];

export default function CreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', category:'', techStack:'', githubUrl:'', liveUrl:'', documentationUrl:'' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) { toast.error('Title, description, and category are required'); return; }
    setLoading(true);
    try {
      const res = await createProject(form);
      toast.success('Project submitted for review!');
      navigate(`/projects/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
              <button onClick={() => navigate('/projects')} className="btn btn-secondary btn-sm"><ArrowLeft size={16}/></button>
              <h1 className="page-title" style={{margin:0}}>Submit New Project</h1>
            </div>
          </div>

          <div className="card" style={{maxWidth:760}}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Title <span style={{color:'var(--danger)'}}>*</span></label>
                <input name="title" className="form-control" placeholder="e.g. AI-Powered Study Planner" value={form.title} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Description <span style={{color:'var(--danger)'}}>*</span></label>
                <textarea name="description" className="form-control" rows={5} placeholder="Describe your project, its purpose, what problem it solves…" value={form.description} onChange={handleChange} />
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group">
                  <label className="form-label">Category <span style={{color:'var(--danger)'}}>*</span></label>
                  <select name="category" className="form-control" value={form.category} onChange={handleChange}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tech Stack</label>
                  <input name="techStack" className="form-control" placeholder="React, Spring Boot, MySQL…" value={form.techStack} onChange={handleChange} />
                  <span style={{fontSize:'0.75rem',color:'var(--gray-500)'}}>Comma-separated</span>
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input name="githubUrl" type="url" className="form-control" placeholder="https://github.com/…" value={form.githubUrl} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Live Demo URL</label>
                  <input name="liveUrl" type="url" className="form-control" placeholder="https://…" value={form.liveUrl} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Documentation / Report URL</label>
                <input name="documentationUrl" type="url" className="form-control" placeholder="https://drive.google.com/…" value={form.documentationUrl} onChange={handleChange} />
              </div>

              <div style={{display:'flex',gap:'1rem',justifyContent:'flex-end',marginTop:'1.5rem'}}>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/projects')}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={16}/> {loading ? 'Submitting…' : 'Submit Project'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
