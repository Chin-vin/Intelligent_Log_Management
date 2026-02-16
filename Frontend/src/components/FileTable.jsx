
// import { useState } from "react";
// import api from "../api/axios";
// import ConfirmModal from "./ConfirmModal";

// export default function FileTable({ files, onRefresh }) {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [action, setAction] = useState(null); // delete | restore
//   const [loading, setLoading] = useState(false);
//   const [feedback, setFeedback] = useState(null);

//   /* ---------- status badge ---------- */
//   const badgeClass = (status) => {
//   switch (status) {
//     case "PARSED":
//       return "bg-success";
//     case "SOFT_DELETED":
//       return "bg-warning text-dark";
//     case "ARCHIVED":
//       return "bg-secondary";
//     case "FAILED":
//       return "bg-danger";
//     default:
//       return "bg-light text-dark";
//   }
// };


//   /* ---------- delete ---------- */
// const confirmDelete = async () => {
//   try {
//     setLoading(true);

//     // 🔥 DO NOT inspect res.status
//     await api.delete(`/files/${selectedFile.file_id}`);

//     setFeedback({
//       type: "success",
//       text: "File moved to recycle bin",
//     });

//     onRefresh();
//   } catch (err) {
//     console.error("DELETE ERROR:", err);

//     setFeedback({
//       type: "danger",
//       text: err.response?.data?.detail || "Delete failed",
//     });
//   } finally {
//     setSelectedFile(null);
//     setAction(null);
//     setLoading(false);
//   }
// };



//   /* ---------- restore ---------- */
//  const confirmRestore = async () => {
//   if (!selectedFile || selectedFile.status !== "SOFT_DELETED") return;

//   try {
//     setLoading(true);
//     await api.patch(`/files/${selectedFile.file_id}/restore`);

//     setFeedback({
//       type: "success",
//       text: "File restored successfully",
//     });

//     onRefresh();
//   } catch (err) {
//     setFeedback({
//       type: "danger",
//       text: err.response?.data?.detail || "Restore failed",
//     });
//   } finally {
//     setSelectedFile(null);
//     setAction(null);
//     setLoading(false);
//   }
// };

//   return (
//     <>
//       {/* ===== FEEDBACK ===== */}
//       {feedback && (
//         <div className={`alert alert-${feedback.type} alert-dismissible fade show`}>
//           {feedback.text}
//           <button className="btn-close" onClick={() => setFeedback(null)} />
//         </div>
//       )}

//       {/* ===== TABLE ===== */}
//       <div className="table-responsive">
//         <table className="table table-sm table-striped align-middle">
//           <thead className="table-light">
//             <tr>
//               <th>File</th>
//               <th>Size (KB)</th>
//               <th>Uploaded</th>
//               <th>Status</th>
//               <th style={{ width: 180 }}>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {files.length === 0 && (
//               <tr>
//                 <td colSpan="5" className="text-center text-muted">
//                   No files found
//                 </td>
//               </tr>
//             )}

//             {files.map((f) => (
//               <tr key={f.file_id}>
//                 <td>{f.original_name}</td>
//                 <td>{(f.file_size_bytes / 1024).toFixed(2)}</td>
//                 <td>{new Date(f.uploaded_at).toLocaleString()}</td>

//                 <td>
//                   <span className={`badge ${badgeClass(f.status)}`}>
//                     {f.status}
//                   </span>
//                 </td>
                
//                 <td>
//                   <div className="d-flex gap-2">
//                     {/* UPLOADED */}
//                     {f.status === "PARSED" && (
//                       <button
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => {
//                           setSelectedFile(f);
//                           setAction("delete");
//                         }}
//                       >
//                         Delete
//                       </button>
//                     )}

//                     {/* SOFT_DELETED */}
//                     {f.status === "SOFT_DELETED" && (
//                       <button
//                         className="btn btn-sm btn-outline-success"
//                         onClick={() => {
//                           setSelectedFile(f);
//                           setAction("restore");
//                         }}
//                       >
//                         Restore
//                       </button>
//                     )}

//                     {/* ARCHIVED */}
//                     {f.status === "ARCHIVED" && (
//                       <span className="text-muted small">No actions</span>
//                     )}
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== CONFIRM MODAL ===== */}
//       <ConfirmModal
//         show={!!selectedFile}
//         title={action === "delete" ? "Delete File" : "Restore File"}
//         message={
//           action === "delete"
//             ? `Delete "${selectedFile?.original_name}"?`
//             : `Restore "${selectedFile?.original_name}"?`
//         }
//         confirmText={loading ? "Processing..." : "Confirm"}
//         onConfirm={action === "delete" ? confirmDelete : confirmRestore}
//         onCancel={() => {
//           setSelectedFile(null);
//           setAction(null);
//         }}
//       />
//     </>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ConfirmModal from "./ConfirmModal";

