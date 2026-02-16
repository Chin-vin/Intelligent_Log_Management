// // // // // // import api from "../api/axios";

// // // // // // export default function UserRow({ user, reload }) {
// // // // // //   const toggleStatus = async () => {
// // // // // //     await api.patch(`/admin/users/${user.user_id}/status`, null, {
// // // // // //       params: { is_active: !user.is_active },
// // // // // //     });
// // // // // //     reload();
// // // // // //   };

// // // // // //  const deleteUser = async () => {
// // // // // // //   if (!window.confirm("Delete this user?")) return;
// // // // // // //      const ans = prompt("Type DELETE to confirm");

// // // // // // //   if (ans !== "DELETE") return;

// // // // // //   try {
// // // // // //     await api.delete(`/admin/users/${user.user_id}/delete`);
// // // // // //     reload();
// // // // // //   } catch (err) {
// // // // // //     console.error("DELETE FAILED", err);
// // // // // //     alert(
// // // // // //       err.response?.data?.detail ||
// // // // // //       err.response?.data?.message ||
// // // // // //       "Delete failed"
// // // // // //     );
// // // // // //   }
// // // // // // };

// // // // // //   return (
// // // // // //     <tr>
// // // // // //       <td>{user.email}</td>
// // // // // //       <td>{user.username}</td>

// // // // // //       <td>
// // // // // //         {user.roles.map((r) => (
// // // // // //           <span key={r} className="badge bg-primary me-1">
// // // // // //             {r}
// // // // // //           </span>
// // // // // //         ))}
// // // // // //       </td>

// // // // // //       <td>
// // // // // //         {user.teams.map((t) => (
// // // // // //           <span key={t} className="badge bg-secondary me-1">
// // // // // //             {t}
// // // // // //           </span>
// // // // // //         ))}
// // // // // //       </td>

// // // // // //       <td>
// // // // // //         {user.is_active ? (
// // // // // //           <span className="badge bg-success">Active</span>
// // // // // //         ) : (
// // // // // //           <span className="badge bg-danger">Disabled</span>
// // // // // //         )}
// // // // // //       </td>

// // // // // //       <td>
// // // // // //         <button
// // // // // //           className="btn btn-sm btn-outline-warning me-2"
// // // // // //           onClick={toggleStatus}
// // // // // //         >
// // // // // //           {user.is_active ? "Disable" : "Enable"}
// // // // // //         </button>

// // // // // //         <button
// // // // // //           className="btn btn-sm btn-outline-danger"
// // // // // //           onClick={deleteUser}
// // // // // //         >
// // // // // //           Delete
// // // // // //         </button>
// // // // // //       </td>
// // // // // //     </tr>
// // // // // //   );
// // // // // // }
// // // // // import { useState } from "react";
// // // // // import api from "../api/axios";
// // // // // import EditUserModal from "./EditUserModal";
// // // // // import ConfirmModal from "./ConfirmModal";

// // // // // export default function UserRow({ user, reload }) {
// // // // //   const [showEdit, setShowEdit] = useState(false);
// // // // //   const [confirmDelete, setConfirmDelete] = useState(false);
// // // // //   const [message, setMessage] = useState(null);

// // // // //   /* ---------------- ENABLE / DISABLE ---------------- */
// // // // //   const toggleStatus = async () => {
// // // // //     try {
// // // // //       await api.patch(`/admin/users/${user.user_id}/status`, null, {
// // // // //         params: { is_active: !user.is_active },
// // // // //       });
// // // // //       reload();
// // // // //     } catch {
// // // // //       alert("Status update failed");
// // // // //     }
// // // // //   };

// // // // //   /* ---------------- DELETE ---------------- */
// // // // //   const deleteUser = async () => {
// // // // //     try {
// // // // //       await api.delete(`/admin/users/${user.user_id}/delete`);
// // // // //       setMessage("User deleted successfully");
// // // // //       setConfirmDelete(false);
// // // // //       reload();
// // // // //     } catch (err) {
// // // // //       alert(err.response?.data?.detail || "Delete failed");
// // // // //       setConfirmDelete(false);
// // // // //     }
// // // // //   };

