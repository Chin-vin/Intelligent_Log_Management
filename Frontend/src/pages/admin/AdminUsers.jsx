import { useEffect, useState } from "react";
import api from "../../api/axios";
import UserTable from "./UserTable";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* FILTERS */
  const [filters, setFilters] = useState({
    email: "",
    role: "",
    team: "",
  });

  /* LOOKUPS */
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);

  /* FEEDBACK */
  const [feedback, setFeedback] = useState(null);
  // { type: "success" | "danger", message: string }

  /* ---------------- LOAD USERS ---------------- */
  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: {
          page,
          page_size: pageSize,
          email: filters.email || undefined,
          role: filters.role || undefined,
          team: filters.team || undefined,
        },
      });

      setUsers(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch {
      setFeedback({ type: "danger", message: "Failed to load users" });
    } finally {
      setLoading(false);
    }
  };
  // console.log(users)
  /* ---------------- LOAD LOOKUPS ---------------- */
  useEffect(() => {
    api.get("/lookups/roles").then(res => setRoles(res.data || []));
    api.get("/lookups/teams").then(res => setTeams(res.data || []));
  }, []);

  /* AUTO LOAD */
  useEffect(() => {
    loadUsers();
  }, [page, pageSize, filters]);

  /* FEEDBACK HELPERS */
  const showSuccess = (message) => {
    setFeedback({ type: "success", message });
    loadUsers();
  };

  const showError = (message) => {
    setFeedback({ type: "danger", message });
  };

  const resetFilters = () => {
  setFilters({
    email: "",
    role: "",
    team: "",
  });
  setPage(1);
};

  return (
    <div className="container-fluid px-4 mt-4">

      <h4 className="mb-3">User Management</h4>

      {/* ===== FILTERS ===== */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-3 align-items-end">

          {/* EMAIL */}
          <div className="col-md-4">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search by email"
              value={filters.email}
              onChange={(e) => {
                setFilters({ ...filters, email: e.target.value });
                setPage(1);
              }}
            />
          </div>

          {/* ROLE */}
          <div className="col-md-4">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={filters.role}
              onChange={(e) => {
                setFilters({ ...filters, role: e.target.value });
                setPage(1);
              }}
            >
              <option value="">All</option>
              {roles.map((r) => (
                <option key={r.role_name} value={r.role_name}>
                  {r.role_name}
                </option>
              ))}
            </select>
          </div>

          {/* TEAM */}
          <div className="col-md-4">
            <label className="form-label">Team</label>
            <select
              className="form-select"
              value={filters.team}
              onChange={(e) => {
                setFilters({ ...filters, team: e.target.value });
                setPage(1);
              }}
            >
              <option value="">All</option>
              {teams.map((t) => (
                <option key={t.team_name} value={t.team_name}>
                  {t.team_name}
                </option>
              ))}
            </select>
          </div>

          {/* RESET */}
<div className="col-md-12 text-end">
  <button
    className="btn btn-outline-secondary"
    onClick={resetFilters}
  >
    Reset Filters
  </button>
</div>

        </div>
      </div>

      {/* FEEDBACK */}
      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show`}>
          {feedback.message}
          <button className="btn-close" onClick={() => setFeedback(null)} />
        </div>
      )}

      {/* USERS TABLE */}
      {loading ? (
        <p className="text-muted">Loading users...</p>
      ) : (
        <>
          <UserTable
            users={users}
            onSuccess={showSuccess}
            onError={showError}
          />

          {/* PAGINATION */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-muted small">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-dark"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                ◀ Prev
              </button>
              <button
                className="btn btn-sm btn-outline-dark"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next ▶
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
