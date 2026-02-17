import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogSearch from "./pages/AdminLogSearch";
import Login from "./pages/Login";
import "./styles/toast.css";

import Dashboard from "./pages/Dashboard";

import CreateUser from "./pages/admin/CreateUser";
import AdminUsers from "./pages/admin/AdminUsers";
import UserLogSearch from "./pages/UserLogSearch";
import Overview from "./pages/Overview";
import AdminLayout from "./pages/AdminLayout";
import UserDashboard from "./pages/UserDashboard";
import EditProfile from "./pages/EditProfile";
import UserFiles from "./pages/UserFiles";
import UserOverview from "./pages/UserOverview";
import UserLayout from "./pages/UserLayout";
import LandingPage from "./pages/LandingPage";
import LogsPerDayPage from "./pages/admin/LogsPerDay";
import TopErrorsPage from "./pages/admin/TopErrors";
import ActiveSystemsPage from "./pages/admin/LogSystems";
import SeverityDistributionPage from "./pages/admin/SeverityLogs";
import AdminFiles from "./pages/admin/AdminFiles";
import AuditTrailPage from "./pages/AuditTrail";
import LoginHistoryPage from "./pages/LoginHistory";
import FilePreview from "./pages/FilePreview";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
  {/* PUBLIC */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<Login />} />

  {/* USER */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <UserLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="logs" element={<UserLogSearch />} />
    <Route path="files" element={<UserFiles />} />
    {/* <Route path="profile" element={<EditProfile />} /> */}
  </Route>

{/* FILE PREVIEW – USER */}
<Route
  path="/files/:id/preview"
  element={
    <ProtectedRoute>
      <FilePreview />
    </ProtectedRoute>
  }
/>

{/* FILE PREVIEW – ADMIN */}
<Route
  path="/admin/files/:id/preview"
  element={
    <ProtectedRoute role="ADMIN">
      <FilePreview />
    </ProtectedRoute>
  }
/>

  {/* ADMIN */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute role="ADMIN">
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Overview />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="create-user" element={<CreateUser />} />
    <Route path="files" element={<AdminFiles />} />

    {/* LOGS */}
    <Route path="logs" element={<AdminLogSearch />} />
    <Route path="logs-per-day" element={<LogsPerDayPage />} />
    <Route path="logs-errors" element={<TopErrorsPage />} />
    <Route path="logs-systems" element={<ActiveSystemsPage />} />
    <Route path="logs-severity" element={<SeverityDistributionPage />} />

    {/* SECURITY */}
    <Route path="security/logins" element={<LoginHistoryPage />} />
    <Route path="security/audit-trail" element={<AuditTrailPage />} />
  </Route>
</Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