// // // // //   /* ---------------- RESTORE ---------------- */
// // // // //   const restoreUser = async () => {
// // // // //     try {
// // // // //       await api.patch(`/admin/users/${user.user_id}/restore`);
// // // // //       setMessage("User restored successfully");
// // // // //       reload();
// // // // //     } catch {
// // // // //       alert("Restore failed");
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <>
// // // // //       {/* SUCCESS MESSAGE */}
// // // // //       {message && (
// // // // //         <tr>
// // // // //           <td colSpan="6">
// // // // //             <div className="alert alert-success mb-2">{message}</div>
// // // // //           </td>
// // // // //         </tr>
// // // // //       )}

// // // // //       <tr>
// // // // //         <td>{user.email}</td>
// // // // //         <td>{user.username}</td>

// // // // //         <td>
// // // // //           {user.roles.map((r) => (
// // // // //             <span key={r} className="badge bg-primary me-1">
// // // // //               {r}
// // // // //             </span>
// // // // //           ))}
// // // // //         </td>

// // // // //         <td>
// // // // //           {user.teams.map((t) => (
// // // // //             <span key={t} className="badge bg-secondary me-1">
// // // // //               {t}
// // // // //             </span>
// // // // //           ))}
// // // // //         </td>

// // // // //         <td>
// // // // //           {user.is_deleted ? (
// // // // //             <span className="badge bg-secondary">Deleted</span>
// // // // //           ) : user.is_active ? (
// // // // //             <span className="badge bg-success">Active</span>
// // // // //           ) : (
// // // // //             <span className="badge bg-warning text-dark">Disabled</span>
// // // // //           )}
// // // // //         </td>

// // // // //         <td>
// // // // //           <div className="d-flex gap-2">

// // // // //             {/* ✅ EDIT (BACK & WORKING) */}
// // // // //             <button
// // // // //               className="btn btn-sm btn-outline-primary"
// // // // //               disabled={user.is_deleted}
// // // // //               onClick={() => setShowEdit(true)}
// // // // //             >
// // // // //               Edit
// // // // //             </button>

// // // // //             {/* ENABLE / DISABLE */}
// // // // //             <button
// // // // //               className="btn btn-sm btn-outline-warning"
// // // // //               disabled={user.is_deleted}
// // // // //               onClick={toggleStatus}
// // // // //             >
// // // // //               {user.is_active ? "Disable" : "Enable"}
// // // // //             </button>

// // // // //             {/* DELETE / RESTORE */}
// // // // //             {!user.is_deleted ? (
// // // // //               <button
// // // // //                 className="btn btn-sm btn-outline-danger"
// // // // //                 onClick={() => setConfirmDelete(true)}
// // // // //               >
// // // // //                 Delete
// // // // //               </button>
// // // // //             ) : (
// // // // //               <button
// // // // //                 className="btn btn-sm btn-outline-success"
// // // // //                 onClick={restoreUser}
// // // // //               >
// // // // //                 Restore
// // // // //               </button>
// // // // //             )}

// // // // //           </div>
// // // // //         </td>
// // // // //       </tr>

// // // // //       {/* 🔴 CONFIRM DELETE MODAL */}
// // // // //       <ConfirmModal
// // // // //         show={confirmDelete}
// // // // //         title="Delete User"
// // // // //         message={`Are you sure you want to delete "${user.username}"?`}
// // // // //         confirmText="Delete"
// // // // //         onConfirm={deleteUser}
// // // // //         onCancel={() => setConfirmDelete(false)}
// // // // //       />

// // // // //       {/* ✏️ EDIT USER MODAL (RESTORED & CORRECT) */}
// // // // //       {showEdit && (
// // // // //         <EditUserModal
// // // // //           user={user}
// // // // //           onClose={() => setShowEdit(false)}
// // // // //           onUpdated={() => {
// // // // //             setShowEdit(false);
// // // // //             reload();
// // // // //           }}
// // // // //         />
// // // // //       )}
// // // // //     </>
// // // // //   );
// // // // // }
// // // // import { useState } from "react";
// // // // import api from "../api/axios";
// // // // import EditUserModal from "./EditUserModal";
// // // // import ConfirmModal from "./ConfirmModal";

// // // // export default function UserRow({ user, reload }) {
// // // //   const [showEdit, setShowEdit] = useState(false);
// // // //   const [confirmDelete, setConfirmDelete] = useState(false);
// // // //   const [message, setMessage] = useState(null);

