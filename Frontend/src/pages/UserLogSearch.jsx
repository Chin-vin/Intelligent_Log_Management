import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserLogSearch() {
  /* ---------- AUTH / LOOKUPS ---------- */
  const [roles, setRoles] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ---------- LOG DATA ---------- */
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- PAGINATION ---------- */
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ---------- VALIDATION ---------- */
  const [dateError, setDateError] = useState("");

  /* ---------- FILTERS ---------- */
  const defaultFilters = {
    start_date: "",
    end_date: "",
    severity_id: "",
    category_id: "",
    keyword: "",
    scope: "team", // user only
  };

  const [filters, setFilters] = useState(defaultFilters);

  const isAdmin = roles.includes("ADMIN");

  /* ---------- INIT ---------- */
  useEffect(() => {
    const init = async () => {
      try {
        const [me, sevRes, catRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/lookups/severities"),
          api.get("/lookups/categories"),
        ]);

        setRoles(me.data.roles || []);
        setSeverities(sevRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Initialization failed", err);
      }
    };
    init();
  }, []);

  /* ---------- HELPERS ---------- */
  const toDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  };

  const handleChange = (e) => {
    setFilters((p) => ({ ...p, [e.target.name]: e.target.value }));
    setDateError(""); // clear validation on change
  };

  /* ---------- RESET FILTERS ---------- */
  const resetFilters = () => {
    setFilters(defaultFilters);
    setDateError("");
    setPage(1);
    searchLogs(1, true);
  };

  /* ---------- SEVERITY MAPPING ---------- */
  const severityMap = Object.fromEntries(
    severities.map((s) => [s.severity_id, s.severity_code])
  );

  const severityBadgeClass = (code) => {
    switch (code?.toUpperCase()) {
      case "INFO":
        return "bg-info text-dark";
      case "WARN":
      case "WARNING":
        return "bg-warning text-dark";
      case "ERROR":
        return "bg-danger";
      case "DEBUG":
        return "bg-secondary";
      case "CRITICAL":
        return "bg-dark";
      default:
        return "bg-light text-dark";
    }
  };

  /* ---------- SEARCH ---------- */
  const searchLogs = async (targetPage = 1, ignoreFilters = false) => {
    // 🔴 DATE VALIDATION
    if (!ignoreFilters && filters.start_date && filters.end_date) {
      const start = new Date(filters.start_date);
      const end = new Date(filters.end_date);

      if (end < start) {
        setDateError("End date should be greater than or equal to start date");
        return;
      }
    }

    setDateError("");

    if (roles.length === 0) return;

    try {
      setLoading(true);
      setPage(targetPage);

      const params = {
        page: targetPage,
        page_size: pageSize,
      };

      if (!isAdmin) {
        params.scope = ignoreFilters
          ? defaultFilters.scope
          : filters.scope;
      }

      if (!ignoreFilters) {
        if (filters.start_date)
          params.start_date = toDDMMYYYY(filters.start_date);
        if (filters.end_date)
          params.end_date = toDDMMYYYY(filters.end_date);
        if (filters.severity_id)
          params.severity_id = Number(filters.severity_id);
        if (filters.category_id)
          params.category_id = Number(filters.category_id);
        if (filters.keyword)
          params.keyword = filters.keyword;
      }

      const endpoint = isAdmin
        ? "/admin/logs/search"
        : "/user/logs/search";

      const res = await api.get(endpoint, { params });

      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Log search failed", err);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="container mt-4">
      <h4>{isAdmin ? "All Logs (Admin)" : "My Logs"}</h4>

      {/* FILTERS */}
    {/* FILTERS CARD */}
<div className="card shadow-sm mb-4">
  <div className="card-body">

    {/* FILTER ROW 1 */}
    <div className="row g-3 mb-2">
      <div className="col-md-3">
        <label className="form-label">Start Date</label>
        <input
          type="date"
          name="start_date"
          className="form-control"
          value={filters.start_date}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label">End Date</label>
        <input
          type="date"
          name="end_date"
          className="form-control"
          value={filters.end_date}
          onChange={handleChange}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label">Severity</label>
        <select
          name="severity_id"
          className="form-select"
          value={filters.severity_id}
          onChange={handleChange}
        >
          <option value="">All</option>
          {severities.map((s) => (
            <option key={s.severity_id} value={s.severity_id}>
              {s.severity_code}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label">Category</label>
        <select
          name="category_id"
          className="form-select"
          value={filters.category_id}
          onChange={handleChange}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>
              {c.category_name}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* FILTER ROW 2 */}
    <div className="row g-3 align-items-end">
      <div className="col-md-6">
        <label className="form-label">Keyword</label>
        <input
          name="keyword"
          className="form-control"
          placeholder="Search message, service, host..."
          value={filters.keyword}
          onChange={handleChange}
        />
      </div>

      {!isAdmin && (
        <div className="col-md-3">
          <label className="form-label">Scope</label>
          <select
            name="scope"
            className="form-select"
            value={filters.scope}
            onChange={handleChange}
          >
            <option value="team">My Teams</option>
            <option value="mine">My Uploads</option>
          </select>
        </div>
      )}

      <div className="col-md-3 d-flex justify-content-end gap-2">
        <button
          className="btn btn-primary px-4"
          onClick={() => searchLogs(1)}
          disabled={loading}
        >
          Search
        </button>

        <button
          className="btn btn-outline-secondary px-4"
          onClick={resetFilters}
          disabled={loading}
        >
          Reset
        </button>
      </div>
    </div>

    {/* DATE ERROR */}
    {dateError && (
      <div className="alert alert-warning py-2 mt-3 mb-0">
        {dateError}
      </div>
    )}

  </div>
</div>


      {/* RESULTS */}
      <div className="card shadow-sm mt-5">
        <div className="card-body">
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-muted">No logs found</p>
          ) : (
            <>
              <table className="table table-sm table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Time</th>
                    <th>Severity</th>
                    <th>Host</th>
                    <th>Service</th>
                    <th>Message</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((l) => {
                    const severityCode =
                      l.severity_code || severityMap[l.severity_id];

                    return (
                      <tr key={l.log_id}>
                        <td>
                          {new Date(l.log_timestamp).toLocaleString()}
                        </td>

                        <td>
                          <span
                            className={`badge ${severityBadgeClass(
                              severityCode
                            )}`}
                          >
                            {severityCode || "—"}
                          </span>
                        </td>

                        <td>{l.host_name || "—"}</td>
                        <td>{l.service_name || "—"}</td>

                        <td
                          className="text-truncate"
                          style={{ maxWidth: 400 }}
                          title={l.message}
                        >
                          {l.message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* PAGINATION */}
              <div className="d-flex justify-content-between mt-3">
                <span className="text-muted">
                  Page {page} of {totalPages} | Total: {total}
                </span>

                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={page === 1}
                    onClick={() => searchLogs(page - 1)}
                  >
                    ◀ Prev
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    disabled={page === totalPages}
                    onClick={() => searchLogs(page + 1)}
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
