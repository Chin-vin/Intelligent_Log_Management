import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AuditTrailPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    action_type: "",
    entity_type: "",
    days: "",
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ---------------- LOAD AUDIT TRAIL ---------------- */
  // const loadAuditTrail = async () => {
  //   const res = await api.get("/admin/security/audit-trail", {
  //     params: {
  //       page,
  //       page_size: pageSize,
  //       action_type: filters.action_type || undefined,
  //       entity_type: filters.entity_type || undefined,
  //       days: filters.days || undefined,
  //     },
  //   });

  //   setData(res.data.data || []);
  //   setTotal(res.data.total || 0);
  // };

  const loadAuditTrail = async () => {
  try {
    setLoading(true);

    const res = await api.get("/admin/security/audit-trail", {
      params: {
        page,
        page_size: pageSize,
        action_type: filters.action_type || undefined,
        entity_type: filters.entity_type || undefined,
        days: filters.days || undefined,
      },
    });

    setData(res.data.data || []);
    setTotal(res.data.total || 0);
  } catch (error) {
    console.error("Error loading audit trail:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadAuditTrail();
  }, [page, pageSize, filters]);

  return (
    <div className="container-fluid px-4 mt-4 admin-page">
      <h4 className="mb-3">Audit Trail</h4>

      {/* ---------- FILTERS ---------- */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Action</label>
            <input
              className="form-control"
              value={filters.action_type}
              onChange={(e) =>
                setFilters({ ...filters, action_type: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Entity</label>
            <input
              className="form-control"
              value={filters.entity_type}
              onChange={(e) =>
                setFilters({ ...filters, entity_type: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Time Range</label>
            <select
              className="form-select"
              value={filters.days}
              onChange={(e) =>
                setFilters({ ...filters, days: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="60">Last 2 months</option>
            </select>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setFilters({ action_type: "", entity_type: "", days: "" });
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* ---------- PAGE SIZE ---------- */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <span className="text-muted small">
          Total records: <strong>{total}</strong>
        </span>

        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted">Show</span>
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
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="card shadow-sm p-3">

        {/* ✅ RESPONSIVE TABLE WRAPPER */}
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th className="text-nowrap">#</th>
                <th className="text-nowrap">Time</th>
                <th className="text-nowrap">User</th>
                <th>Action</th>
                <th className="text-nowrap">Entity</th>
                <th className="text-nowrap">Action performed on</th>
              </tr>
            </thead>

            {/* <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No audit records found
                  </td>
                </tr>
              ) : (
                data.map((a, idx) => (
                  <tr key={a.audit_id}>
                    <td className="text-nowrap">
                      {(page - 1) * pageSize + idx + 1}
                    </td>

                    <td className="text-nowrap">
                      {new Date(a.action_time).toLocaleString()}
                    </td>

                    <td className="text-nowrap">{a.user || "—"}</td>

                    <td>
                      <span className="badge bg-primary">
                        {a.action_type}
                      </span>
                    </td>

                    <td className="text-nowrap">
                      {a.entity_type || "—"}
                    </td>

                   <td className="text-nowrap">
<td>{a.entity_display || a.entity_id}</td>

</td>

                  </tr>
                ))
              )}
            </tbody> */}
            <tbody>
  {loading ? (
    <tr>
      <td colSpan="6" className="text-center text-muted">
        Loading audit records...
      </td>
    </tr>
  ) : data.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center text-muted">
        No audit records found
      </td>
    </tr>
  ) : (
    data.map((a, idx) => (
      <tr key={a.audit_id}>
        <td className="text-nowrap">
          {(page - 1) * pageSize + idx + 1}
        </td>

        <td className="text-nowrap">
          {new Date(a.action_time).toLocaleString()}
        </td>

        <td className="text-nowrap">{a.user || "—"}</td>

        <td>
          <span className="badge bg-primary">
            {a.action_type}
          </span>
        </td>

        <td className="text-nowrap">
          {a.entity_type || "—"}
        </td>

        <td className="text-nowrap">
          {a.entity_display || a.entity_id}
        </td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>

        {/* ---------- PAGINATION ---------- */}
        <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
          <span className="text-muted small">
            Page <strong>{page}</strong> of{" "}
            <strong>{totalPages}</strong>
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
      </div>
    </div>
  );
}