// // // //   /* ---------------- ENABLE / DISABLE ---------------- */
// // // //   const toggleStatus = async () => {
// // // //     try {
// // // //       await api.patch(`/admin/users/${user.user_id}/status`, null, {
// // // //         params: { is_active: !user.is_active },
// // // //       });
// // // //       reload();
// // // //     } catch {
// // // //       alert("Status update failed");
// // // //     }
// // // //   };

// // // //   /* ---------------- DELETE ---------------- */
// // // //   const deleteUser = async () => {
// // // //     try {
// // // //       await api.delete(`/admin/users/${user.user_id}/delete`);
// // // //       setMessage("User deleted successfully");
// // // //       setConfirmDelete(false);
// // // //       reload();
// // // //     } catch (err) {
// // // //       alert(err.response?.data?.detail || "Delete failed");
// // // //       setConfirmDelete(false);
// // // //     }
// // // //   };

// // // //   /* ---------------- RESTORE ---------------- */
// // // //   const restoreUser = async () => {
// // // //     try {
// // // //       await api.patch(`/admin/users/${user.user_id}/restore`);
// // // //       setMessage("User restored successfully");
// // // //       reload();
// // // //     } catch {
// // // //       alert("Restore failed");
// // // //     }
// // // //   };

// // // //   return (
// // // //     <>
// // // //       {/* SUCCESS MESSAGE */}
// // // //       {message && (
// // // //         <tr>
// // // //           <td colSpan="6">
// // // //             <div className="alert alert-success mb-2">{message}</div>
// // // //           </td>
// // // //         </tr>
// // // //       )}

// // // //       <tr>
// // // //         <td>{user.email}</td>
// // // //         <td>{user.username}</td>

// // // //         <td>
// // // //           {user.roles.map((r) => (
// // // //             <span key={r} className="badge bg-primary me-1">
// // // //               {r}
// // // //             </span>
// // // //           ))}
// // // //         </td>

// // // //         <td>
// // // //           {user.teams.map((t) => (
// // // //             <span key={t} className="badge bg-secondary me-1">
// // // //               {t}
// // // //             </span>
// // // //           ))}
// // // //         </td>

// // // //         <td>
// // // //           {user.is_deleted ? (
// // // //             <span className="badge bg-secondary">Deleted</span>
// // // //           ) : user.is_active ? (
// // // //             <span className="badge bg-success">Active</span>
// // // //           ) : (
// // // //             <span className="badge bg-warning text-dark">Disabled</span>
// // // //           )}
// // // //         </td>

// // // //         <td>
// // // //           <div className="d-flex gap-2">

// // // //             {/* ✅ EDIT (BACK & WORKING) */}
// // // //             <button
// // // //               className="btn btn-sm btn-outline-primary"
// // // //               disabled={user.is_deleted}
// // // //               onClick={() => setShowEdit(true)}
// // // //             >
// // // //               Edit
// // // //             </button>

// // // //             {/* ENABLE / DISABLE */}
// // // //             <button
// // // //               className="btn btn-sm btn-outline-warning"
// // // //               disabled={user.is_deleted}
// // // //               onClick={toggleStatus}
// // // //             >
// // // //               {user.is_active ? "Disable" : "Enable"}
// // // //             </button>

// // // //             {/* DELETE / RESTORE */}
// // // //             {!user.is_deleted ? (
// // // //               <button
// // // //                 className="btn btn-sm btn-outline-danger"
// // // //                 onClick={() => setConfirmDelete(true)}
// // // //               >
// // // //                 Delete
// // // //               </button>
// // // //             ) : (
// // // //               <button
// // // //                 className="btn btn-sm btn-outline-success"
// // // //                 onClick={restoreUser}
// // // //               >
// // // //                 Restore
// // // //               </button>
// // // //             )}

// // // //           </div>
// // // //         </td>
// // // //       </tr>

// // // //       {/* 🔴 CONFIRM DELETE MODAL */}
// // // //       <ConfirmModal
// // // //         show={confirmDelete}
// // // //         title="Delete User"
// // // //         message={`Are you sure you want to delete "${user.username}"?`}
// // // //         confirmText="Delete"
// // // //         onConfirm={deleteUser}
// // // //         onCancel={() => setConfirmDelete(false)}
// // // //       />

