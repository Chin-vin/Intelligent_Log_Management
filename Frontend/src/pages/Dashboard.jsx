import { useEffect, useState } from "react";
import api from "../api/axios";
import StatsCard from "../components/StatsCard";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [days]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [overviewRes, summaryRes] = await Promise.all([
        api.get("/dashboard/overview"),
        api.get(`/user/logs/summary?days=${days}`),
      ]);

      setStats(overviewRes.data);
      setSummary(summaryRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <p className="text-muted">Loading dashboard...</p>;
  }

  /* ===== DERIVED STATS ===== */
  const totalLogs = stats.total_logs || 0;
  const errorLogs = stats.error_logs || 0;

  const errorRate =
    totalLogs > 0
      ? ((errorLogs / totalLogs) * 100).toFixed(2)
      : 0;

  const daysWithErrors = summary.filter(
    (d) => d.error_logs > 0
  ).length;

  const avgLogsPerDay =
    summary.length > 0
      ? Math.round(
          summary.reduce((s, d) => s + d.total_logs, 0) /
            summary.length
        )
      : 0;

  const isHealthy = errorLogs === 0;

  const dayLabel = days === 1 ? "day" : "days";

  return (
    <>
      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted mb-0">
          Summary of your recent log activity
        </p>

        {/* Days Filter */}
        <select
          className="form-select w-auto"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {/* ===== MAIN STATS ===== */}
      <div className="row g-3 mb-4">
        <StatsCard title="Total Files" value={stats.total_files} />
        <StatsCard title="Total Logs" value={totalLogs} />
        <StatsCard title="Error Logs" value={errorLogs} />
        <StatsCard
          title="Last Upload"
          value={
            <small className="text-nowrap" style={{ fontSize: "1rem" }}>
              {stats.last_upload_at
                ? new Date(stats.last_upload_at).toLocaleString()
                : "—"}
            </small>
          }
        />
      </div>

      {/* ===== SYSTEM STATUS ===== */}
      <div className="mb-4">
        {isHealthy ? (
          <div className="alert alert-success">
            <strong>System Healthy</strong>
            <div className="small">
              No error or fatal logs detected in recent activity.
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">
            <strong>Attention Required</strong>
            <div className="small">
              {errorLogs} error logs detected over the last{" "}
              <strong>{days}</strong> {dayLabel}.{" "}
              Errors occurred on <strong>{daysWithErrors}</strong>{" "}
              {daysWithErrors === 1 ? "day" : "days"}.
            </div>
          </div>
        )}
      </div>

      {/* ===== INSIGHTS ===== */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Error Rate</h6>
              <h4 className="mb-0">{errorRate}%</h4>
              <small className="text-muted">
                Percentage of logs that are errors
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Avg Logs / Day</h6>
              <h4 className="mb-0">{avgLogsPerDay}</h4>
              <small className="text-muted">
                Based on last {days} {dayLabel}
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted">Days With Errors</h6>
              <h4 className="mb-0">{daysWithErrors}</h4>
              <small className="text-muted">
                In the last {days} {dayLabel}
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* ===== ACTIONS ===== */}
      <div className="d-flex gap-2">
        <Link to="/dashboard/logs" className="btn btn-outline-primary">
          View Logs
        </Link>

        <Link to="/dashboard/files" className="btn btn-outline-secondary">
          Manage Files
        </Link>
      </div>
    </>
  );
}
