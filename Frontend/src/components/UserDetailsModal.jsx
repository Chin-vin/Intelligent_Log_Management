import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UserDetailsModal({ userId, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/users/${userId}`).then((res) => setData(res.data));
  }, [userId]);

  if (!data) return null;

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h5>User Details</h5>

          <p><b>Email:</b> {data.email}</p>
          <p><b>Username:</b> {data.username}</p>

          <p><b>Roles:</b> {data.roles.map(r => r.role_name).join(", ")}</p>
          <p><b>Teams:</b> {data.teams.map(t => t.team_name).join(", ")}</p>

          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
