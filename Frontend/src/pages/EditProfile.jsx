import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

export default function EditProfile() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    job_title: "",
    profile_image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /* LOAD PROFILE */
  useEffect(() => {
    api.get("/users/me")
      .then((res) => {
        setForm({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          phone_number: res.data.phone_number || "",
          job_title: res.data.job_title || "",
          profile_image_url: res.data.profile_image_url || "",
        });
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.put("/users/me/profile", form);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    }
  };

  if (loading) return <p className="text-muted">Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h4>Edit Profile</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
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

            {/* <div className="col-md-6">
              <label className="form-label">Job Title</label>
              <input
                className="form-control"
                value={form.job_title}
                onChange={(e) =>
                  setForm({ ...form, job_title: e.target.value })
                }
              />
            </div> */}

            <div className="col-12">
              <label className="form-label">Profile Image URL</label>
              <input
                className="form-control"
                value={form.profile_image_url}
                onChange={(e) =>
                  setForm({ ...form, profile_image_url: e.target.value })
                }
              />
            </div>

            <div className="col-12">
              <button className="btn btn-primary">
                Save Changes
              </button>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}
