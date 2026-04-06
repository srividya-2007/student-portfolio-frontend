import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LayoutDashboard, FolderOpen, BookOpen, Bell, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const studentLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/projects', icon: <FolderOpen size={18} />, label: 'My Projects' },
    { to: '/portfolio', icon: <BookOpen size={18} />, label: 'Portfolio' },
    { to: '/notifications', icon: <Bell size={18} />, label: 'Notifications' },
    { to: '/profile', icon: <User size={18} />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/admin/projects', icon: <FolderOpen size={18} />, label: 'All Projects' },
    { to: '/admin/students', icon: <User size={18} />, label: 'Students' },
  ];

  const links = isAdmin() ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-label">{isAdmin() ? 'ADMIN' : 'STUDENT'} MENU</div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/dashboard' || link.to === '/admin'}
          className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
        >
          {link.icon} {link.label}
        </NavLink>
      ))}
      <div style={{ borderTop: '1px solid var(--gray-200)', margin: '1rem 0' }} />
      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="sidebar-item"
        style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)' }}
      >
        <LogOut size={18} /> Log Out
      </button>
    </aside>
  );
}
