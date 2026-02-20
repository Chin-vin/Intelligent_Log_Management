// import { useEffect, useState } from "react";
// import api from "../api/axios";

// export default function AdminTeams() {
//   const [teams, setTeams] = useState([]);
//   const [newTeam, setNewTeam] = useState("");
//   const [editingTeam, setEditingTeam] = useState(null);

//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);

//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const [teamUsers, setTeamUsers] = useState([]);
//   const [newUserId, setNewUserId] = useState("");

//   /* ---------------- FORMAT DATE ---------------- */
//   const formatDate = (dateString) => {
//     if (!dateString) return "-";

//     const date = new Date(dateString);
//     if (isNaN(date)) return "-";

//     return date.toLocaleString("en-IN", {
//       timeZone: "Asia/Kolkata"
//     });
//   };

//   /* ---------------- LOAD TEAMS ---------------- */
//   const loadTeams = async () => {
//     try {
//       const res = await api.get("/admin/teams");
//       setTeams(res.data);
//     } catch (err) {
//       setError("Failed to load teams");
//     }
//   };

//   useEffect(() => {
//     loadTeams();
//   }, []);

//   /* ---------------- CREATE TEAM ---------------- */
//   const createTeam = async () => {
//     if (!newTeam.trim()) return;

//     try {
//       await api.post("/admin/teams", null, {
//         params: { name: newTeam }
//       });

//       setMessage("Team created successfully");
//       setError(null);
//       setNewTeam("");
//       loadTeams();
//     } catch (err) {
//       setError(err.response?.data?.detail || "Error creating team");
//       setMessage(null);
//     }
//   };

//   /* ---------------- UPDATE TEAM ---------------- */
//   const updateTeam = async () => {
//     try {
//       await api.put(`/admin/teams/${editingTeam.team_id}`, null, {
//         params: { name: editingTeam.team_name }
//       });

//       setMessage("Team updated successfully");
//       setError(null);
//       setEditingTeam(null);
//       loadTeams();
//     } catch (err) {
//       setError(err.response?.data?.detail || "Error updating team");
//       setMessage(null);
//     }
//   };

//   /* ---------------- DELETE TEAM ---------------- */
//   const deleteTeam = async (id) => {
//     if (!window.confirm("Delete this team?")) return;

//     try {
//       await api.delete(`/admin/teams/${id}`);
//       setMessage("Team deleted successfully");
//       setError(null);
//       loadTeams();
//     } catch (err) {
//       setError(
//         err.response?.data?.detail ||
//           "Cannot delete team. It may be assigned to users."
//       );
//       setMessage(null);
//     }
//   };

//   /* ---------------- LOAD TEAM USERS ---------------- */
//   const loadTeamUsers = async (teamId) => {
//     try {
//       const res = await api.get(`/admin/teams/${teamId}/users`);
//       setTeamUsers(res.data);
//       setSelectedTeam(teamId);
//     } catch (err) {
//       setError("Failed to load team members");
//     }
//   };

//   /* ---------------- ADD USER ---------------- */
//   const addUserToTeam = async () => {
//     if (!newUserId) return;

//     try {
//       await api.post(
//         `/admin/teams/${selectedTeam}/users/${newUserId}`
//       );
//       setMessage("User added to team");
//       setError(null);
//       setNewUserId("");
//       loadTeamUsers(selectedTeam);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Error adding user");
//       setMessage(null);
//     }
//   };

//   /* ---------------- REMOVE USER ---------------- */
//   const removeUserFromTeam = async (userId) => {
//     try {
//       await api.delete(
//         `/admin/teams/${selectedTeam}/users/${userId}`
//       );
//       setMessage("User removed from team");
//       setError(null);
//       loadTeamUsers(selectedTeam);
//     } catch (err) {
//       setError(err.response?.data?.detail || "Error removing user");
//       setMessage(null);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h4 className="mb-3">Team Management</h4>

//       {/* ALERTS */}
//       {message && <div className="alert alert-success">{message}</div>}
//       {error && <div className="alert alert-danger">{error}</div>}

//       {/* CREATE TEAM */}
//       <div className="card p-3 mb-3">
//         <div className="d-flex gap-2">
//           <input
//             className="form-control"
//             placeholder="New Team Name"
//             value={newTeam}
//             onChange={(e) => setNewTeam(e.target.value)}
//           />
//           <button className="btn btn-primary" onClick={createTeam}>
//             Add
//           </button>
//         </div>
//       </div>

