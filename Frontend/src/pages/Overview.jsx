import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./AdminDashboard.css";

export default function Overview() {
  /* ---------------- RECENT LOGS STATES ---------------- */
  const [logs, setLogs] = useState([]);
  const [range, setRange] = useState("10d");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ---------------- SEVERITY LOOKUP ---------------- */
  const [severities, setSeverities] = useState([]);

  /* ---------------- LOAD SEVERITIES ---------------- */
  useEffect(() => {
    api.get("/lookups/severities").then((res) => {
      setSeverities(res.data || []);
    });
  }, []);

  /* ---------------- SEVERITY MAP ---------------- */
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

  /* ---------------- LOAD LOGS ---------------- */
  const loadLogs = async () => {
    const res = await api.get("/logs/search", {
      params: { range, page, page_size: pageSize },
    });

    setLogs(res.data.data || []);
    setTotal(res.data.total || 0);
  };

  useEffect(() => {
    loadLogs();
  }, [range, page, pageSize]);

  return (
    <div className="container mt-4 admin-dashboard">

      {/* ================= QUICK NAV LINKS ================= */}
      <div className="row g-3 mb-4">
        {[
          { label: "Logs Per Day", path: "/admin/logs-per-day" },
          { label: "Top Errors", path: "/admin/logs-errors" },
          { label: "Active Systems", path: "/admin/logs-systems" },
          { label: "Severity Distribution", path: "/admin/logs-severity" },
        ].map((item, i) => (
          <div className="col-md-3" key={i}>
            <Link to={item.path} className="text-decoration-none">
              <div className="card shadow-sm p-3 dashboard-link-card">
                <h6 className="mb-1">{item.label}</h6>
                <span className="text-muted small">View details →</span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* ================= RECENT LOGS ================= */}
      <section className="card p-3 shadow-sm">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <h5 className="m-0">Recent Logs</h5>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <select
              className="form-select form-select-sm w-auto"
              value={range}
              onChange={(e) => {
                setRange(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="10d">Last 10 days</option>
              <option value="30d">Last 30 days</option>
            </select>

            <div className="d-flex align-items-center gap-1">
              <span className="text-muted small">Show</span>
              <select
                className="form-select form-select-sm w-auto"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-muted small">entries</span>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Time</th>
                <th>Severity</th>
                <th className="d-none d-md-table-cell">Service</th>
                <th className="d-none d-lg-table-cell">Host</th>
                <th>Message</th>
              </tr>
            </thead>

            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.log_id}>
                    <td className="text-nowrap">
                      {new Date(log.log_timestamp).toLocaleString()}
                    </td>

                    <td>
                      <span
                        className={`badge ${severityBadgeClass(
                          severityMap[log.severity_id]
                        )}`}
                      >
                        {severityMap[log.severity_id] || "—"}
                      </span>
                    </td>

                    <td className="d-none d-md-table-cell">
                      {log.service_name || "—"}
                    </td>

                    <td className="d-none d-lg-table-cell">
                      {log.host_name || "—"}
                    </td>

                    <td
                      className="text-truncate"
                      style={{ maxWidth: "280px" }}
                      title={log.message}
                    >
                      {log.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
          <span className="text-muted small">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>

          <span className="text-muted small">
            Total records: <strong>{total}</strong>
          </span>

          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-dark"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀ Prev
            </button>
            <button
              className="btn btn-sm btn-outline-dark"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
