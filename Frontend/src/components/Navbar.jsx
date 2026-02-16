import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const logout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4 fixed-top">
        <span className="navbar-brand fw-bold">
          Intelligent Log System
        </span>

        <div className="ms-auto dropdown">
          <button
            className="btn btn-outline-secondary dropdown-toggle"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person-circle me-1"></i> Profile
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setShowProfile(true)}
              >
                View Profile
              </button>
            </li>

            <li>
              <button
                className="dropdown-item"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
            </li>

            <li><hr className="dropdown-divider" /></li>

            <li>
              <button
                className="dropdown-item text-danger"
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Modals */}
      <ProfileModal
        show={showProfile}
        onClose={() => setShowProfile(false)}
      />

      <ChangePasswordModal
        show={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}