// // // //       {/* ✏️ EDIT USER MODAL (RESTORED & CORRECT) */}
// // // //       {showEdit && (
// // // //         <EditUserModal
// // // //           user={user}
// // // //           onClose={() => setShowEdit(false)}
// // // //           onUpdated={() => {
// // // //             setShowEdit(false);
// // // //             reload();
// // // //           }}
// // // //         />
// // // //       )}
// // // //     </>
// // // //   );
// // // // }
// // // import { useState } from "react";
// // // import api from "../api/axios";
// // // import EditUserModal from "./EditUserModal";
// // // import ConfirmModal from "./ConfirmModal";

// // // export default function UserRow({ user, reload }) {
// // //   const [showEdit, setShowEdit] = useState(false);
// // //   const [confirmDelete, setConfirmDelete] = useState(false);

// // //   const [feedback, setFeedback] = useState(null);
// // //   // feedback = { type: "success" | "error", text: string }

// // //   /* ---------------- HELPER ---------------- */
// // //   const showMessage = (type, text) => {
// // //     setFeedback({ type, text });
// // //     setTimeout(() => setFeedback(null), 3000); // auto-hide after 3s
// // //   };

// // //   /* ---------------- ENABLE / DISABLE ---------------- */
// // //   const toggleStatus = async () => {
// // //     try {
// // //       await api.patch(`/admin/users/${user.user_id}/status`, null, {
// // //         params: { is_active: !user.is_active },
// // //       });
// // //       showMessage("success", "User status updated successfully");
// // //       reload();
// // //     } catch (err) {
// // //       showMessage(
// // //         "error",
// // //         err.response?.data?.detail || "Failed to update user status"
// // //       );
// // //     }
// // //   };

// // //   /* ---------------- DELETE ---------------- */
// // //   const deleteUser = async () => {
// // //     try {
// // //       await api.delete(`/admin/users/${user.user_id}/delete`);
// // //       setConfirmDelete(false);
// // //       showMessage("success", "User deleted successfully");
// // //       reload();
// // //     } catch (err) {
// // //       setConfirmDelete(false);
// // //       showMessage(
// // //         "error",
// // //         err.response?.data?.detail || "Failed to delete user"
// // //       );
// // //     }
// // //   };

// // //   /* ---------------- RESTORE ---------------- */
// // //   const restoreUser = async () => {
// // //     try {
// // //       await api.patch(`/admin/users/${user.user_id}/restore`);
// // //       showMessage("success", "User restored successfully");
// // //       reload();
// // //     } catch (err) {
// // //       showMessage(
// // //         "error",
// // //         err.response?.data?.detail || "Failed to restore user"
// // //       );
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       {/* ===== FEEDBACK MESSAGE ===== */}
// // //       {feedback && (
// // //         <tr>
// // //           <td colSpan="6">
// // //             <div
// // //               className={`alert alert-${
// // //                 feedback.type === "success" ? "success" : "danger"
// // //               } mb-2`}
// // //             >
// // //               {feedback.text}
// // //             </div>
// // //           </td>
// // //         </tr>
// // //       )}

// // //       {/* ===== USER ROW ===== */}
// // //       <tr>
// // //         <td>{user.email}</td>
// // //         <td>{user.username}</td>

// // //         <td>
// // //           {user.roles.map((r) => (
// // //             <span key={r} className="badge bg-primary me-1">
// // //               {r}
// // //             </span>
// // //           ))}
// // //         </td>

// // //         <td>
// // //           {user.teams.map((t) => (
// // //             <span key={t} className="badge bg-secondary me-1">
// // //               {t}
// // //             </span>
// // //           ))}
// // //         </td>

// // //         <td>
// // //           {user.is_deleted ? (
// // //             <span className="badge bg-secondary">Deleted</span>
// // //           ) : user.is_active ? (
// // //             <span className="badge bg-success">Active</span>
// // //           ) : (
// // //             <span className="badge bg-warning text-dark">Disabled</span>
// // //           )}
// // //         </td>

// // //         <td>
// // //           <div className="d-flex gap-2">

// // //             {/* EDIT */}
// // //             <button
// // //               className="btn btn-sm btn-outline-primary"
// // //               disabled={user.is_deleted}
// // //               onClick={() => setShowEdit(true)}
// // //             >
// // //               Edit
// // //             </button>

