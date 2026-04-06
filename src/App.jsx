import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyProjects from './pages/student/MyProjects';
import ProjectDetail from './pages/student/ProjectDetail';
import CreateProject from './pages/student/CreateProject';
import EditProject from './pages/student/EditProject';
import Portfolio from './pages/student/Portfolio';
import Notifications from './pages/student/Notifications';
import ProfilePage from './pages/student/ProfilePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminStudents from './pages/admin/AdminStudents';
import AdminProjectDetail from './pages/admin/AdminProjectDetail';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Student */}
        <Route path="/dashboard" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute role="STUDENT"><MyProjects /></ProtectedRoute>} />
        <Route path="/projects/new" element={<ProtectedRoute role="STUDENT"><CreateProject /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute role="STUDENT"><ProjectDetail /></ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute role="STUDENT"><EditProject /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute role="STUDENT"><Portfolio /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute role="ADMIN"><AdminProjects /></ProtectedRoute>} />
        <Route path="/admin/projects/:id" element={<ProtectedRoute role="ADMIN"><AdminProjectDetail /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="ADMIN"><AdminStudents /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
