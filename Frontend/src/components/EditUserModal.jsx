// import { useEffect, useState } from "react";
// import api from "../api/axios";

// export default function EditUserModal({ user, onClose, reload }) {
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState(null); // success / error

//   const [roles, setRoles] = useState([]);
//   const [teams, setTeams] = useState([]);

//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     phone_number: "",
//     job_title: "",
//     is_active: false,
//     roles: [],
//     teams: [],
//   });

//   const isEditable = form.is_active === true;

//   /* ---------------- LOAD USER + META ---------------- */
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const [userRes, rolesRes, teamsRes] = await Promise.all([
//           api.get(`/admin/users/${user.user_id}`),
//           api.get("/lookups/roles"),
//           api.get("/lookups/teams"),
//         ]);

//         const u = userRes.data;

//         setForm({
//           first_name: u.profile?.first_name || "",
//           last_name: u.profile?.last_name || "",
//           phone_number: u.profile?.phone_number || "",
//           job_title: u.profile?.job_title || "",
//           is_active: u.is_active,
//           roles: u.roles.map((r) => r.role_name),
//           teams: u.teams.map((t) => t.team_id),
//         });

//         setRoles(rolesRes.data);
//         setTeams(teamsRes.data);
//       } catch (err) {
//         setMessage({ type: "danger", text: "Failed to load user data" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, [user.user_id]);

//   /* ---------------- HELPERS ---------------- */
//   const toggleItem = (list, value) =>
//     list.includes(value)
//       ? list.filter((v) => v !== value)
//       : [...list, value];

//   const updateField = (key, value) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   /* ---------------- SAVE ---------------- */
//   const save = async () => {
//     setSaving(true);
//     setMessage(null);

//     try {
//       await api.put(`/admin/users/${user.user_id}`, form);

//       setMessage({
//         type: "success",
//         text: "User details updated successfully",
//       });

//       reload();

//       // Auto close after success
//       setTimeout(() => {
//         onClose();
//       }, 1200);
//     } catch (err) {
//       setMessage({
//         type: "danger",
//         text:
//           err.response?.data?.detail ||
//           "Failed to update user details",
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="modal show d-block bg-dark bg-opacity-50">
//       <div className="modal-dialog modal-lg modal-dialog-centered">
//         <div className="modal-content shadow-lg">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               Edit User – <span className="text-muted">{user.username}</span>
//             </h5>
//             <button className="btn-close" onClick={onClose}></button>
//           </div>

//           <div className="modal-body">
//             {loading && <p>Loading user details...</p>}

//             {message && (
//               <div className={`alert alert-${message.type}`}>
//                 {message.text}
//               </div>
//             )}

//             {!loading && (
//               <>
//                 {!isEditable && (
//                   <div className="alert alert-warning">
//                     This user is currently <strong>disabled</strong>.  
//                     Enable the user to edit details.
//                   </div>
//                 )}

//                 {/* PROFILE */}
//                 <h6 className="text-primary mb-2">Profile</h6>

//                 <div className="row g-2">
//                   <div className="col-md-6">
//                     <label>First Name</label>
//                     <input
//                       className="form-control"
//                       value={form.first_name}
//                       disabled={!isEditable}
//                       onChange={(e) =>
//                         updateField("first_name", e.target.value)
//                       }
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Last Name</label>
//                     <input
//                       className="form-control"
//                       value={form.last_name}
//                       disabled={!isEditable}
//                       onChange={(e) =>
//                         updateField("last_name", e.target.value)
//                       }
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Phone</label>
//                     <input
//                       className="form-control"
//                       value={form.phone_number}
//                       disabled={!isEditable}
//                       onChange={(e) =>
//                         updateField("phone_number", e.target.value)
//                       }
//                     />
//                   </div>

//                   <div className="col-md-6">
//                     <label>Job Title</label>
//                     <input
//                       className="form-control"
//                       value={form.job_title}
//                       disabled={!isEditable}
//                       onChange={(e) =>
//                         updateField("job_title", e.target.value)
//                       }
//                     />
//                   </div>
//                 </div>

//                 <hr />

//                 {/* ROLES */}
//                 <h6 className="text-primary">Roles</h6>
//                 <div className="d-flex flex-wrap gap-3">
//                   {roles.map((r) => (
//                     <label key={r.role_name}>
//                       <input
//                         type="checkbox"
//                         disabled={!isEditable}
//                         checked={form.roles.includes(r.role_name)}
//                         onChange={() =>
//                           updateField(
//                             "roles",
//                             toggleItem(form.roles, r.role_name)
//                           )
//                         }
//                       />{" "}
//                       {r.role_name}
//                     </label>
//                   ))}
//                 </div>

//                 <hr />

//                 {/* TEAMS */}
//                 <h6 className="text-primary">Teams</h6>
//                 <div className="d-flex flex-wrap gap-3">
//                   {teams.map((t) => (
//                     <label key={t.team_id}>
//                       <input
//                         type="checkbox"
//                         disabled={!isEditable}
//                         checked={form.teams.includes(t.team_id)}
//                         onChange={() =>
//                           updateField(
//                             "teams",
//                             toggleItem(form.teams, t.team_id)
//                           )
//                         }
//                       />{" "}
//                       {t.team_name}
//                     </label>
//                   ))}
//                 </div>

//                 <hr />

//                 {/* STATUS */}
//                 <label className="fw-bold">
//                   <input
//                     type="checkbox"
//                     checked={form.is_active}
//                     onChange={(e) =>
//                       updateField("is_active", e.target.checked)
//                     }
//                   />{" "}
//                   Active
//                 </label>
//               </>
//             )}
//           </div>

//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>
//               Cancel
//             </button>

//             <button
//               className="btn btn-primary"
//               disabled={!isEditable || saving}
//               onClick={save}
//             >
//               {saving ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EditUserModal({ user, onClose, reload }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    job_title: "",
    is_active: false,
    roles: [],
    teams: [],
  });

  const isEditable = form.is_active === true;

  /* ---------------- LOAD USER + META ---------------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, rolesRes, teamsRes] = await Promise.all([
          api.get(`/admin/users/${user.user_id}`),
          api.get("/lookups/roles"),
          api.get("/lookups/teams"),
        ]);

        const u = userRes.data;

        setForm({
          first_name: u.profile?.first_name || "",
          last_name: u.profile?.last_name || "",
          phone_number: u.profile?.phone_number || "",
          job_title: u.profile?.job_title || "",
          is_active: u.is_active,
          roles: u.roles.map((r) => r.role_name),
          teams: u.teams.map((t) => t.team_id),
        });

        setRoles(rolesRes.data || []);
        setTeams(teamsRes.data || []);
      } catch (err) {
        setMessage({
          type: "danger",
          text: "Failed to load user data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user.user_id]);

  /* ---------------- HELPERS ---------------- */
  const toggleItem = (list, value) =>
    list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ---------------- SAVE (FIXED) ---------------- */
  const save = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await api.put(
        `/admin/users/${user.user_id}`,
        form
      );

      // ✅ IMPORTANT: explicitly check status
      if (res.status === 200) {
        setMessage({
          type: "success",
          text: "User details updated successfully",
        });

        // refresh parent + close modal
        setTimeout(() => {
          reload();
          onClose();
        }, 800);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("EDIT USER ERROR:", err);
      setMessage({
        type: "danger",
        text:
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Failed to update user details",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">
              Edit User –{" "}
              <span className="text-muted">
                {user.username || user.email}
              </span>
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading && <p>Loading user details...</p>}

            {message && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

            {!loading && (
              <>
                {!isEditable && (
                  <div className="alert alert-warning">
                    This user is currently <strong>disabled</strong>.  
                    Enable the user to edit details.
                  </div>
                )}

                {/* PROFILE */}
                <h6 className="text-primary mb-2">Profile</h6>

                <div className="row g-2">
                  <div className="col-md-6">
                    <label>First Name</label>
                    <input
                      className="form-control"
                      value={form.first_name}
                      disabled={!isEditable}
                      onChange={(e) =>
                        updateField("first_name", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Last Name</label>
                    <input
                      className="form-control"
                      value={form.last_name}
                      disabled={!isEditable}
                      onChange={(e) =>
                        updateField("last_name", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Phone</label>
                    <input
                      className="form-control"
                      value={form.phone_number}
                      disabled={!isEditable}
                      onChange={(e) =>
                        updateField("phone_number", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label>Job Title</label>
                    <input
                      className="form-control"
                      value={form.job_title}
                      disabled={!isEditable}
                      onChange={(e) =>
                        updateField("job_title", e.target.value)
                      }
                    />
                  </div>
                </div>

                <hr />

                {/* ROLES */}
                <h6 className="text-primary">Roles</h6>
                <div className="d-flex flex-wrap gap-3">
                  {roles.map((r) => (
                    <label key={r.role_name}>
                      <input
                        type="checkbox"
                        disabled={!isEditable}
                        checked={form.roles.includes(r.role_name)}
                        onChange={() =>
                          updateField(
                            "roles",
                            toggleItem(form.roles, r.role_name)
                          )
                        }
                      />{" "}
                      {r.role_name}
                    </label>
                  ))}
                </div>

                <hr />

                {/* TEAMS */}
                <h6 className="text-primary">Teams</h6>
                <div className="d-flex flex-wrap gap-3">
                  {teams.map((t) => (
                    <label key={t.team_id}>
                      <input
                        type="checkbox"
                        disabled={!isEditable}
                        checked={form.teams.includes(t.team_id)}
                        onChange={() =>
                          updateField(
                            "teams",
                            toggleItem(form.teams, t.team_id)
                          )
                        }
                      />{" "}
                      {t.team_name}
                    </label>
                  ))}
                </div>

                <hr />

                {/* STATUS */}
                <label className="fw-bold">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                      updateField("is_active", e.target.checked)
                    }
                  />{" "}
                  Active
                </label>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>

            <button
              className="btn btn-primary"
              disabled={!isEditable || saving}
              onClick={save}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
