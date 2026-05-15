import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Pages
import Landing      from './pages/Landing';
import { Login, Register } from './pages/Auth';
import Dashboard    from './pages/Dashboard';
import Vehicles     from './pages/Vehicles';
import BookService  from './pages/BookService';
import BookingHistory from './pages/BookingHistory';
import Payment      from './pages/Payment';
import AdminDashboard from './pages/admin/AdminDashboard';

// Dark-mode toggle — reads system pref once on mount
const useDarkMode = () => {
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) document.documentElement.classList.add('dark');
  }, []);
};

// Redirect to dashboard if already authed
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  useDarkMode();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            borderRadius: '12px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          },
          success: { iconTheme: { primary: '#0F6E56', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* User protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles"  element={<Vehicles />} />
          <Route path="/book"      element={<BookService />} />
          <Route path="/bookings"  element={<BookingHistory />} />
          <Route path="/payment"   element={<Payment />} />
        </Route>

        {/* Admin protected */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
