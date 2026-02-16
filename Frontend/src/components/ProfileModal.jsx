import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProfileModal({ show, onClose }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [originalForm, setOriginalForm] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* LOAD PROFILE */
  useEffect(() => {
    if (!show) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    Promise.all([
      api.get("/users/me"),
      api.get("/users/me/profile"),
    ])
      .then(([userRes, profileRes]) => {
        setProfile(userRes.data);

        const data = {
          first_name: profileRes.data.first_name || "",
          last_name: profileRes.data.last_name || "",
          phone_number: profileRes.data.phone_number || "",
          profile_image_url: profileRes.data.profile_image_url || "",
        };

        setForm(data);
        setOriginalForm(data);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [show]);

  if (!show) return null;

  const hasChanges =
    JSON.stringify(form) !== JSON.stringify(originalForm);

  /* SAVE */
  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    try {
      await api.put("/users/me/profile", form);
      setOriginalForm(form);
      setSuccess("Profile updated successfully");
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    }
  };

  const handleCancel = () => {
    setForm(originalForm);
    setEditMode(false);
    setError(null);
  };

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">

            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title">My Profile</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {loading && <p className="text-muted">Loading...</p>}
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {!loading && profile && !editMode && (
                <>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Username:</strong> {profile.username}</p>
                  <p><strong>Roles:</strong> {profile.roles.join(", ")}</p>
                  <p><strong>Teams:</strong> {profile.teams.join(", ")}</p>
                  <p>
  <strong>Account Created:</strong>{" "}
  {new Date(profile.created_at).toLocaleString()}
</p>
                </>
              )}

              {!loading && editMode && (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      className="form-control"
                      value={form.first_name}
                      onChange={(e) =>
                        setForm({ ...form, first_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      className="form-control"
                      value={form.last_name}
                      onChange={(e) =>
                        setForm({ ...form, last_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-control"
                      value={form.phone_number}
                      onChange={(e) =>
                        setForm({ ...form, phone_number: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Profile Image URL</label>
                    <input
                      className="form-control"
                      value={form.profile_image_url}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          profile_image_url: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              {!editMode ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    disabled={!hasChanges}
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>
  );
}