// // //             {/* ENABLE / DISABLE */}
// // //             <button
// // //               className="btn btn-sm btn-outline-warning"
// // //               disabled={user.is_deleted}
// // //               onClick={toggleStatus}
// // //             >
// // //               {user.is_active ? "Disable" : "Enable"}
// // //             </button>

// // //             {/* DELETE / RESTORE */}
// // //             {!user.is_deleted ? (
// // //               <button
// // //                 className="btn btn-sm btn-outline-danger"
// // //                 onClick={() => setConfirmDelete(true)}
// // //               >
// // //                 Delete
// // //               </button>
// // //             ) : (
// // //               <button
// // //                 className="btn btn-sm btn-outline-success"
// // //                 onClick={restoreUser}
// // //               >
// // //                 Restore
// // //               </button>
// // //             )}
// // //           </div>
// // //         </td>
// // //       </tr>

// // //       {/* ===== CONFIRM DELETE MODAL ===== */}
// // //       <ConfirmModal
// // //         show={confirmDelete}
// // //         title="Delete User"
// // //         message={`Are you sure you want to delete "${user.username}"?`}
// // //         confirmText="Delete"
// // //         onConfirm={deleteUser}
// // //         onCancel={() => setConfirmDelete(false)}
// // //       />

// // //       {/* ===== EDIT USER MODAL ===== */}
// // //       {showEdit && (
// // //         <EditUserModal
// // //           user={user}
// // //           onClose={() => setShowEdit(false)}
// // //           onUpdated={() => {
// // //             setShowEdit(false);
// // //             reload();
// // //           }}
// // //         />
// // //       )}
// // //     </>
// // //   );
// // // }
// // import { useState } from "react";
// // import api from "../api/axios";
// // import EditUserModal from "./EditUserModal";
// // import ConfirmModal from "./ConfirmModal";

// // export default function UserRow({ user, onSuccess, onError }) {
// //   const [showEdit, setShowEdit] = useState(false);
// //   const [confirmDelete, setConfirmDelete] = useState(false);

// //   const toggleStatus = async () => {
// //     try {
// //       await api.patch(`/admin/users/${user.user_id}/status`, null, {
// //         params: { is_active: !user.is_active },
// //       });

// //       onSuccess(
// //         `User "${user.username || user.email}" ${
// //           user.is_active ? "disabled" : "enabled"
// //         } successfully`
// //       );
// //     } catch (err) {
// //       onError(err.response?.data?.detail || "Failed to update status");
// //     }
// //   };

// //   const deleteUser = async () => {
// //     try {
// //       await api.delete(`/admin/users/${user.user_id}/delete`);
// //       setConfirmDelete(false);
// //       onSuccess(`User "${user.username || user.email}" deleted successfully`);
// //     } catch (err) {
// //       setConfirmDelete(false);
// //       onError(err.response?.data?.detail || "Failed to delete user");
// //     }
// //   };

// //   const restoreUser = async () => {
// //     try {
// //       await api.patch(`/admin/users/${user.user_id}/restore`);
// //       onSuccess(`User "${user.username || user.email}" restored successfully`);
// //     } catch (err) {
// //       onError(err.response?.data?.detail || "Failed to restore user");
// //     }
// //   };

// //   return (
// //     <>
// //       <tr>
// //         <td>{user.email}</td>
// //         <td>{user.username}</td>

// //         <td>
// //           {user.roles.map((r) => (
// //             <span key={r} className="badge bg-primary me-1">{r}</span>
// //           ))}
// //         </td>

// //         <td>
// //           {user.teams.map((t) => (
// //             <span key={t} className="badge bg-secondary me-1">{t}</span>
// //           ))}
// //         </td>

// //         <td>
// //           {user.is_deleted ? (
// //             <span className="badge bg-secondary">Deleted</span>
// //           ) : user.is_active ? (
// //             <span className="badge bg-success">Active</span>
// //           ) : (
// //             <span className="badge bg-warning text-dark">Disabled</span>
// //           )}
// //         </td>

// //         <td>
// //           <div className="d-flex gap-2">
// //             <button
// //               className="btn btn-sm btn-outline-primary"
// //               disabled={user.is_deleted}
// //               onClick={() => setShowEdit(true)}
// //             >
// //               Edit
// //             </button>

// //             <button
// //               className="btn btn-sm btn-outline-warning"
// //               disabled={user.is_deleted}
// //               onClick={toggleStatus}
// //             >
// //               {user.is_active ? "Disable" : "Enable"}
// //             </button>

