import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getNotifications, markAsRead } from '../../api/services';
import { Bell, CheckCheck, Info, AlertCircle, CheckCircle } from 'lucide-react';

const TYPE_ICON = {
  INFO: <Info size={18} color="var(--primary-light)" />,
  SUCCESS: <CheckCircle size={18} color="var(--success)" />,
  WARNING: <AlertCircle size={18} color="var(--warning)" />,
  ERROR: <AlertCircle size={18} color="var(--danger)" />,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(r => setNotifications(r.data))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { toast.error('Failed to mark as read'); }
  };

  const handleMarkAll = async () => {
    const unread = notifications.filter(n => !n.read);
    await Promise.all(unread.map(n => markAsRead(n.id)));
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dash-content fade-in">
          <div className="page-header">
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <h1 className="page-title">Notifications</h1>
              {unreadCount > 0 && <span className="badge badge-red">{unreadCount} unread</span>}
            </div>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} className="btn btn-secondary btn-sm">
                <CheckCheck size={14}/> Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"/></div>
          ) : notifications.length === 0 ? (
            <div className="empty-state card">
              <Bell size={52} />
              <p style={{marginTop:'0.75rem'}}>No notifications yet</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {notifications.map(n => (
                <div key={n.id} className="card" style={{display:'flex',alignItems:'flex-start',gap:'1rem',opacity:n.read?0.7:1,borderLeft:`4px solid ${n.read?'var(--gray-200)':'var(--primary-light)'}`}}>
                  <div style={{marginTop:2,flexShrink:0}}>{TYPE_ICON[n.type] || TYPE_ICON.INFO}</div>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:n.read?400:600,color:'var(--gray-900)',fontSize:'0.9rem'}}>{n.message}</p>
                    <p style={{color:'var(--gray-500)',fontSize:'0.78rem',marginTop:'0.25rem'}}>{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.read && (
                    <button onClick={() => handleMarkRead(n.id)} className="btn btn-sm btn-secondary" style={{flexShrink:0}}>
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
