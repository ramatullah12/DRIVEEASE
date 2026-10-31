import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import HomePage from './pages/customer/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminVehiclesPage from './pages/admin/AdminVehiclesPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminReturnsPage from './pages/admin/AdminReturnsPage';
import AdminMaintenancePage from './pages/admin/AdminMaintenancePage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/vehicles" element={<AdminVehiclesPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
          <Route path="/admin/returns" element={<AdminReturnsPage />} />
          <Route path="/admin/maintenance" element={<AdminMaintenancePage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />

          {/* Staff (Petugas Rental) Routes */}
          <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="/staff/dashboard" element={<StaffDashboardPage />} />

          {/* Customer Portal Routes */}
          <Route path="/customer" element={<Navigate to="/customer/profile" replace />} />
          <Route path="/customer/profile" element={<CustomerDashboardPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