// //             {!user.is_deleted ? (
// //               <button
// //                 className="btn btn-sm btn-outline-danger"
// //                 onClick={() => setConfirmDelete(true)}
// //               >
// //                 Delete
// //               </button>
// //             ) : (
// //               <button
// //                 className="btn btn-sm btn-outline-success"
// //                 onClick={restoreUser}
// //               >
// //                 Restore
// //               </button>
// //             )}
// //           </div>
// //         </td>
// //       </tr>

// //       <ConfirmModal
// //         show={confirmDelete}
// //         title="Delete User"
// //         message={`Are you sure you want to delete "${user.username}"?`}
// //         confirmText="Delete"
// //         onConfirm={deleteUser}
// //         onCancel={() => setConfirmDelete(false)}
// //       />

// //       {showEdit && (
// //         <EditUserModal
// //           user={user}
// //           onClose={() => setShowEdit(false)}
// //           onUpdated={() => {
// //             setShowEdit(false);
// //             onSuccess(
// //               `User "${user.username || user.email}" updated successfully`
// //             );
// //           }}
// //         />
// //       )}
// //     </>
// //   );
// // }
// import { useState } from "react";
// import api from "../api/axios";
// import ConfirmModal from "./ConfirmModal";
// import EditUserModal from "./EditUserModal";

// export default function UserRow({ user, onSuccess, onError }) {
//   const [showEdit, setShowEdit] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);

//   const toggleStatus = async () => {
//     try {
//       await api.patch(`/admin/users/${user.user_id}/status`, null, {
//         params: { is_active: !user.is_active },
//       });

//       onSuccess(
//         `User "${user.username || user.email}" ${
//           user.is_active ? "disabled" : "enabled"
//         } successfully`
//       );
//     } catch (err) {
//       onError(err.response?.data?.detail || "Status update failed");
//     }
//   };

//   const deleteUser = async () => {
//     try {
//       await api.delete(`/admin/users/${user.user_id}/delete`);
//       setConfirmDelete(false);
//       onSuccess(`User "${user.username || user.email}" deleted successfully`);
//     } catch (err) {
//       setConfirmDelete(false);
//       onError(err.response?.data?.detail || "Delete failed");
//     }
//   };

//   const restoreUser = async () => {
//     try {
//       await api.patch(`/admin/users/${user.user_id}/restore`);
//       onSuccess(`User "${user.username || user.email}" restored successfully`);
//     } catch (err) {
//       onError(err.response?.data?.detail || "Restore failed");
//     }
//   };

//   return (
//     <>
//       <tr>
//         <td>{user.email}</td>
//         <td>{user.username}</td>

//         <td>{user.roles.map(r =>
//           <span key={r} className="badge bg-primary me-1">{r}</span>
//         )}</td>

//         <td>{user.teams.map(t =>
//           <span key={t} className="badge bg-secondary me-1">{t}</span>
//         )}</td>

//         <td>
//           {user.is_deleted ? (
//             <span className="badge bg-secondary">Deleted</span>
//           ) : user.is_active ? (
//             <span className="badge bg-success">Active</span>
//           ) : (
//             <span className="badge bg-warning text-dark">Disabled</span>
//           )}
//         </td>

//         <td>
//           <div className="d-flex gap-2">
//             <button
//               className="btn btn-sm btn-outline-primary"
//               disabled={user.is_deleted}
//               onClick={() => setShowEdit(true)}
//             >
//               Edit
//             </button>

//             <button
//               className="btn btn-sm btn-outline-warning"
//               disabled={user.is_deleted}
//               onClick={toggleStatus}
//             >
//               {user.is_active ? "Disable" : "Enable"}
//             </button>

//             {!user.is_deleted ? (
//               <button
//                 className="btn btn-sm btn-outline-danger"
//                 onClick={() => setConfirmDelete(true)}
//               >
//                 Delete
//               </button>
//             ) : (
//               <button
//                 className="btn btn-sm btn-outline-success"
//                 onClick={restoreUser}
//               >
//                 Restore
//               </button>
//             )}
//           </div>
//         </td>
//       </tr>

//       <ConfirmModal
//         show={confirmDelete}
//         title="Delete User"
//         message={`Delete "${user.username || user.email}"?`}
//         confirmText="Delete"
//         onConfirm={deleteUser}
//         onCancel={() => setConfirmDelete(false)}
//       />

