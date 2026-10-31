import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import HomePage from './pages/customer/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminVehiclesPage from './pages/admin/AdminVehiclesPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/vehicles" element={<AdminVehiclesPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
