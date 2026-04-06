import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FolderOpen, Award, Bell, Shield, Users, BarChart2, GraduationCap, ClipboardCheck } from 'lucide-react';

const features = [
  { icon: <FolderOpen size={28} />, title: 'Project Management', desc: 'Upload and manage all your academic and personal projects in one place with milestones and progress tracking.' },
  { icon: <Award size={28} />, title: 'Portfolio Builder', desc: 'Automatically generate a professional portfolio from your projects, skills, and achievements.' },
  { icon: <Bell size={28} />, title: 'Real-time Notifications', desc: 'Get instant updates when your projects are reviewed, approved, or receive feedback from faculty.' },
  { icon: <Shield size={28} />, title: 'Admin Review System', desc: 'Faculty admins can review projects, provide detailed feedback, and approve or reject submissions.' },
  { icon: <Users size={28} />, title: 'Student Profiles', desc: 'Each student gets a dedicated profile page showcasing their skills, projects, and academic achievements.' },
  { icon: <BarChart2 size={28} />, title: 'Analytics Dashboard', desc: 'Track submission trends, approval rates, and student engagement with detailed analytics.' },
];

const roles = [
  {
    icon: <GraduationCap size={22} />,
    title: 'Student',
    description: 'Upload projects, update your portfolio, add milestones, and track feedback from your institution.',
    actions: [
      { label: 'Create Student Account', to: '/register', primary: true },
      { label: 'Student Sign In', to: '/login', primary: false },
    ],
    credentials: 'Self-register or use demo: student@portfoliotrack.com / student123',
  },
  {
    icon: <ClipboardCheck size={22} />,
    title: 'Admin / Teacher',
    description: 'Review submissions, manage student portfolios, track progress, and provide academic feedback.',
    actions: [
      { label: 'Admin Sign In', to: '/login', primary: true },
    ],
    credentials: 'Default admin: admin@portfoliotrack.com / Admin@123',
  },
];

export default function LandingPage() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="hero">
        <h1>Manage Student Projects<br /><span>Track. Review. Showcase.</span></h1>
        <p>The all-in-one platform for students to upload projects, build portfolios, and receive faculty feedback all in one place.</p>
        <div className="hero-actions">
          <Link to="/register" className="hero-btn-primary">Student Sign Up</Link>
          <Link to="/login" className="hero-btn-outline">Admin or Student Login</Link>
        </div>
      </section>

      <section style={{ padding: '0 2rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>Two roles, one platform</h2>
            <p style={{ color: 'var(--gray-500)', marginTop: '0.75rem', fontSize: '1.05rem' }}>
              Students showcase work. Teachers review progress and manage submissions.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {roles.map((role) => (
              <div key={role.title} className="card" style={{ padding: '1.75rem', borderTop: '4px solid var(--primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
                  {role.icon}
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{role.title}</h3>
                </div>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: '1rem' }}>{role.description}</p>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{role.credentials}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {role.actions.map((action) => (
                    <Link
                      key={action.label}
                      to={action.to}
                      className={action.primary ? 'btn btn-primary' : 'btn btn-secondary'}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)' }}>Everything you need to succeed</h2>
          <p style={{ color: 'var(--gray-500)', marginTop: '0.75rem', fontSize: '1.05rem' }}>Built for students and faculty to collaborate effectively</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--primary)', padding: '5rem 2rem', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to track projects and portfolios?</h2>
        <p style={{ opacity: 0.85, marginBottom: '2rem', fontSize: '1.05rem' }}>
          Students can create accounts instantly, and admins can sign in to review and manage submissions.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register" className="hero-btn-primary">Student Registration</Link>
          <Link to="/login" className="hero-btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>Admin Login</Link>
        </div>
      </section>

      <footer style={{ background: 'var(--gray-900)', color: 'var(--gray-500)', padding: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
        <p>(c) 2025 PortfolioTrack | KL University | Built with Spring Boot and React</p>
      </footer>
    </div>
  );
}