//       {/* TEAM TABLE */}
//       <div className="card">
//         <div className="card-body">
//           <table className="table table-striped align-middle">
//             <thead>
//               <tr>
//                 <th>Team Name</th>
//                 <th>Created</th>
//                 <th style={{ width: "350px" }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {teams.map((team) => (
//                 <tr key={team.team_id}>
//                   <td>
//                     {editingTeam?.team_id === team.team_id ? (
//                       <input
//                         className="form-control"
//                         value={editingTeam.team_name}
//                         onChange={(e) =>
//                           setEditingTeam({
//                             ...editingTeam,
//                             team_name: e.target.value
//                           })
//                         }
//                       />
//                     ) : (
//                       team.team_name
//                     )}
//                   </td>

//                   <td>{formatDate(team.created_at)}</td>

//                   <td>
//                     {editingTeam?.team_id === team.team_id ? (
//                       <>
//                         <button
//                           className="btn btn-sm btn-success me-2"
//                           onClick={updateTeam}
//                         >
//                           Save
//                         </button>
//                         <button
//                           className="btn btn-sm btn-secondary"
//                           onClick={() => setEditingTeam(null)}
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button
//                           className="btn btn-sm btn-info me-2"
//                           onClick={() =>
//                             loadTeamUsers(team.team_id)
//                           }
//                         >
//                           Members
//                         </button>

//                         <button
//                           className="btn btn-sm btn-warning me-2"
//                           onClick={() => setEditingTeam(team)}
//                         >
//                           Edit
//                         </button>

//                         <button
//                           className="btn btn-sm btn-danger"
//                           onClick={() =>
//                             deleteTeam(team.team_id)
//                           }
//                         >
//                           Delete
//                         </button>
//                       </>
//                     )}
//                   </td>
//                 </tr>
//               ))}

//               {teams.length === 0 && (
//                 <tr>
//                   <td colSpan="3" className="text-center">
//                     No teams available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* TEAM MEMBERS PANEL */}
//       {selectedTeam && (
//         <div className="card mt-4 p-3">
//           <h5>Team Members</h5>

//           <div className="d-flex gap-2 mb-3">
//             <input
//               className="form-control"
//               placeholder="Enter User ID"
//               value={newUserId}
//               onChange={(e) => setNewUserId(e.target.value)}
//             />
//             <button
//               className="btn btn-primary"
//               onClick={addUserToTeam}
//             >
//               Add User
//             </button>
//           </div>

//           <ul className="list-group">
//             {teamUsers.map((u) => (
//               <li
//                 key={u.user_id}
//                 className="list-group-item d-flex justify-content-between align-items-center"
//               >
//                 <span>
//                   {u.username} ({u.email})
//                 </span>

//                 <button
//                   className="btn btn-sm btn-danger"
//                   onClick={() =>
//                     removeUserFromTeam(u.user_id)
//                   }
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}

