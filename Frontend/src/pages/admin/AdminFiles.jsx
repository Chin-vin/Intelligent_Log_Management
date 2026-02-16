// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import FileUpload from "../FileUpload";
// import ConfirmModal from "../../components/ConfirmModal";

// export default function AdminFiles() {
//   const [files, setFiles] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [feedback, setFeedback] = useState(null);
//   const [allowedFormats, setAllowedFormats] = useState([]);
//   const [previewFile, setPreviewFile] = useState(null);
// const [previewUrl, setPreviewUrl] = useState(null);
// const [previewType, setPreviewType] = useState(null);


//   const [selectedFile, setSelectedFile] = useState(null);
//   const [action, setAction] = useState(null); // delete | restore

//   /* ================= FILTERS ================= */
//   const [filters, setFilters] = useState({
//     file_name: "",
//     file_type: "",
//     team_id: "",
//     status: "", // UPLOADED | SOFT_DELETED | ARCHIVED
//   });

//   /* ================= PAGINATION ================= */
//   const [page, setPage] = useState(1);
//   const pageSize = 10;
//   const [total, setTotal] = useState(0);
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   /* ================= LOAD FILES ================= */
//   const loadFiles = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get("/admin/files", {
//         params: {
//           page,
//           page_size: pageSize,
//           file_name: filters.file_name || undefined,
//           file_type: filters.file_type || undefined,
//           team_id: filters.team_id || undefined,
//           status: filters.status || undefined,
//         },
//       });

//       setFiles(res.data.files || []);
//       setTotal(res.data.total || 0);
//     } catch {
//       setFeedback({ type: "danger", text: "Failed to load files" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= LOAD TEAMS ================= */
//   useEffect(() => {
//     api.get("/lookups/teams").then((res) => setTeams(res.data || []));
//   }, []);

//   useEffect(() => {
//     loadFiles();
//   }, [page, filters]);

//   useEffect(() => {
//   if (!filters.team_id) {
//     setAllowedFormats([]);
//     return;
//   }

//   api
//     .get(`/lookups/teams/${filters.team_id}/allowed-formats`)
//     .then(res => setAllowedFormats(res.data || []))
//     .catch(() => setAllowedFormats([]));
// }, [filters.team_id]);

//   /* ================= DOWNLOAD ================= */
//   // const downloadFile = async (file) => {
//   //   const res = await api.get(`/admin/files/${file.file_id}/download`, {
//   //     responseType: "blob",
//   //   });

//   //   const blob = new Blob([res.data]);
//   //   const url = URL.createObjectURL(blob);

//   //   const a = document.createElement("a");
//   //   a.href = url;
//   //   a.download = file.file_name;
//   //   a.click();

//   //   URL.revokeObjectURL(url);
//   // };
//   const openPreview = async (file) => {
//   const res = await api.get(
//     `/admin/files/${file.file_id}/preview`,
//     { responseType: "blob" }
//   );

//   const blob = new Blob([res.data], {
//     type: res.headers["content-type"],
//   });

//   const url = URL.createObjectURL(blob);

//   setPreviewFile(file);
//   setPreviewUrl(url);
//   setPreviewType(res.headers["content-type"]);
// };
// const downloadFromPreview = () => {
//   const a = document.createElement("a");
//   a.href = previewUrl;
//   a.download = previewFile.file_name;
//   a.click();
// };



//   /* ================= DELETE ================= */
//   const confirmDelete = async () => {
//     await api.delete(`/files/${selectedFile.file_id}`);
//     setFeedback({ type: "success", text: "File moved to recycle bin" });
//     setSelectedFile(null);
//     setAction(null);
//     loadFiles();
//   };

//   /* ================= RESTORE ================= */
//   const confirmRestore = async () => {
//     await api.patch(`/files/${selectedFile.file_id}/restore`);
//     setFeedback({ type: "success", text: "File restored successfully" });
//     setSelectedFile(null);
//     setAction(null);
//     loadFiles();
//   };

//   /* ================= STATUS BADGE ================= */
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


//   return (
//     <div className="container-fluid mt-4">

