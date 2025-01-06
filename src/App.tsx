import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import { Toaster } from './components/ui/toaster';
import RootPage from './pages/Root';
import LogoutPage from './pages/Logout';
import UserDashboardPage from './pages/User/Dashboard';
import UserRequestPage from './pages/User/Request';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './components/theme-provider';
// import AdminDashboardPage from './pages/Admin/Dashboard';
import UnitPage from './pages/Admin/Unit';
import RoomPage from './pages/Admin/Room';
import RegisterPage from './pages/Register';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />

            <Route path="/user" element={<UserDashboardPage />} />
            <Route path="/user/request" element={<UserRequestPage />} />

            <Route path="/admin" element={<Navigate to="/admin/units" replace />} />
            <Route path="/admin/units" element={<UnitPage />} />
            <Route path="/admin/rooms" element={<RoomPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}


export default App
