import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function LogsPerDayPage() {
  const [data, setData] = useState([]);

  /* ================= FILTER STATES ================= */
  const [range, setRange] = useState("all");

  // UI dates (YYYY-MM-DD)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔑 force reload trigger
  const [filtersKey, setFiltersKey] = useState(0);

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ================= HELPERS ================= */
  const toBackendDate = (date) => {
    if (!date) return undefined;
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    const res = await api.get("/logs/summary/logs-per-day", {
      params: {
        range: range !== "all" ? range : undefined,
        start_date: toBackendDate(startDate),
        end_date: toBackendDate(endDate),
        page,
        page_size: pageSize,
      },
    });

    setData(res.data.data || []);
    setTotal(res.data.total || 0);
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    loadData();
  }, [range, page, filtersKey]);

  /* ================= APPLY / CLEAR ================= */
  const applyDateFilter = () => {
    if (startDate && endDate && startDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }

    setRange("all");
    setPage(1);

    // 🔥 force reload
    setFiltersKey((k) => k + 1);
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setRange("all");
    setPage(1);

    // 🔥 force reload
    setFiltersKey((k) => k + 1);
  };

  return (
    <div className="admin-page">

      {/* ================= HEADER ================= */}
      <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div>
          <Link
            to="/admin"
            className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
          >
            ← Back to Overview
          </Link>
          <h5 className="mb-0 fw-semibold">Logs Per Day</h5>
        </div>

        <select
          className="form-select form-select-sm w-auto"
          value={range}
          onChange={(e) => {
            setRange(e.target.value);
            setStartDate("");
            setEndDate("");
            setPage(1);

            // 🔥 force reload
            setFiltersKey((k) => k + 1);
          }}
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="10d">Last 10 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* ================= DATE FILTER ================= */}
      <div className="card admin-card p-3 mb-3">
        <div className="row g-3 align-items-end">

          <div className="col-md-3">
            <label className="form-label small">From Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small">To Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="col-md-3 d-flex gap-2">
            <button
              className="btn btn-sm btn-primary w-100"
              disabled={!startDate && !endDate}
              onClick={applyDateFilter}
            >
              Apply
            </button>
            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={clearDateFilter}
            >
              Clear
            </button>
          </div>

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card admin-card p-3 logs-card">
        <table className="table table-borderless align-middle admin-table">

          <thead className="border-bottom">
            <tr>
              <th>Date</th>
              <th className="text-end">Total Logs</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center text-muted py-4">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="log-row">
                  <td className="py-3 fw-medium">{row.date}</td>
                  <td className="py-2">
  <span className="badge bg-primary bg-opacity-10 text-primary">
    {row.total_logs}
  </span>
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="admin-pagination d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ·{" "}
            <strong>{total}</strong> records
          </div>

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