//       {/* ================= FEEDBACK ================= */}
//       {feedback && (
//         <div className={`alert alert-${feedback.type} alert-dismissible fade show`}>
//           {feedback.text}
//           <button className="btn-close" onClick={() => setFeedback(null)} />
//         </div>
//       )}

//       {/* ================= UPLOAD ================= */}
//       <FileUpload onUploadSuccess={() => {
//         setPage(1);
//         loadFiles();
//       }} />
//       {filters.team_id && (
//   <div className="mb-3">
//     <div className="form-text">
//       Supported formats for selected team:&nbsp;
//       {allowedFormats.length
//         ? allowedFormats.map(f => f.format_name).join(", ")
//         : "None"}
//     </div>
//   </div>
// )}


//       <h4 className="mt-3">All Files (Admin)</h4>

//       {/* ================= FILTERS ================= */}
//       <div className="card p-3 mb-3 shadow-sm">
//         <div className="row g-3 align-items-end">

//           <div className="col-md-3">
//             <label className="form-label">File Name</label>
//             <input
//               type="text"
//               className="form-control"
//               value={filters.file_name}
//               onChange={(e) =>
//                 setFilters({ ...filters, file_name: e.target.value })
//               }
//             />
//           </div>

//           <div className="col-md-2">
//             <label className="form-label">File Type</label>
//             <select
//               className="form-select"
//               value={filters.file_type}
//               onChange={(e) =>
//                 setFilters({ ...filters, file_type: e.target.value })
//               }
//             >
//               <option value="">All</option>
//               <option value="txt">TXT</option>
//               <option value="json">JSON</option>
//               <option value="csv">CSV</option>
//               <option value="xml">XML</option>
//             </select>
//           </div>

//           <div className="col-md-2">
//             <label className="form-label">Team</label>
//             <select
//               className="form-select"
//               value={filters.team_id}
//               onChange={(e) =>
//                 setFilters({ ...filters, team_id: e.target.value })
//               }
//             >
//               <option value="">All</option>
//               {teams.map((t) => (
//                 <option key={t.team_id} value={t.team_id}>
//                   {t.team_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="col-md-2">
//             <label className="form-label">Status</label>
//             <select
//               className="form-select"
//               value={filters.status}
//               onChange={(e) =>
//                 setFilters({ ...filters, status: e.target.value })
//               }
//             >
//               <option value="">All</option>
//               <option value="PARSED">Active</option>
//               <option value="SOFT_DELETED">Deleted</option>
//               <option value="ARCHIVED">Archived</option>
//             </select>
//           </div>

//           <div className="col-md-3">
//             <button
//               className="btn btn-secondary w-100"
//               onClick={() => {
//                 setFilters({
//                   file_name: "",
//                   file_type: "",
//                   team_id: "",
//                   status: "",
//                 });
//                 setPage(1);
//               }}
//             >
//               Reset Filters
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="card shadow-sm">
//         <div className="card-body">
//           {loading ? (
//             <p className="text-muted">Loading...</p>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-sm table-striped align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th>File</th>
//                     <th>Team</th>
//                     <th>User</th>
//                     <th>Status</th>
//                     <th>Uploaded</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {files.map((f) => (
//                     <tr key={f.file_id}>
//                       <td>{f.file_name}</td>
//                       <td>{f.team}</td>
//                       <td>{f.uploaded_by}</td>

//                       <td>
//                         <span className={`badge ${badgeClass(f.status)}`}>
//                           {f.status}
//                         </span>
//                       </td>

//                       <td>{new Date(f.uploaded_at).toLocaleString()}</td>
// <td>
//   <div className="d-flex gap-2">

//     {/* DOWNLOAD → only if PARSED */}
//     {/* {f.status === "PARSED" && (
//       <button
//         className="btn btn-sm btn-outline-primary"
//         onClick={() => downloadFile(f)}
//       >
//         Download
//       </button>
//     )} */}

//     {f.status === "PARSED" && (
//   <button
//     className="btn btn-sm btn-outline-info"
//     onClick={() => openPreview(f)}
//   >
//     Preview
//   </button>
// )}