//             {teamUsers.length === 0 && (
//               <li className="list-group-item text-center">
//                 No users in this team
//               </li>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [editingTeam, setEditingTeam] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [teamFiles, setTeamFiles] = useState([]);
const [totalFiles, setTotalFiles] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamUsers, setTeamUsers] = useState([]);
  const [newUserId, setNewUserId] = useState("");

  /* ---------------- FORMAT DATE ---------------- */
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date)) return "-";

    return date.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata"
    });
  };

  /* ---------------- LOAD TEAMS ---------------- */
  const loadTeams = async () => {
    try {
      const res = await api.get("/admin/teams");
      setTeams(res.data);
    } catch (err) {
      setError("Failed to load teams");
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  /* ---------------- CREATE TEAM ---------------- */
  const createTeam = async () => {
    if (!newTeam.trim()) return;

    try {
      await api.post("/admin/teams", null, {
        params: { name: newTeam }
      });

      setMessage("Team created successfully");
      setError(null);
      setNewTeam("");
      loadTeams();
    } catch (err) {
      setError(err.response?.data?.detail || "Error creating team");
      setMessage(null);
    }
  };

  const loadTeamFiles = async (teamId) => {
  try {
    const res = await api.get(`/admin/teams/${teamId}/files`);
    setTeamFiles(res.data.files || []);
    setTotalFiles(res.data.total_files || 0);
    setSelectedTeam(teamId);
  } catch (err) {
    setError("Failed to load team files");
  }
};
  /* ---------------- UPDATE TEAM ---------------- */
  const updateTeam = async () => {
    try {
      await api.put(`/admin/teams/${editingTeam.team_id}`, null, {
        params: { name: editingTeam.team_name }
      });

      setMessage("Team updated successfully");
      setError(null);
      setEditingTeam(null);
      loadTeams();
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating team");
      setMessage(null);
    }
  };

  /* ---------------- LOAD TEAM USERS ---------------- */
  const loadTeamUsers = async (teamId) => {
    try {
      const res = await api.get(`/admin/teams/${teamId}/users`);
      setTeamUsers(res.data);
      setSelectedTeam(teamId);
    } catch (err) {
      setError("Failed to load team members");
    }
  };

  /* ---------------- ADD USER ---------------- */
  const addUserToTeam = async () => {
    if (!newUserId) return;

    try {
      // await api.post(
      //   `/admin/teams/${selectedTeam}/users/${newUserId}`
      // );
      await api.post(
  `/admin/teams/${selectedTeam}/users`,
  null,
  { params: { username: newUserId } }
);
      setMessage("User added to team");
      setError(null);
      setNewUserId("");
      loadTeamUsers(selectedTeam);
    } catch (err) {
      setError(err.response?.data?.detail || "Error adding user");
      setMessage(null);
    }
  };

  /* ---------------- REMOVE USER ---------------- */
  const removeUserFromTeam = async (userId) => {
    try {
      await api.delete(
        `/admin/teams/${selectedTeam}/users/${userId}`
      );
      setMessage("User removed from team");
      setError(null);
      loadTeamUsers(selectedTeam);
    } catch (err) {
      setError(err.response?.data?.detail || "Error removing user");
      setMessage(null);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Team Management</h4>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* CREATE TEAM */}
      <div className="card p-3 mb-3">
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="New Team Name"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
          />
          <button className="btn btn-primary" onClick={createTeam}>
            Add
          </button>
        </div>
      </div>

      {/* TEAM TABLE */}
      <div className="card">
        <div className="card-body">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Created</th>
                <th style={{ width: "300px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.team_id}>
                  <td>
                    {editingTeam?.team_id === team.team_id ? (
                      <input
                        className="form-control"
                        value={editingTeam.team_name}
                        onChange={(e) =>
                          setEditingTeam({
                            ...editingTeam,
                            team_name: e.target.value
                          })
                        }
                      />
                    ) : (
                      team.team_name
                    )}
                  </td>

                  <td>{formatDate(team.created_at)}</td>

                  <td>
                    {editingTeam?.team_id === team.team_id ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={updateTeam}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditingTeam(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() =>
                            loadTeamUsers(team.team_id)
                          }
                        >
                          Members
                        </button>

                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setEditingTeam(team)}
                        >
                          Edit
                        </button>
                        <button
  className="btn btn-sm btn-secondary me-2"
  onClick={() => loadTeamFiles(team.team_id)}
>
  Files
</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {teams.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    No teams available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TEAM MEMBERS PANEL */}
      {selectedTeam && (
        <div className="card mt-4 p-3">
          <h5>Team Members</h5>

          <div className="d-flex gap-2 mb-3">
            <input
              className="form-control"
              placeholder="Enter User ID"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={addUserToTeam}
            >
              Add User
            </button>
          </div>

          <ul className="list-group">
            {teamUsers.map((u) => (
              <li
                key={u.user_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {u.username} ({u.email})
                </span>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    removeUserFromTeam(u.user_id)
                  }
                >
                  Remove
                </button>
              </li>
            ))}

            {teamUsers.length === 0 && (
              <li className="list-group-item text-center">
                No users in this team
              </li>
            )}
          </ul>
        </div>
      )}
      {/* TEAM FILES PANEL */}
{selectedTeam && teamFiles && (
  <div className="card mt-4 p-3">
    <h5>
      Team Files
      <span className="badge bg-primary ms-2">
        {totalFiles}
      </span>
    </h5>

    {teamFiles.length === 0 ? (
      <p className="text-muted text-center">
        No files uploaded by this team
      </p>
    ) : (
      <ul className="list-group">
        {teamFiles.map((f) => (
          <li
            key={f.file_id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{f.file_name || "-"}</strong>
              <div className="small text-muted">
                Uploaded:{" "}
                {f.uploaded_at
                  ? new Date(f.uploaded_at).toLocaleString()
                  : "-"}
              </div>
            </div>

            <span className="badge bg-secondary">
              {f.file_size_kb ?? "-"} KB
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
)}
    </div>
  );
}