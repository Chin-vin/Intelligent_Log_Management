import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ChangePasswordModal({ show, onClose }) {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  /* ---------------- PASSWORD VALIDATION ---------------- */
  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8)
      errors.push("At least 8 characters");

    if (!/[A-Z]/.test(password))
      errors.push("At least one uppercase letter");

    if (!/[a-z]/.test(password))
      errors.push("At least one lowercase letter");

    if (!/[0-9]/.test(password))
      errors.push("At least one number");

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("At least one special character");

    return errors;
  };

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "new_password") {
      setPasswordErrors(validatePassword(value));
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = async () => {
    setMessage(null);

    if (passwordErrors.length > 0) {
      setMessage({
        type: "danger",
        text: "New password does not meet security requirements",
      });
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setMessage({
        type: "danger",
        text: "New password and confirm password do not match",
      });
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/change-password", {
        old_password: form.old_password,
        new_password: form.new_password,
      });

      setMessage({
        type: "success",
        text: "Password changed successfully",
      });

      setForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });

      setPasswordErrors([]);

      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 1500);
    } catch (err) {
      setMessage({
        type: "danger",
        text:
          err.response?.data?.detail ||
          "Failed to change password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const isFormValid =
    form.old_password &&
    form.new_password &&
    form.confirm_password &&
    passwordErrors.length === 0 &&
    form.new_password === form.confirm_password;

  return (
    <>
      {/* MODAL */}
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">Change Password</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {/* MESSAGE */}
              {message && (
                <div className={`alert alert-${message.type}`}>
                  {message.text}
                </div>
              )}

              <input
                type="password"
                className="form-control mb-2"
                placeholder="Old password"
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
              />

              <input
                type="password"
                className="form-control mb-2"
                placeholder="New password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
              />

              {/* PASSWORD RULES */}
              {form.new_password && (
                <ul className="small mb-2">
                  <li className={passwordErrors.includes("At least 8 characters") ? "text-danger" : "text-success"}>
                    Minimum 8 characters
                  </li>
                  <li className={passwordErrors.includes("At least one uppercase letter") ? "text-danger" : "text-success"}>
                    One uppercase letter
                  </li>
                  <li className={passwordErrors.includes("At least one lowercase letter") ? "text-danger" : "text-success"}>
                    One lowercase letter
                  </li>
                  <li className={passwordErrors.includes("At least one number") ? "text-danger" : "text-success"}>
                    One number
                  </li>
                  <li className={passwordErrors.includes("At least one special character") ? "text-danger" : "text-success"}>
                    One special character
                  </li>
                </ul>
              )}

              <input
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={submit}
                disabled={!isFormValid || loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP */}
      <div className="modal-backdrop show"></div>
    </>
  );
}
