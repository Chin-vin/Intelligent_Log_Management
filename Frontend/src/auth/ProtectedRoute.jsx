// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  // 1️⃣ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ Logged in but role not allowed
  if (role && !user.roles?.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3️⃣ Allowed
  return children;
}

export default ProtectedRoute;