//       {showEdit && (
//         <EditUserModal
//           user={user}
//           onClose={() => setShowEdit(false)}
//           onUpdated={() => {
//             setShowEdit(false);
//             onSuccess(`User "${user.username || user.email}" updated successfully`);
//           }}
//         />
//       )}
//     </>
//   );
// }
import { useState } from "react";
import api from "../api/axios";
import ConfirmModal from "./ConfirmModal";
import EditUserModal from "./EditUserModal";

export default function UserRow({ user, onSuccess, onError }) {
  const [showEdit, setShowEdit] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);
  // "delete" | "toggle" | null

  /* ---------------- ENABLE / DISABLE ---------------- */
  const toggleStatus = async () => {
    try {
      await api.patch(`/admin/users/${user.user_id}/status`, null, {
        params: { is_active: !user.is_active },
      });

      onSuccess(
        `User "${user.username || user.email}" ${
          user.is_active ? "disabled" : "enabled"
        } successfully`
      );
    } catch (err) {
      onError(err.response?.data?.detail || "Failed to update status");
    } finally {
      setConfirmAction(null);
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteUser = async () => {
    try {
      await api.delete(`/admin/users/${user.user_id}/delete`);
      onSuccess(`User "${user.username || user.email}" deleted successfully`);
    } catch (err) {
      onError(err.response?.data?.detail || "Delete failed");
    } finally {
      setConfirmAction(null);
    }
  };

  /* ---------------- RESTORE ---------------- */
  const restoreUser = async () => {
    try {
      await api.patch(`/admin/users/${user.user_id}/restore`);
      onSuccess(`User "${user.username || user.email}" restored successfully`);
    } catch (err) {
      onError(err.response?.data?.detail || "Restore failed");
    }
  };

  return (
    <>
      <tr>
        <td>{user.email}</td>
        <td>{user.username}</td>

        <td>
          {user.roles.map((r) => (
            <span key={r} className="badge bg-primary me-1">
              {r}
            </span>
          ))}
        </td>

        <td>
          {user.teams.map((t) => (
            <span key={t} className="badge bg-secondary me-1">
              {t}
            </span>
          ))}
        </td>

        <td>
          {user.is_deleted ? (
            <span className="badge bg-secondary">Deleted</span>
          ) : user.is_active ? (
            <span className="badge bg-success">Active</span>
          ) : (
            <span className="badge bg-warning text-dark">Disabled</span>
          )}
        </td>

        <td>
          <div className="d-flex gap-2">
            {/* EDIT */}
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={user.is_deleted}
              onClick={() => setShowEdit(true)}
            >
              Edit
            </button>

            {/* ENABLE / DISABLE (CONFIRM) */}
            <button
              className="btn btn-sm btn-outline-warning"
              disabled={user.is_deleted}
              onClick={() => setConfirmAction("toggle")}
            >
              {user.is_active ? "Disable" : "Enable"}
            </button>

            {/* DELETE / RESTORE */}
            {!user.is_deleted ? (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => setConfirmAction("delete")}
              >
                Delete
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline-success"
                onClick={restoreUser}
              >
                Restore
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* ===== CONFIRM MODAL (DELETE / ENABLE / DISABLE) ===== */}
      <ConfirmModal
        show={!!confirmAction}
        title={
          confirmAction === "delete"
            ? "Delete User"
            : user.is_active
            ? "Disable User"
            : "Enable User"
        }
        message={
          confirmAction === "delete"
            ? `Are you sure you want to delete "${user.username || user.email}"?`
            : `Are you sure you want to ${
                user.is_active ? "disable" : "enable"
              } "${user.username || user.email}"?`
        }
        confirmText={
          confirmAction === "delete"
            ? "Delete"
            : user.is_active
            ? "Disable"
            : "Enable"
        }
        onConfirm={
          confirmAction === "delete" ? deleteUser : toggleStatus
        }
        onCancel={() => setConfirmAction(null)}
      />

      {/* EDIT MODAL */}
      {showEdit && (
        <EditUserModal
          user={user}
          onClose={() => setShowEdit(false)}
          onUpdated={() => {
            setShowEdit(false);
            onSuccess(
              `User "${user.username || user.email}" updated successfully`
            );
          }}
        />
      )}
    </>
  );
}
