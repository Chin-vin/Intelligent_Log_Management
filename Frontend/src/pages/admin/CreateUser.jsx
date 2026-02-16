import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../../styles/CreateUser.css";

export default function CreateUser() {
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // ✅ error state

  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    profile_image_url: "",
    job_title: "",
    role_ids: [],
    team_ids: [],
  });

  /* ---------------- LOAD ROLES & TEAMS ---------------- */
  useEffect(() => {
    api.get("/lookups/roles").then((res) => setRoles(res.data));
    api.get("/lookups/teams").then((res) => setTeams(res.data));
  }, []);

  /* ---------------- CHECKBOX HANDLER ---------------- */
  const toggleId = (field, id) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((x) => x !== id)
        : [...prev[field], id],
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    try {
      const res = await api.post("/users/admin/create", form);
      setResult(res.data);

      // reset form
      setForm({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        profile_image_url: "",
        job_title: "",
        role_ids: [],
        team_ids: [],
      });
    } catch (err) {
      // ✅ robust error handling
      if (err.response && err.response.data) {
        const data = err.response.data;

        if (typeof data.detail === "string") {
          setError(data.detail);
        } else if (Array.isArray(data.detail)) {
          setError(data.detail[0]?.msg || "Validation error");
        } else {
          setError("User creation failed");
        }
      } else {
        setError("Server not reachable");
      }
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="container mt-4 admin-create-user">
      <h4 className="mb-3">Create New User</h4>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {result && (
        <div className="alert alert-success">
          <p>
            <strong>User ID:</strong> {result.user_id}
          </p>
          <p>
            <strong>Temporary Password:</strong>{" "}
            <code>{result.temporary_password}</code>
          </p>
          <small className="text-muted">
            Ask the user to change password on first login
          </small>
        </div>
      )}

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3">

          <div className="col-md-6">
            <input
              className={`form-control ${
                error?.toLowerCase().includes("email") ? "is-invalid" : ""
              }`}
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className={`form-control ${
                error?.toLowerCase().includes("username") ? "is-invalid" : ""
              }`}
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              placeholder="Job Title"
              value={form.job_title}
              onChange={(e) =>
                setForm({ ...form, job_title: e.target.value })
              }
            />
          </div>

          {/* ROLES */}
          <div className="col-12">
            <label className="fw-bold">Assign Roles</label>
            <div className="d-flex flex-wrap gap-3 mt-2">
              {roles.map((r) => (
                <label key={r.role_id}>
                  <input
                    type="checkbox"
                    className="me-1"
                    checked={form.role_ids.includes(r.role_id)}
                    onChange={() => toggleId("role_ids", r.role_id)}
                  />
                  {r.role_name}
                </label>
              ))}
            </div>
          </div>

          {/* TEAMS */}
          <div className="col-12">
            <label className="fw-bold mt-3">Assign Teams</label>
            <div className="d-flex flex-wrap gap-3 mt-2">
              {teams.map((t) => (
                <label key={t.team_id}>
                  <input
                    type="checkbox"
                    className="me-1"
                    checked={form.team_ids.includes(t.team_id)}
                    onChange={() => toggleId("team_ids", t.team_id)}
                  />
                  {t.team_name}
                </label>
              ))}
            </div>
          </div>

          <div className="col-12 mt-3">
            <button className="btn btn-primary">
              Create User
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
