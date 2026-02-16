import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserOverview() {
  const [stats, setStats] = useState([]);
  // console.log("hello")
  useEffect(() => {
    api.get("/users/me/logs/summary", { params: { days: 5 } })
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header">
        <strong>My Log Statistics (Last 5 Days)</strong>
      </div>

      <div className="card-body">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Logs</th>
              <th>Error Logs</th>
              <th>Error %</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr key={i}>
                <td>{s.day}</td>
                <td>{s.total_logs}</td>
                <td>{s.error_logs}</td>
                <td>{s.error_percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
