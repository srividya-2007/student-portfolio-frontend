import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Bell, LogOut, User, LayoutDashboard, FolderOpen, BookOpen, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'U';

  return (
    <nav className="navbar">
      <Link to={user ? (isAdmin() ? '/admin' : '/dashboard') : '/'} className="navbar-brand">
        Portfolio<span>Track</span>
      </Link>

      {user && (
        <div className="navbar-links">
          {isAdmin() ? (
            <>
              <NavLink to="/admin">Dashboard</NavLink>
              <NavLink to="/admin/projects">Projects</NavLink>
              <NavLink to="/admin/students">Students</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/projects">My Projects</NavLink>
              <NavLink to="/portfolio">Portfolio</NavLink>
            </>
          )}
        </div>
      )}

      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/notifications" className="notif-bell" title="Notifications">
              <Bell size={20} />
            </Link>
            <div className="profile-dropdown" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'8px', padding:'0.4rem 0.75rem', cursor:'pointer', color:'white' }}
              >
                <div className="avatar" style={{width:32,height:32,fontSize:'0.8rem'}}>{initials}</div>
                <span style={{fontSize:'0.85rem',fontWeight:500}}>{user.fullName?.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>
              {menuOpen && (
                <div className="profile-menu">
                  <Link to="/profile" onClick={() => setMenuOpen(false)}><User size={14} /> Profile</Link>
                  {!isAdmin() && <Link to="/dashboard" onClick={() => setMenuOpen(false)}><LayoutDashboard size={14} /> Dashboard</Link>}
                  <button onClick={handleLogout}><LogOut size={14} /> Log Out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline btn-sm" style={{color:'white',borderColor:'rgba(255,255,255,0.5)'}}>Login</Link>
            <Link to="/register" className="btn btn-sm" style={{background:'white',color:'var(--primary)',fontWeight:600}}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