//     {/* DELETE → only if PARSED */}
//     {f.status === "PARSED" && (
//       <button
//         className="btn btn-sm btn-outline-danger"
//         onClick={() => {
//           setSelectedFile(f);
//           setAction("delete");
//         }}
//       >
//         Delete
//       </button>
//     )}

//     {/* RESTORE → only if SOFT_DELETED */}
//     {f.status === "SOFT_DELETED" && (
//       <button
//         className="btn btn-sm btn-outline-success"
//         onClick={() => {
//           setSelectedFile(f);
//           setAction("restore");
//         }}
//       >
//         Restore
//       </button>
//     )}

//   </div>
// </td>

//                     </tr>
//                   ))}

//                   {files.length === 0 && (
//                     <tr>
//                       <td colSpan="6" className="text-center text-muted">
//                         No files found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ================= PAGINATION ================= */}
//       <div className="d-flex justify-content-between align-items-center mt-3">
//         <span className="text-muted small">
//           Page <strong>{page}</strong> of <strong>{totalPages}</strong> ·{" "}
//           <strong>{total}</strong> records
//         </span>

//         <div className="btn-group">
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//           >
//             ◀ Prev
//           </button>
//           <button
//             className="btn btn-sm btn-outline-secondary"
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//           >
//             Next ▶
//           </button>
//         </div>
//       </div>

//       {/* ================= CONFIRM MODAL ================= */}
//       <ConfirmModal
//         show={!!selectedFile}
//         title={action === "delete" ? "Delete File" : "Restore File"}
//         message={
//           action === "delete"
//             ? `Delete "${selectedFile?.file_name}"?`
//             : `Restore "${selectedFile?.file_name}"?`
//         }
//         confirmText="Confirm"
//         onConfirm={action === "delete" ? confirmDelete : confirmRestore}
//         onCancel={() => {
//           setSelectedFile(null);
//           setAction(null);
//         }}
//       />
//       {previewFile && (
//   <div className="modal fade show d-block" tabIndex="-1">
//     <div className="modal-dialog modal-xl modal-dialog-centered">
//       <div className="modal-content">

//         <div className="modal-header">
//           <h5 className="modal-title">{previewFile.file_name}</h5>
//           <button
//             className="btn-close"
//             onClick={() => {
//               URL.revokeObjectURL(previewUrl);
//               setPreviewFile(null);
//               setPreviewUrl(null);
//             }}
//           />
//         </div>

//         <div className="modal-body" style={{ height: "70vh" }}>
//           {/* PDF */}
//           {previewType?.includes("pdf") && (
//             <iframe
//               src={previewUrl}
//               title="PDF Preview"
//               style={{ width: "100%", height: "100%", border: "none" }}
//             />
//           )}

//           {/* Images */}
//           {previewType?.startsWith("image/") && (
//             <img
//               src={previewUrl}
//               alt="Preview"
//               className="img-fluid mx-auto d-block"
//             />
//           )}

//           {/* Text / JSON / CSV */}
//           {previewType?.includes("text") && (
//             <iframe
//               src={previewUrl}
//               title="Text Preview"
//               style={{ width: "100%", height: "100%", border: "none" }}
//             />
//           )}

//           {/* Unsupported */}
//           {!previewType?.includes("pdf") &&
//             !previewType?.startsWith("image/") &&
//             !previewType?.includes("text") && (
//               <p className="text-muted text-center">
//                 Preview not supported for this file type
//               </p>
//             )}
//         </div>

//         <div className="modal-footer">
//           <button
//             className="btn btn-outline-secondary"
//             onClick={() => {
//               URL.revokeObjectURL(previewUrl);
//               setPreviewFile(null);
//               setPreviewUrl(null);
//             }}
//           >
//             Close
//           </button>

//           <button
//             className="btn btn-primary"
//             onClick={downloadFromPreview}
//           >
//             Download
//           </button>
//         </div>

