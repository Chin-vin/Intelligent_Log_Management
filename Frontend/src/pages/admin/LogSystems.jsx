import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ActiveSystemsPage() {

  const [systems, setSystems] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("all");
  const [host, setHost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtersKey, setFiltersKey] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const toBackendDate = (date) => {
    if (!date) return undefined;
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  /* ================= LOAD TABLE ================= */
  const loadSystems = async () => {
    try {
      setLoading(true);

      const res = await api.get("/logs/summary/active-systems", {
        params: {
          range: range !== "all" ? range : undefined,
          host: host || undefined,
          start_date: toBackendDate(startDate),
          end_date: toBackendDate(endDate),
          page,
          page_size: pageSize,
        },
      });

      setSystems(res.data.data || []);
      setTotal(res.data.total || 0);

    } catch {
      setSystems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD CHART (TOP 10 ONLY) ================= */
  const loadChartData = async () => {
    const res = await api.get("/logs/summary/active-systems", {
      params: {
        range: range !== "all" ? range : undefined,
        host: host || undefined,
        start_date: toBackendDate(startDate),
        end_date: toBackendDate(endDate),
        page: 1,
        page_size: 10, // chart shows top 10
      },
    });

    setChartData(res.data.data || []);
  };

  useEffect(() => {
    loadSystems();
  }, [range, page, filtersKey]);

  useEffect(() => {
    loadChartData();
  }, [range, filtersKey]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const applyFilters = () => {
    setRange("all");
    setPage(1);
    setFiltersKey(k => k + 1);
  };

  const clearFilters = () => {
    setHost("");
    setStartDate("");
    setEndDate("");
    setRange("all");
    setPage(1);
    setFiltersKey(k => k + 1);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#fff",
          padding: 10,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <strong>{payload[0].payload.host}</strong>
          <div>Logs: {payload[0].value}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container-fluid mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <Link to="/admin" className="text-muted small">
            ← Back to Overview
          </Link>
          <h5 className="mt-1 fw-semibold">Most Active Systems</h5>
        </div>

        <select
          className="form-select form-select-sm w-auto"
          value={range}
          onChange={(e) => {
            setRange(e.target.value);
            setPage(1);
            setFiltersKey(k => k + 1);
          }}
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="row">

        {/* CHART */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="fw-semibold mb-3">Top Active Hosts</h6>

            {chartData.length === 0 ? (
              <div className="text-muted text-center py-5">
                No chart data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="host" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="log_count" fill="#0d6efd" barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="fw-semibold mb-3">Detailed View</h6>

            <table className="table table-sm align-middle">
              <thead className="border-bottom">
                <tr>
                  <th>Host</th>
                  <th className="text-end">Log Count</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : systems.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-muted">
                      No data found
                    </td>
                  </tr>
                ) : (
                  systems.map((s, i) => (
                    <tr key={i}>
                      <td>{s.host}</td>
                      <td className="text-end fw-semibold">
                        {s.log_count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {!loading && total > 0 && (
              <div className="d-flex justify-content-between mt-3">
                <span className="small text-muted">
                  Page {page} of {totalPages}
                </span>
                <div>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="btn btn-sm btn-outline-secondary me-2"
                  >
                    ◀ Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