export default function FileTable({ files, onRefresh }) {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [action, setAction] = useState(null); // delete | restore
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  /* ---------- status badge ---------- */
  const badgeClass = (status) => {
    switch (status) {
      case "PARSED":
        return "bg-success";
      case "SOFT_DELETED":
        return "bg-warning text-dark";
      case "ARCHIVED":
        return "bg-secondary";
      case "FAILED":
        return "bg-danger";
      default:
        return "bg-light text-dark";
    }
  };

  /* ---------- delete ---------- */
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/files/${selectedFile.file_id}`);

      setFeedback({
        type: "success",
        text: "File moved to recycle bin",
      });

      onRefresh();
    } catch (err) {
      setFeedback({
        type: "danger",
        text: err.response?.data?.detail || "Delete failed",
      });
    } finally {
      setSelectedFile(null);
      setAction(null);
      setLoading(false);
    }
  };

  /* ---------- restore ---------- */
  const confirmRestore = async () => {
    if (!selectedFile || selectedFile.status !== "SOFT_DELETED") return;

    try {
      setLoading(true);
      await api.patch(`/files/${selectedFile.file_id}/restore`);

      setFeedback({
        type: "success",
        text: "File restored successfully",
      });

      onRefresh();
    } catch (err) {
      setFeedback({
        type: "danger",
        text: err.response?.data?.detail || "Restore failed",
      });
    } finally {
      setSelectedFile(null);
      setAction(null);
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== FEEDBACK ===== */}
      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show`}>
          {feedback.text}
          <button className="btn-close" onClick={() => setFeedback(null)} />
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="table-responsive">
        <table className="table table-sm table-striped align-middle">
          <thead className="table-light">
            <tr>
              <th>File</th>
              <th>Size (KB)</th>
              <th>Uploaded</th>
              <th>Status</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {files.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No files found
                </td>
              </tr>
            )}

            {files.map((f) => (
              <tr key={f.file_id}>
                <td>{f.original_name}</td>
                <td>{(f.file_size_bytes / 1024).toFixed(2)}</td>
                <td>{new Date(f.uploaded_at).toLocaleString()}</td>

                <td>
                  <span className={`badge ${badgeClass(f.status)}`}>
                    {f.status}
                  </span>
                </td>

                <td>
                  <div className="d-flex gap-2">

                    {/* ===== PREVIEW (NEW) ===== */}
                    {f.status === "PARSED" && (
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() =>
                          navigate(`/files/${f.file_id}/preview`, {
                            state: { fileName: f.original_name },
                          })
                        }
                      >
                        Preview
                      </button>
                    )}

                    {/* DELETE */}
                    {f.status === "PARSED" && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setSelectedFile(f);
                          setAction("delete");
                        }}
                      >
                        Delete
                      </button>
                    )}

                    {/* RESTORE */}
                    {f.status === "SOFT_DELETED" && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => {
                          setSelectedFile(f);
                          setAction("restore");
                        }}
                      >
                        Restore
                      </button>
                    )}

                    {/* ARCHIVED */}
                    {f.status === "ARCHIVED" && (
                      <span className="text-muted small">No actions</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== CONFIRM MODAL ===== */}
      <ConfirmModal
        show={!!selectedFile}
        title={action === "delete" ? "Delete File" : "Restore File"}
        message={
          action === "delete"
            ? `Delete "${selectedFile?.original_name}"?`
            : `Restore "${selectedFile?.original_name}"?`
        }
        confirmText={loading ? "Processing..." : "Confirm"}
        onConfirm={action === "delete" ? confirmDelete : confirmRestore}
        onCancel={() => {
          setSelectedFile(null);
          setAction(null);
        }}
      />
    </>
  );
}
