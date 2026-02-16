import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const user = await login(email, password);

    // ROLE BASED REDIRECTION
    if (user.roles?.includes("ADMIN")) {
      navigate("/admin/");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {

    // 🛑 No response → Network or server down
    if (!err.response) {
      setError("Server unreachable. Please try again later.");
      return;
    }

    const status = err.response.status;
    const message = err.response.data?.detail;

    switch (status) {
      case 401:
        setError("Invalid email or password.");
        break;

      case 403:
        setError(message || "Access denied.");
        break;

      case 429:
        setError("Too many login attempts. Please wait and try again.");
        break;

      case 500:
        setError("Server error. Please contact support.");
        break;

      default:
        setError(message || "Login failed.");
    }
  }
};


  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Log Management System</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
