import UserRow from "../../components/UserRow";

export default function UserTable({ users, onSuccess, onError }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">

        {/* 👇 RESPONSIVE WRAPPER */}
        <div className="table-responsive">
          <table className="table table-hover table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Roles</th>
                <th>Teams</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <UserRow
                  key={u.user_id}
                  user={u}
                  onSuccess={onSuccess}
                  onError={onError}
                />
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
