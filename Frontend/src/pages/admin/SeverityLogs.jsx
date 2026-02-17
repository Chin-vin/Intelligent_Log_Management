import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";


export default function SeverityDistributionPage() {

  const [stats, setStats] = useState([]);
  const [chartDataRaw, setChartDataRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      // Paginated data (table)
      const res = await api.get("/logs/summary/severity-trend", {
        params: {
          range: range !== "all" ? range : undefined,
          page,
          page_size: pageSize,
        },
      });

      setStats(res.data.data || []);
      setTotal(res.data.total || 0);

      // Full data for charts
      const chartRes = await api.get("/logs/summary/severity-trend", {
        params: {
          range: range !== "all" ? range : undefined,
          page: 1,
          page_size: 200,
        },
      });

      setChartDataRaw(chartRes.data.data || []);

    } catch (err) {
      setStats([]);
      setChartDataRaw([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [range, page]);

  /* ================= TRANSFORM FOR STACKED BAR ================= */
  const chartData = useMemo(() => {
    const map = {};

    chartDataRaw.forEach((item) => {
      if (!map[item.period]) {
        map[item.period] = {
          period: item.period,
          ERROR: 0,
          WARN: 0,
          INFO: 0,
          DEBUG: 0,
          FATAL: 0,
        };
      }
      map[item.period][item.severity] = item.count;
    });

    return Object.values(map);
  }, [chartDataRaw]);

  /* ================= KPI CALCULATIONS ================= */
  const kpis = useMemo(() => {
    let totalLogs = 0;
    let totalErrors = 0;
    let peakPeriod = "";
    let peakValue = 0;

    chartData.forEach((row) => {
      const rowTotal =
        row.ERROR + row.WARN + row.INFO + row.DEBUG + row.FATAL;

      totalLogs += rowTotal;
      totalErrors += row.ERROR;

      if (row.ERROR > peakValue) {
        peakValue = row.ERROR;
        peakPeriod = row.period;
      }
    });

    const errorRate =
      totalLogs > 0 ? ((totalErrors / totalLogs) * 100).toFixed(1) : 0;

    return { totalLogs, totalErrors, errorRate, peakPeriod };
  }, [chartData]);

  /* ================= DONUT DATA ================= */
  const donutData = useMemo(() => {
    const totals = {};

    chartDataRaw.forEach((item) => {
      totals[item.severity] =
        (totals[item.severity] || 0) + item.count;
    });

    return Object.keys(totals).map((key) => ({
      name: key,
      value: totals[key],
    }));
  }, [chartDataRaw]);

  const COLORS = ["#dc3545", "#ffc107", "#0dcaf0", "#6c757d", "#000000"];

  return (
    <div className="container-fluid mt-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/admin" className="text-muted small">
            ← Back
          </Link>
          <h5 className="mt-1 fw-semibold">Severity Analytics Dashboard</h5>
        </div>

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
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <small>Total Logs</small>
            <h4>{kpis.totalLogs}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <small>Total Errors</small>
            <h4 className="text-danger">{kpis.totalErrors}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <small>Error Rate</small>
            <h4>{kpis.errorRate}%</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <small>Peak Error Period</small>
            <h6>{kpis.peakPeriod || "-"}</h6>
          </div>
        </div>
      </div>

      {/* ================= CHART ROW ================= */}
      <div className="row mb-4">

        {/* STACKED BAR CHART */}
        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h6 className="fw-semibold mb-3">Severity Trend</h6>

            <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={chartData}
    barGap={4}
    barCategoryGap="25%"
  >
    <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
    <XAxis
      dataKey="period"
      tick={{ fontSize: 12 }}
    />
    <YAxis tick={{ fontSize: 12 }} />
    <Tooltip />
    <Legend wrapperStyle={{ fontSize: "12px" }} />

    <Bar dataKey="ERROR" fill="#dc3545" barSize={12} />
    <Bar dataKey="WARN" fill="#ffc107" barSize={12} />
    <Bar dataKey="INFO" fill="#0dcaf0" barSize={12} />
    <Bar dataKey="DEBUG" fill="#6c757d" barSize={12} />
    <Bar dataKey="FATAL" fill="#000000" barSize={12} />
  </BarChart>
</ResponsiveContainer>

          </div>
        </div>

        {/* DONUT CHART */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="fw-semibold mb-3">Overall Distribution</h6>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {donutData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card shadow-sm p-3">
        <h6 className="fw-semibold mb-3">Detailed View</h6>

        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Period</th>
              <th>Severity</th>
              <th className="text-end">Count</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center">Loading...</td>
              </tr>
            ) : stats.map((s, i) => (
              <tr key={i}>
                <td>{s.period}</td>
                <td>
                  <span className={`badge ${
                    s.severity === "ERROR" ? "bg-danger" :
                    s.severity === "WARN" ? "bg-warning text-dark" :
                    s.severity === "INFO" ? "bg-info" :
                    "bg-secondary"
                  }`}>
                    {s.severity}
                  </span>
                </td>
                <td className="text-end fw-semibold">{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && (
          <div className="d-flex justify-content-between">
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
  );
}