//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import FileUpload from "../FileUpload";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminFiles() {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [allowedFormats, setAllowedFormats] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [action, setAction] = useState(null);

  /* ================= FILTERS ================= */
  const [filters, setFilters] = useState({
    file_name: "",
    file_type: "",
    team_id: "",
    status: "",
  });

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ================= LOAD FILES ================= */
  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/files", {
        params: {
          page,
          page_size: pageSize,
          file_name: filters.file_name || undefined,
          file_type: filters.file_type || undefined,
          team_id: filters.team_id || undefined,
          status: filters.status || undefined,
        },
      });

      setFiles(res.data.files || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setFeedback({ type: "danger", text: "Failed to load files" });
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD TEAMS ================= */
  useEffect(() => {
    api.get("/lookups/teams").then((res) => setTeams(res.data || []));
  }, []);

  useEffect(() => {
    loadFiles();
  }, [page, filters]);

  useEffect(() => {
    if (!filters.team_id) {
      setAllowedFormats([]);
      return;
    }

    api
      .get(`/lookups/teams/${filters.team_id}/allowed-formats`)
      .then((res) => setAllowedFormats(res.data || []))
      .catch(() => setAllowedFormats([]));
  }, [filters.team_id]);

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    await api.delete(`/files/${selectedFile.file_id}`);
    setSelectedFile(null);
    setAction(null);
    loadFiles();
  };

  /* ================= RESTORE ================= */
  const confirmRestore = async () => {
    await api.patch(`/files/${selectedFile.file_id}/restore`);
    setSelectedFile(null);
    setAction(null);
    loadFiles();
  };

  /* ================= STATUS BADGE ================= */
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

  return (
    <div className="container-fluid mt-4">

      {/* FEEDBACK */}
      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {/* UPLOAD */}
      <FileUpload onUploadSuccess={loadFiles} />

      {filters.team_id && (
        <div className="mb-3 form-text">
          Supported formats:&nbsp;
          {allowedFormats.length
            ? allowedFormats.map(f => f.format_name).join(", ")
            : "None"}
        </div>
      )}

      <h4 className="mt-3">All Files (Admin)</h4>

      {/* FILTERS */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="row g-3 align-items-end">

          <div className="col-md-3">
            <label className="form-label">File Name</label>
            <input
              className="form-control"
              value={filters.file_name}
              onChange={(e) =>
                setFilters({ ...filters, file_name: e.target.value })
              }
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">File Type</label>
            <select
              className="form-select"
              value={filters.file_type}
              onChange={(e) =>
                setFilters({ ...filters, file_type: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="txt">TXT</option>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Team</label>
            <select
              className="form-select"
              value={filters.team_id}
              onChange={(e) =>
                setFilters({ ...filters, team_id: e.target.value })
              }
            >
              <option value="">All</option>
              {teams.map((t) => (
                <option key={t.team_id} value={t.team_id}>
                  {t.team_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="PARSED">Active</option>
              <option value="SOFT_DELETED">Deleted</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="col-md-3">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setFilters({
                  file_name: "",
                  file_type: "",
                  team_id: "",
                  status: "",
                });
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="table table-sm table-striped align-middle">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Team</th>
                  <th>User</th>
                  <th>Status</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.file_id}>
                    <td>{f.file_name}</td>
                    <td>{f.team}</td>
                    <td>{f.uploaded_by}</td>
                    <td>
                      <span className={`badge ${badgeClass(f.status)}`}>
                        {f.status}
                      </span>
                    </td>
                    <td>{new Date(f.uploaded_at).toLocaleString()}</td>
                    <td>
                      {f.status === "PARSED" && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={() =>
                              navigate(`/admin/files/${f.file_id}/preview`, {
                                state: { fileName: f.file_name },
                              })
                            }
                          >
                            Preview
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setSelectedFile(f);
                              setAction("delete");
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}

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
                    </td>
                  </tr>
                ))}

                {files.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      No files found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted small">
          Page {page} of {totalPages} · {total} records
        </span>
        <div className="btn-group">
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ◀ Prev
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        show={!!selectedFile}
        title={action === "delete" ? "Delete File" : "Restore File"}
        message="Are you sure?"
        onConfirm={action === "delete" ? confirmDelete : confirmRestore}
        onCancel={() => {
          setSelectedFile(null);
          setAction(null);
        }}
      />
    </div>
  );
}
