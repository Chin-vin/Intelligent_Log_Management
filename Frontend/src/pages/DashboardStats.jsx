import { useEffect, useState } from "react";
import api from "../api/axios";
import StatsCard from "../components/StatsCard";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    total_files: 0,
    total_logs: 0,
    error_logs: 0,
    last_upload_at: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/dashboard/overview");
        setStats(res.data);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <p className="text-muted">Loading dashboard...</p>;
  }

  return (
    <>
      {/* PAGE TITLE */}
      <div className="mb-3">
        <h4 className="fw-semibold">Dashboard Overview</h4>
        <p className="text-muted mb-0">
          Quick summary of your activity
        </p>
      </div>

      {/* STATS GRID */}
      <div className="row g-3">
        <StatsCard
          title="Total Files"
          value={stats.total_files}
        />

        <StatsCard
          title="Total Logs"
          value={stats.total_logs}
        />

        <StatsCard
          title="Error Logs"
          value={stats.error_logs}
        />

        <StatsCard
          title="Last Upload"
          value={
            stats.last_upload_at
              ? new Date(stats.last_upload_at).toLocaleString()
              : "—"
          }
        />
      </div>

      {/* SYSTEM STATUS */}
      <div className="mt-4">
        <span
          className={`badge ${
            stats.error_logs === 0
              ? "bg-success"
              : "bg-warning text-dark"
          }`}
        >
          {stats.error_logs === 0
            ? "System Healthy"
            : "Attention Required"}
        </span>
      </div>
    </>
  );
}
