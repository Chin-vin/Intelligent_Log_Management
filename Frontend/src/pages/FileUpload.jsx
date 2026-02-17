// // // // // // // import { useEffect, useState } from "react";
// // // // // // // import api from "../api/axios";

// // // // // // // export default function FileUpload({ onUploadSuccess }) {
// // // // // // //   const [files, setFiles] = useState([]);
// // // // // // //   const [teams, setTeams] = useState([]);
// // // // // // //   const [sources, setSources] = useState([]);
// // // // // // //   // const [categories, setCategories] = useState([]);

// // // // // // //   const [teamId, setTeamId] = useState("");
// // // // // // //   const [sourceId, setSourceId] = useState("");
// // // // // // //   // const [categoryId, setCategoryId] = useState("");
// // // // // // //   const [allowedFormats, setAllowedFormats] = useState([]);

// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [message, setMessage] = useState("");

// // // // // // //   /* ---------- LOAD LOOKUPS ---------- */
// // // // // // //   useEffect(() => {
// // // // // // //     api.get("/lookups/my-teams").then(res => setTeams(res.data));
// // // // // // //     api.get("/lookups/log-sources").then(res => setSources(res.data));
// // // // // // //     // api.get("/lookups/log-categories").then(res => setCategories(res.data));
// // // // // // //   }, []);
  
// // // // // // //   /* ---------- UPLOAD ---------- */
// // // // // // // const uploadFile = async (e) => {
// // // // // // //   e.preventDefault();

// // // // // // //   if (!files.length || !teamId || !sourceId) {
// // // // // // //     setMessage("Please select all fields");
// // // // // // //     return;
// // // // // // //   }

// // // // // // //   setLoading(true);
// // // // // // //   setMessage("");

// // // // // // //   try {
// // // // // // //     const formData = new FormData();

// // // // // // //     for (let i = 0; i < files.length; i++) {
// // // // // // //       formData.append("files", files[i]);
// // // // // // //     }

// // // // // // //     formData.append("team_id", teamId);
// // // // // // //     formData.append("source_id", sourceId);

// // // // // // //     await api.post("/files/upload", formData, {
// // // // // // //       headers: { "Content-Type": "multipart/form-data" }
// // // // // // //     });

// // // // // // //     setMessage("Files uploaded successfully");
// // // // // // //     setFiles([]);
// // // // // // //     setTeamId("");
// // // // // // //     setSourceId("");

// // // // // // //     onUploadSuccess && onUploadSuccess();

// // // // // // //   } catch (err) {
// // // // // // //     setMessage(err.response?.data?.detail || "Upload failed");
// // // // // // //   } finally {
// // // // // // //     setLoading(false);
// // // // // // //   }
// // // // // // // };


// // // // // // //   useEffect(() => {
// // // // // // //   if (!teamId) {
// // // // // // //     setAllowedFormats([]);
// // // // // // //     return;
// // // // // // //   }

// // // // // // //   api
// // // // // // //     .get(`/lookups/teams/${teamId}/allowed-formats`)
// // // // // // //     .then(res => setAllowedFormats(res.data))
// // // // // // //     .catch(() => setAllowedFormats([]));
// // // // // // // }, [teamId]);

// // // // // // // const formatToExt = {
// // // // // // //   TEXT: ".txt",
// // // // // // //   JSON: ".json",
// // // // // // //   CSV: ".csv",
// // // // // // //   XML: ".xml"
// // // // // // // };

// // // // // // // const acceptTypes = allowedFormats
// // // // // // //   .map(f => formatToExt[f.format_name])
// // // // // // //   .filter(Boolean)
// // // // // // //   .join(",");

// // // // // // //   return (
// // // // // // //     <div className="card shadow-sm mb-4">
// // // // // // //       <div className="card-header">
// // // // // // //         <h5 className="mb-0">Upload Log File</h5>
// // // // // // //       </div>

// // // // // // //       <div className="card-body">
// // // // // // //         <form onSubmit={uploadFile}>
// // // // // // //           <div className="row g-3">

// // // // // // //             {/* FILE */}
// // // // // // //             {/* FILE */}
// // // // // // // <div className="col-md-12">
// // // // // // //   <label className="form-label">Log File</label>

// // // // // // //   <input
// // // // // // //   type="file"
// // // // // // //   multiple   // <-- ADD THIS
// // // // // // //   className="form-control"
// // // // // // //   accept={acceptTypes}
// // // // // // //   disabled={!teamId || allowedFormats.length === 0}
// // // // // // //   onChange={(e) => setFile(e.target.files)}
// // // // // // // />


// // // // // // //   {/* Supported formats helper */}
// // // // // // //   {teamId && (
// // // // // // //     <div className="form-text">
// // // // // // //       Supported formats:&nbsp;
// // // // // // //       {allowedFormats.length
// // // // // // //         ? allowedFormats.map(f => f.format_name).join(", ")
// // // // // // //         : "None"}
// // // // // // //     </div>
// // // // // // //   )}
// // // // // // // </div>


// // // // // // //             {/* TEAM */}
// // // // // // //             <div className="col-md-4">
// // // // // // //               <label className="form-label">Team</label>
// // // // // // //               <select
// // // // // // //                 className="form-select"
// // // // // // //                 value={teamId}
// // // // // // //                 onChange={(e) => setTeamId(e.target.value)}
// // // // // // //               >
// // // // // // //                 <option value="">Select team</option>
// // // // // // //                 {teams.map(t => (
// // // // // // //                   <option key={t.team_id} value={t.team_id}>
// // // // // // //                     {t.team_name}
// // // // // // //                   </option>
// // // // // // //                 ))}
// // // // // // //               </select>
// // // // // // //             </div>

// // // // // // //             {/* SOURCE */}
// // // // // // //             <div className="col-md-4">
// // // // // // //               <label className="form-label">Source</label>
// // // // // // //               <select
// // // // // // //                 className="form-select"
// // // // // // //                 value={sourceId}
// // // // // // //                 onChange={(e) => setSourceId(e.target.value)}
// // // // // // //               >
// // // // // // //                 <option value="">Select source</option>
// // // // // // //                 {sources.map(s => (
// // // // // // //                   <option key={s.source_id} value={s.source_id}>
// // // // // // //                     {s.source_name}
// // // // // // //                   </option>
// // // // // // //                 ))}
// // // // // // //               </select>
// // // // // // //             </div>

// // // // // // //             {/* CATEGORY */}
// // // // // // //             {/* <div className="col-md-4">
// // // // // // //               <label className="form-label">Log Category</label>
// // // // // // //               <select
// // // // // // //                 className="form-select"
// // // // // // //                 value={categoryId}
// // // // // // //                 onChange={(e) => setCategoryId(e.target.value)}
// // // // // // //               >
// // // // // // //                 <option value="">Select category</option>
// // // // // // //                 {categories.map(c => (
// // // // // // //                   <option key={c.category_id} value={c.category_id}>
// // // // // // //                     {c.category_name}
// // // // // // //                   </option>
// // // // // // //                 ))}
// // // // // // //               </select> */}
// // // // // // //             {/* </div> */}

// // // // // // //           </div>

// // // // // // //           <button
// // // // // // //             className="btn btn-primary mt-3"
// // // // // // //             disabled={loading}
// // // // // // //           >
// // // // // // //             {loading ? "Uploading..." : "Upload"}
// // // // // // //           </button>
// // // // // // //         </form>

// // // // // // //         {message && (
// // // // // // //           <div className="alert alert-info mt-3">
// // // // // // //             {message}
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }
// // // // // // import { useEffect, useState, useRef } from "react";
// // // // // // import api from "../api/axios";

// // // // // // export default function FileUpload({ onUploadSuccess }) {
// // // // // //   const [files, setFiles] = useState([]);
// // // // // //   const [teams, setTeams] = useState([]);
// // // // // //   const [sources, setSources] = useState([]);
// // // // // //   const [teamId, setTeamId] = useState("");
// // // // // //   const [sourceId, setSourceId] = useState("");
// // // // // //   const [allowedFormats, setAllowedFormats] = useState([]);
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [message, setMessage] = useState("");

// // // // // //   const fileInputRef = useRef(null);

// // // // // //   /* ---------- LOAD LOOKUPS ---------- */
// // // // // //   useEffect(() => {
// // // // // //     api.get("/lookups/my-teams").then(res => setTeams(res.data));
// // // // // //     api.get("/lookups/log-sources").then(res => setSources(res.data));
// // // // // //   }, []);

// // // // // //   /* ---------- LOAD ALLOWED FORMATS ---------- */
// // // // // //   useEffect(() => {
// // // // // //     if (!teamId) {
// // // // // //       setAllowedFormats([]);
// // // // // //       return;
// // // // // //     }

// // // // // //     api
// // // // // //       .get(`/lookups/teams/${teamId}/allowed-formats`)
// // // // // //       .then(res => setAllowedFormats(res.data))
// // // // // //       .catch(() => setAllowedFormats([]));
// // // // // //   }, [teamId]);

// // // // // //   const formatToExt = {
// // // // // //     TEXT: ".txt",
// // // // // //     JSON: ".json",
// // // // // //     CSV: ".csv",
// // // // // //     XML: ".xml"
// // // // // //   };

// // // // // //   const acceptTypes = allowedFormats
// // // // // //     .map(f => formatToExt[f.format_name])
// // // // // //     .filter(Boolean)
// // // // // //     .join(",");

// // // // // //   /* ---------- HANDLE FILE CHANGE ---------- */
// // // // // //   const handleFileChange = (e) => {
// // // // // //     const selectedFiles = Array.from(e.target.files);
// // // // // //     setFiles(selectedFiles);
// // // // // //   };

// // // // // //   /* ---------- UPLOAD ---------- */
// // // // // //   const uploadFile = async (e) => {
// // // // // //     e.preventDefault();

// // // // // //     if (!files.length || !teamId || !sourceId) {
// // // // // //       setMessage("Please select all fields");
// // // // // //       return;
// // // // // //     }

// // // // // //     setLoading(true);
// // // // // //     setMessage("");

// // // // // //     try {
// // // // // //       const formData = new FormData();

// // // // // //       files.forEach(file => {
// // // // // //         formData.append("files", file);
// // // // // //       });

// // // // // //       formData.append("team_id", teamId);
// // // // // //       formData.append("source_id", sourceId);

// // // // // //       await api.post("/files/upload", formData, {
// // // // // //         headers: { "Content-Type": "multipart/form-data" }
// // // // // //       });

// // // // // //       setMessage("Files uploaded successfully");

// // // // // //       // Reset everything
// // // // // //       setFiles([]);
// // // // // //       setTeamId("");
// // // // // //       setSourceId("");

// // // // // //       if (fileInputRef.current) {
// // // // // //         fileInputRef.current.value = "";
// // // // // //       }

// // // // // //       onUploadSuccess && onUploadSuccess();

// // // // // //     } catch (err) {
// // // // // //       setMessage(err.response?.data?.detail || "Upload failed");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="card shadow-sm mb-4">
// // // // // //       <div className="card-header">
// // // // // //         <h5 className="mb-0">Upload Log Files</h5>
// // // // // //       </div>

// // // // // //       <div className="card-body">
// // // // // //         <form onSubmit={uploadFile}>
// // // // // //           <div className="row g-3">

// // // // // //             {/* FILE INPUT */}
// // // // // //             <div className="col-md-12">
// // // // // //               <label className="form-label">Log Files</label>

// // // // // //               <input
// // // // // //                 ref={fileInputRef}
// // // // // //                 type="file"
// // // // // //                 multiple
// // // // // //                 className="form-control"
// // // // // //                 accept={acceptTypes}
// // // // // //                 disabled={!teamId || allowedFormats.length === 0}
// // // // // //                 onChange={handleFileChange}
// // // // // //               />

// // // // // //               {/* Selected files preview */}
// // // // // //               {files.length > 0 && (
// // // // // //                 <ul className="mt-2">
// // // // // //                   {files.map((file, index) => (
// // // // // //                     <li key={index}>{file.name}</li>
// // // // // //                   ))}
// // // // // //                 </ul>
// // // // // //               )}

// // // // // //               {/* Supported formats */}
// // // // // //               {teamId && (
// // // // // //                 <div className="form-text">
// // // // // //                   Supported formats:&nbsp;
// // // // // //                   {allowedFormats.length
// // // // // //                     ? allowedFormats.map(f => f.format_name).join(", ")
// // // // // //                     : "None"}
// // // // // //                 </div>
// // // // // //               )}
// // // // // //             </div>

// // // // // //             {/* TEAM */}
// // // // // //             <div className="col-md-4">
// // // // // //               <label className="form-label">Team</label>
// // // // // //               <select
// // // // // //                 className="form-select"
// // // // // //                 value={teamId}
// // // // // //                 onChange={(e) => setTeamId(e.target.value)}
// // // // // //               >
// // // // // //                 <option value="">Select team</option>
// // // // // //                 {teams.map(t => (
// // // // // //                   <option key={t.team_id} value={t.team_id}>
// // // // // //                     {t.team_name}
// // // // // //                   </option>
// // // // // //                 ))}
// // // // // //               </select>
// // // // // //             </div>

// // // // // //             {/* SOURCE */}
// // // // // //             <div className="col-md-4">
// // // // // //               <label className="form-label">Source</label>
// // // // // //               <select
// // // // // //                 className="form-select"
// // // // // //                 value={sourceId}
// // // // // //                 onChange={(e) => setSourceId(e.target.value)}
// // // // // //               >
// // // // // //                 <option value="">Select source</option>
// // // // // //                 {sources.map(s => (
// // // // // //                   <option key={s.source_id} value={s.source_id}>
// // // // // //                     {s.source_name}
// // // // // //                   </option>
// // // // // //                 ))}
// // // // // //               </select>
// // // // // //             </div>

// // // // // //           </div>

// // // // // //           <button
// // // // // //             className="btn btn-primary mt-3"
// // // // // //             disabled={loading}
// // // // // //           >
// // // // // //             {loading ? "Uploading..." : "Upload"}
// // // // // //           </button>
// // // // // //         </form>

// // // // // //         {message && (
// // // // // //           <div className="alert alert-info mt-3">
// // // // // //             {message}
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }
// // // // // import { useEffect, useState, useRef } from "react";
// // // // // import api from "../api/axios";

// // // // // export default function FileUpload({ onUploadSuccess }) {
// // // // //   const [files, setFiles] = useState([]);
// // // // //   const [duplicateNames, setDuplicateNames] = useState([]);
// // // // //   const [teams, setTeams] = useState([]);
// // // // //   const [sources, setSources] = useState([]);
// // // // //   const [teamId, setTeamId] = useState("");
// // // // //   const [sourceId, setSourceId] = useState("");
// // // // //   const [allowedFormats, setAllowedFormats] = useState([]);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [message, setMessage] = useState("");

// // // // //   const fileInputRef = useRef(null);

// // // // //   /* ---------- LOAD LOOKUPS ---------- */
// // // // //   useEffect(() => {
// // // // //     api.get("/lookups/my-teams").then(res => setTeams(res.data));
// // // // //     api.get("/lookups/log-sources").then(res => setSources(res.data));
// // // // //   }, []);

// // // // //   /* ---------- LOAD ALLOWED FORMATS ---------- */
// // // // //   useEffect(() => {
// // // // //     if (!teamId) {
// // // // //       setAllowedFormats([]);
// // // // //       return;
// // // // //     }

// // // // //     api
// // // // //       .get(`/lookups/teams/${teamId}/allowed-formats`)
// // // // //       .then(res => setAllowedFormats(res.data))
// // // // //       .catch(() => setAllowedFormats([]));
// // // // //   }, [teamId]);

// // // // //   const formatToExt = {
// // // // //     TEXT: ".txt",
// // // // //     JSON: ".json",
// // // // //     CSV: ".csv",
// // // // //     XML: ".xml"
// // // // //   };

// // // // //   const acceptTypes = allowedFormats
// // // // //     .map(f => formatToExt[f.format_name])
// // // // //     .filter(Boolean)
// // // // //     .join(",");

// // // // //   /* ---------- HANDLE FILE CHANGE ---------- */
// // // // //   const handleFileChange = (e) => {
// // // // //     const selectedFiles = Array.from(e.target.files);

// // // // //     // Combine with existing files
// // // // //     const updatedFiles = [...files, ...selectedFiles];

// // // // //     // Detect duplicates by name
// // // // //     const nameCount = {};
// // // // //     updatedFiles.forEach(file => {
// // // // //       nameCount[file.name] = (nameCount[file.name] || 0) + 1;
// // // // //     });

// // // // //     const duplicates = Object.keys(nameCount).filter(
// // // // //       name => nameCount[name] > 1
// // // // //     );

// // // // //     setFiles(updatedFiles);
// // // // //     setDuplicateNames(duplicates);
// // // // //   };

// // // // //   /* ---------- REMOVE FILE ---------- */
// // // // //   const removeFile = (index) => {
// // // // //     const updatedFiles = files.filter((_, i) => i !== index);

// // // // //     // Recheck duplicates
// // // // //     const nameCount = {};
// // // // //     updatedFiles.forEach(file => {
// // // // //       nameCount[file.name] = (nameCount[file.name] || 0) + 1;
// // // // //     });

// // // // //     const duplicates = Object.keys(nameCount).filter(
// // // // //       name => nameCount[name] > 1
// // // // //     );

// // // // //     setFiles(updatedFiles);
// // // // //     setDuplicateNames(duplicates);
// // // // //   };

// // // // //   /* ---------- UPLOAD ---------- */
// // // // //   const uploadFile = async (e) => {
// // // // //     e.preventDefault();

// // // // //     if (!files.length || !teamId || !sourceId) {
// // // // //       setMessage("Please select all fields");
// // // // //       return;
// // // // //     }

// // // // //     if (duplicateNames.length > 0) {
// // // // //       setMessage("Remove duplicate files before uploading.");
// // // // //       return;
// // // // //     }

// // // // //     setLoading(true);
// // // // //     setMessage("");

// // // // //     try {
// // // // //       const formData = new FormData();

// // // // //       files.forEach(file => {
// // // // //         formData.append("files", file);
// // // // //       });

// // // // //       formData.append("team_id", teamId);
// // // // //       formData.append("source_id", sourceId);

// // // // //       await api.post("/files/upload", formData, {
// // // // //         headers: { "Content-Type": "multipart/form-data" }
// // // // //       });

// // // // //       setMessage("Files uploaded successfully");
// // // // //       setFiles([]);
// // // // //       setDuplicateNames([]);
// // // // //       setTeamId("");
// // // // //       setSourceId("");

// // // // //       if (fileInputRef.current) {
// // // // //         fileInputRef.current.value = "";
// // // // //       }

// // // // //       onUploadSuccess && onUploadSuccess();

// // // // //     } catch (err) {
// // // // //       setMessage(err.response?.data?.detail || "Upload failed");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="card shadow-sm mb-4">
// // // // //       <div className="card-header">
// // // // //         <h5 className="mb-0">Upload Log Files</h5>
// // // // //       </div>

// // // // //       <div className="card-body">
// // // // //         <form onSubmit={uploadFile}>
// // // // //           <div className="row g-3">

// // // // //             {/* FILE INPUT */}
// // // // //             <div className="col-md-12">
// // // // //               <label className="form-label">Log Files</label>

// // // // //               <input
// // // // //                 ref={fileInputRef}
// // // // //                 type="file"
// // // // //                 multiple
// // // // //                 className="form-control"
// // // // //                 accept={acceptTypes}
// // // // //                 disabled={!teamId || allowedFormats.length === 0}
// // // // //                 onChange={handleFileChange}
// // // // //               />

// // // // //               {/* DUPLICATE WARNING */}
// // // // //               {duplicateNames.length > 0 && (
// // // // //                 <div className="alert alert-danger mt-2">
// // // // //                   Duplicate files detected: {duplicateNames.join(", ")}
// // // // //                 </div>
// // // // //               )}

// // // // //               {/* SELECTED FILE LIST */}
// // // // //               {files.length > 0 && (
// // // // //                 <ul className="list-group mt-3">
// // // // //                   {files.map((file, index) => (
// // // // //                     <li
// // // // //                       key={index}
// // // // //                       className="list-group-item d-flex justify-content-between align-items-center"
// // // // //                     >
// // // // //                       {file.name}
// // // // //                       <button
// // // // //                         type="button"
// // // // //                         className="btn btn-sm btn-danger"
// // // // //                         onClick={() => removeFile(index)}
// // // // //                       >
// // // // //                         Remove
// // // // //                       </button>
// // // // //                     </li>
// // // // //                   ))}
// // // // //                 </ul>
// // // // //               )}

// // // // //               {/* Supported formats */}
// // // // //               {teamId && (
// // // // //                 <div className="form-text mt-2">
// // // // //                   Supported formats:&nbsp;
// // // // //                   {allowedFormats.length
// // // // //                     ? allowedFormats.map(f => f.format_name).join(", ")
// // // // //                     : "None"}
// // // // //                 </div>
// // // // //               )}
// // // // //             </div>

// // // // //             {/* TEAM */}
// // // // //             <div className="col-md-4">
// // // // //               <label className="form-label">Team</label>
// // // // //               <select
// // // // //                 className="form-select"
// // // // //                 value={teamId}
// // // // //                 onChange={(e) => setTeamId(e.target.value)}
// // // // //               >
// // // // //                 <option value="">Select team</option>
// // // // //                 {teams.map(t => (
// // // // //                   <option key={t.team_id} value={t.team_id}>
// // // // //                     {t.team_name}
// // // // //                   </option>
// // // // //                 ))}
// // // // //               </select>
// // // // //             </div>

// // // // //             {/* SOURCE */}
// // // // //             <div className="col-md-4">
// // // // //               <label className="form-label">Source</label>
// // // // //               <select
// // // // //                 className="form-select"
// // // // //                 value={sourceId}
// // // // //                 onChange={(e) => setSourceId(e.target.value)}
// // // // //               >
// // // // //                 <option value="">Select source</option>
// // // // //                 {sources.map(s => (
// // // // //                   <option key={s.source_id} value={s.source_id}>
// // // // //                     {s.source_name}
// // // // //                   </option>
// // // // //                 ))}
// // // // //               </select>
// // // // //             </div>

// // // // //           </div>

// // // // //           <button
// // // // //             className="btn btn-primary mt-3"
// // // // //             disabled={loading}
// // // // //           >
// // // // //             {loading ? "Uploading..." : "Upload"}
// // // // //           </button>
// // // // //         </form>

// // // // //         {message && (
// // // // //           <div className="alert alert-info mt-3">
// // // // //             {message}
// // // // //           </div>
// // // // //         )}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // import { useEffect, useState, useRef } from "react";
// // // // import api from "../api/axios";

// // // // export default function FileUpload({ onUploadSuccess }) {
// // // //   const [files, setFiles] = useState([]);
// // // //   const [duplicateFiles, setDuplicateFiles] = useState([]);
// // // //   const [teams, setTeams] = useState([]);
// // // //   const [sources, setSources] = useState([]);
// // // //   const [teamId, setTeamId] = useState("");
// // // //   const [sourceId, setSourceId] = useState("");
// // // //   const [allowedFormats, setAllowedFormats] = useState([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [message, setMessage] = useState("");

// // // //   const fileInputRef = useRef(null);

// // // //   /* ---------------- LOAD LOOKUPS ---------------- */
// // // //   useEffect(() => {
// // // //     api.get("/lookups/my-teams").then(res => setTeams(res.data));
// // // //     api.get("/lookups/log-sources").then(res => setSources(res.data));
// // // //   }, []);

// // // //   /* ---------------- LOAD ALLOWED FORMATS ---------------- */
// // // //   useEffect(() => {
// // // //     if (!teamId) {
// // // //       setAllowedFormats([]);
// // // //       return;
// // // //     }

// // // //     api
// // // //       .get(`/lookups/teams/${teamId}/allowed-formats`)
// // // //       .then(res => setAllowedFormats(res.data))
// // // //       .catch(() => setAllowedFormats([]));
// // // //   }, [teamId]);

// // // //   /* ---------------- FILE TYPE SUPPORT ---------------- */
// // // //   const formatToAccept = {
// // // //     TEXT: ".txt,text/plain",
// // // //     JSON: ".json,application/json",
// // // //     CSV: ".csv,text/csv",
// // // //     XML: ".xml,application/xml,text/xml"
// // // //   };

// // // //   const acceptTypes = allowedFormats
// // // //     .map(f => formatToAccept[f.format_name?.toUpperCase()])
// // // //     .filter(Boolean)
// // // //     .join(",");

// // // //   /* ---------------- HANDLE FILE SELECTION ---------------- */
// // // //   const handleFileChange = (e) => {
// // // //     const selectedFiles = Array.from(e.target.files);
// // // //     setFiles(selectedFiles);
// // // //     setDuplicateFiles([]);
// // // //     setMessage("");
// // // //   };

// // // //   /* ---------------- REMOVE FILE ---------------- */
// // // //   const removeFile = (fileName) => {
// // // //     setFiles(prev => prev.filter(file => file.name !== fileName));
// // // //     setDuplicateFiles(prev => prev.filter(name => name !== fileName));
// // // //   };

// // // //   /* ---------------- UPLOAD ---------------- */
// // // //   const uploadFile = async (e) => {
// // // //     e.preventDefault();

// // // //     if (!files.length || !teamId || !sourceId) {
// // // //       setMessage("Please select all fields");
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     setMessage("");

// // // //     try {
// // // //       const formData = new FormData();

// // // //       files.forEach(file => {
// // // //         formData.append("files", file);
// // // //       });

// // // //       formData.append("team_id", teamId);
// // // //       formData.append("source_id", sourceId);

// // // //       const response = await api.post("/files/upload", formData);

// // // //       const {
// // // //         uploaded_files = [],
// // // //         duplicate_files = []
// // // //       } = response.data;

// // // //       if (duplicate_files.length > 0) {
// // // //         setDuplicateFiles(duplicate_files);
// // // //       }

// // // //       if (uploaded_files.length > 0) {
// // // //         setMessage(
// // // //           `${uploaded_files.length} file(s) uploaded successfully`
// // // //         );

// // // //         // Remove successfully uploaded files from UI
// // // //         const uploadedNames = uploaded_files.map(f => f.file_name);
// // // //         setFiles(prev =>
// // // //           prev.filter(file => !uploadedNames.includes(file.name))
// // // //         );

// // // //         onUploadSuccess && onUploadSuccess();
// // // //       }

// // // //       if (duplicate_files.length > 0) {
// // // //         setMessage(prev =>
// // // //           prev
// // // //             ? prev + ` | Duplicates: ${duplicate_files.join(", ")}`
// // // //             : `Duplicates: ${duplicate_files.join(", ")}`
// // // //         );
// // // //       }

// // // //       // Reset file input
// // // //       if (fileInputRef.current) {
// // // //         fileInputRef.current.value = "";
// // // //       }

// // // //     } catch (err) {
// // // //       setMessage(err.response?.data?.detail || "Upload failed");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="card shadow-sm mb-4">
// // // //       <div className="card-header">
// // // //         <h5 className="mb-0">Upload Log Files</h5>
// // // //       </div>

// // // //       <div className="card-body">
// // // //         <form onSubmit={uploadFile}>
// // // //           <div className="row g-3">

// // // //             {/* FILE INPUT */}
// // // //             <div className="col-md-12">
// // // //               <label className="form-label">Log Files</label>

// // // //               <input
// // // //                 ref={fileInputRef}
// // // //                 type="file"
// // // //                 multiple
// // // //                 className="form-control"
// // // //                 accept={acceptTypes}
// // // //                 disabled={!teamId || allowedFormats.length === 0}
// // // //                 onChange={handleFileChange}
// // // //               />

// // // //               {/* SELECTED FILE LIST */}
// // // //               {files.length > 0 && (
// // // //                 <ul className="list-group mt-3">
// // // //                   {files.map((file, index) => {
// // // //                     const isDuplicate = duplicateFiles.includes(file.name);

// // // //                     return (
// // // //                       <li
// // // //                         key={index}
// // // //                         className={`list-group-item d-flex justify-content-between align-items-center 
// // // //                           ${isDuplicate ? "list-group-item-danger" : ""}`}
// // // //                       >
// // // //                         <span>
// // // //                           {file.name}
// // // //                           {isDuplicate && (
// // // //                             <strong className="text-danger ms-2">
// // // //                               (Already uploaded)
// // // //                             </strong>
// // // //                           )}
// // // //                         </span>

// // // //                         <button
// // // //                           type="button"
// // // //                           className="btn btn-sm btn-outline-danger"
// // // //                           onClick={() => removeFile(file.name)}
// // // //                         >
// // // //                           Remove
// // // //                         </button>
// // // //                       </li>
// // // //                     );
// // // //                   })}
// // // //                 </ul>
// // // //               )}

// // // //               {/* Supported formats */}
// // // //               {teamId && (
// // // //                 <div className="form-text mt-2">
// // // //                   Supported formats:&nbsp;
// // // //                   {allowedFormats.length
// // // //                     ? allowedFormats.map(f => f.format_name).join(", ")
// // // //                     : "None"}
// // // //                 </div>
// // // //               )}
// // // //             </div>

// // // //             {/* TEAM */}
// // // //             <div className="col-md-4">
// // // //               <label className="form-label">Team</label>
// // // //               <select
// // // //                 className="form-select"
// // // //                 value={teamId}
// // // //                 onChange={(e) => setTeamId(e.target.value)}
// // // //               >
// // // //                 <option value="">Select team</option>
// // // //                 {teams.map(t => (
// // // //                   <option key={t.team_id} value={t.team_id}>
// // // //                     {t.team_name}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>

// // // //             {/* SOURCE */}
// // // //             <div className="col-md-4">
// // // //               <label className="form-label">Source</label>
// // // //               <select
// // // //                 className="form-select"
// // // //                 value={sourceId}
// // // //                 onChange={(e) => setSourceId(e.target.value)}
// // // //               >
// // // //                 <option value="">Select source</option>
// // // //                 {sources.map(s => (
// // // //                   <option key={s.source_id} value={s.source_id}>
// // // //                     {s.source_name}
// // // //                   </option>
// // // //                 ))}
// // // //               </select>
// // // //             </div>

// // // //           </div>

// // // //           <button
// // // //             className="btn btn-primary mt-3"
// // // //             disabled={loading}
// // // //           >
// // // //             {loading ? "Uploading..." : "Upload"}
// // // //           </button>
// // // //         </form>

// // // //         {message && (
// // // //           <div className="alert alert-info mt-3">
// // // //             {message}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // import { useEffect, useState, useRef } from "react";
// // // import api from "../api/axios";

// // // export default function FileUpload({ onUploadSuccess }) {
// // //   const [files, setFiles] = useState([]);
// // //   const [duplicateFiles, setDuplicateFiles] = useState([]);
// // //   const [teams, setTeams] = useState([]);
// // //   const [sources, setSources] = useState([]);
// // //   const [teamId, setTeamId] = useState("");
// // //   const [sourceId, setSourceId] = useState("");
// // //   const [allowedFormats, setAllowedFormats] = useState([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [message, setMessage] = useState("");

// // //   const fileInputRef = useRef(null);

// // //   /* ---------------- LOAD LOOKUPS ---------------- */
// // //   useEffect(() => {
// // //     api.get("/lookups/my-teams").then(res => setTeams(res.data));
// // //     api.get("/lookups/log-sources").then(res => setSources(res.data));
// // //   }, []);

// // //   /* ---------------- LOAD ALLOWED FORMATS ---------------- */
// // //   useEffect(() => {
// // //     if (!teamId) {
// // //       setAllowedFormats([]);
// // //       return;
// // //     }

// // //     api
// // //       .get(`/lookups/teams/${teamId}/allowed-formats`)
// // //       .then(res => setAllowedFormats(res.data))
// // //       .catch(() => setAllowedFormats([]));
// // //   }, [teamId]);

// // //   /* ---------------- MULTIPLE FILE TYPE SUPPORT ---------------- */
// // //   const formatToAccept = {
// // //     TEXT: ".txt,text/plain",
// // //     JSON: ".json,application/json",
// // //     CSV: ".csv,text/csv",
// // //     XML: ".xml,application/xml,text/xml"
// // //   };

// // //   const acceptTypes = allowedFormats
// // //     .map(f => formatToAccept[f.format_name?.toUpperCase()])
// // //     .filter(Boolean)
// // //     .join(",");

// // //   /* ---------------- HANDLE FILE SELECTION ---------------- */
// // //   const handleFileChange = (e) => {
// // //     const selectedFiles = Array.from(e.target.files);
// // //     setFiles(selectedFiles);
// // //     setDuplicateFiles([]);
// // //     setMessage("");
// // //   };

// // //   /* ---------------- REMOVE FILE ---------------- */
// // //   const removeFile = (fileName) => {
// // //     setFiles(prev => prev.filter(file => file.name !== fileName));
// // //     setDuplicateFiles(prev => prev.filter(name => name !== fileName));
// // //   };

// // //   /* ---------------- UPLOAD ---------------- */
// // //   const uploadFile = async (e) => {
// // //     e.preventDefault();

// // //     if (!files.length || !teamId || !sourceId) {
// // //       setMessage("Please select all fields");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     setMessage("");

// // //     try {
// // //       const formData = new FormData();

// // //       files.forEach(file => {
// // //         formData.append("files", file);
// // //       });

// // //       formData.append("team_id", teamId);
// // //       formData.append("source_id", sourceId);

// // //       const response = await api.post("/files/upload", formData);

// // //       const {
// // //         uploaded_files = [],
// // //         duplicate_files = []
// // //       } = response.data;

// // //       // Handle duplicates
// // //       if (duplicate_files.length > 0) {
// // //         setDuplicateFiles(duplicate_files);
// // //       }

// // //       // Handle successful uploads
// // //       if (uploaded_files.length > 0) {
// // //         const uploadedNames = uploaded_files.map(f => f.file_name);

// // //         setFiles(prev =>
// // //           prev.filter(file => !uploadedNames.includes(file.name))
// // //         );

// // //         onUploadSuccess && onUploadSuccess();
// // //       }

// // //       // Message handling
// // //       if (uploaded_files.length > 0 && duplicate_files.length > 0) {
// // //         setMessage(
// // //           `${uploaded_files.length} uploaded | Duplicates: ${duplicate_files.join(", ")}`
// // //         );
// // //       } else if (uploaded_files.length > 0) {
// // //         setMessage(`${uploaded_files.length} file(s) uploaded successfully`);
// // //       } else if (duplicate_files.length > 0) {
// // //         setMessage(`Duplicates: ${duplicate_files.join(", ")}`);
// // //       }

// // //       if (fileInputRef.current) {
// // //         fileInputRef.current.value = "";
// // //       }

// // //     } catch (err) {
// // //       const detail = err.response?.data?.detail;

// // //       if (Array.isArray(detail)) {
// // //         const errorMsg = detail.map(d => d.msg).join(", ");
// // //         setMessage(errorMsg);
// // //       } else if (typeof detail === "string") {
// // //         setMessage(detail);
// // //       } else {
// // //         setMessage("Upload failed");
// // //       }
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="card shadow-sm mb-4">
// // //       <div className="card-header">
// // //         <h5 className="mb-0">Upload Log Files</h5>
// // //       </div>

// // //       <div className="card-body">
// // //         <form onSubmit={uploadFile}>
// // //           <div className="row g-3">

// // //             {/* FILE INPUT */}
// // //             <div className="col-md-12">
// // //               <label className="form-label">Log Files</label>

// // //               <input
// // //                 ref={fileInputRef}
// // //                 type="file"
// // //                 multiple
// // //                 className="form-control"
// // //                 accept={acceptTypes}
// // //                 disabled={!teamId || allowedFormats.length === 0}
// // //                 onChange={handleFileChange}
// // //               />

// // //               {/* SELECTED FILE LIST */}
// // //               {files.length > 0 && (
// // //                 <ul className="list-group mt-3">
// // //                   {files.map((file, index) => {
// // //                     const isDuplicate = duplicateFiles.includes(file.name);

// // //                     return (
// // //                       <li
// // //                         key={index}
// // //                         className={`list-group-item d-flex justify-content-between align-items-center 
// // //                           ${isDuplicate ? "list-group-item-danger" : ""}`}
// // //                       >
// // //                         <span>
// // //                           {file.name}
// // //                           {isDuplicate && (
// // //                             <strong className="text-danger ms-2">
// // //                               (Already uploaded)
// // //                             </strong>
// // //                           )}
// // //                         </span>

// // //                         <button
// // //                           type="button"
// // //                           className="btn btn-sm btn-outline-danger"
// // //                           onClick={() => removeFile(file.name)}
// // //                         >
// // //                           Remove
// // //                         </button>
// // //                       </li>
// // //                     );
// // //                   })}
// // //                 </ul>
// // //               )}

// // //               {/* Supported formats */}
// // //               {teamId && (
// // //                 <div className="form-text mt-2">
// // //                   Supported formats:&nbsp;
// // //                   {allowedFormats.length
// // //                     ? allowedFormats.map(f => f.format_name).join(", ")
// // //                     : "None"}
// // //                 </div>
// // //               )}
// // //             </div>

// // //             {/* TEAM */}
// // //             <div className="col-md-4">
// // //               <label className="form-label">Team</label>
// // //               <select
// // //                 className="form-select"
// // //                 value={teamId}
// // //                 onChange={(e) => setTeamId(e.target.value)}
// // //               >
// // //                 <option value="">Select team</option>
// // //                 {teams.map(t => (
// // //                   <option key={t.team_id} value={t.team_id}>
// // //                     {t.team_name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             {/* SOURCE */}
// // //             <div className="col-md-4">
// // //               <label className="form-label">Source</label>
// // //               <select
// // //                 className="form-select"
// // //                 value={sourceId}
// // //                 onChange={(e) => setSourceId(e.target.value)}
// // //               >
// // //                 <option value="">Select source</option>
// // //                 {sources.map(s => (
// // //                   <option key={s.source_id} value={s.source_id}>
// // //                     {s.source_name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //           </div>

// // //           <button
// // //             className="btn btn-primary mt-3"
// // //             disabled={loading}
// // //           >
// // //             {loading ? "Uploading..." : "Upload"}
// // //           </button>
// // //         </form>

// // //         {message && typeof message === "string" && (
// // //           <div className="alert alert-info mt-3">
// // //             {message}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useState, useRef } from "react";
// // import api from "../api/axios";

// // export default function FileUpload({ onUploadSuccess }) {
// //   const [files, setFiles] = useState([]);
// //   const [duplicateFiles, setDuplicateFiles] = useState([]);
// //   const [teams, setTeams] = useState([]);
// //   const [sources, setSources] = useState([]);
// //   const [teamId, setTeamId] = useState("");
// //   const [sourceId, setSourceId] = useState("");
// //   const [allowedFormats, setAllowedFormats] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState("");

// //   const fileInputRef = useRef(null);

// //   /* LOAD LOOKUPS */
// //   useEffect(() => {
// //     api.get("/lookups/my-teams").then(res => setTeams(res.data));
// //     api.get("/lookups/log-sources").then(res => setSources(res.data));
// //   }, []);

// //   /* LOAD ALLOWED FORMATS */
// //   useEffect(() => {
// //     if (!teamId) {
// //       setAllowedFormats([]);
// //       return;
// //     }

// //     api
// //       .get(`/lookups/teams/${teamId}/allowed-formats`)
// //       .then(res => setAllowedFormats(res.data))
// //       .catch(() => setAllowedFormats([]));
// //   }, [teamId]);

// //   const handleFileChange = (e) => {
// //     const selected = Array.from(e.target.files);
// //     setFiles(selected);
// //     setDuplicateFiles([]);
// //     setMessage("");
// //   };

// //   const removeFile = (name) => {
// //     setFiles(prev => prev.filter(f => f.name !== name));
// //     setDuplicateFiles(prev => prev.filter(n => n !== name));
// //   };

// //   const uploadFile = async (e) => {
// //     e.preventDefault();

// //     if (!files.length || !teamId || !sourceId) {
// //       setMessage("Please select all fields");
// //       return;
// //     }

// //     setLoading(true);
// //     setMessage("");

// //     try {
// //       const formData = new FormData();

// //       files.forEach(file => {
// //         formData.append("files", file);
// //       });

// //       formData.append("team_id", teamId);
// //       formData.append("source_id", sourceId);

// //       const res = await api.post("/files/upload", formData, {
// //         headers: {
// //           "Content-Type": "multipart/form-data"
// //         }
// //       });

// //       const { uploaded_files, duplicate_files } = res.data;

// //       if (duplicate_files.length > 0) {
// //         setDuplicateFiles(duplicate_files);
// //       }

// //       if (uploaded_files.length > 0) {
// //         const uploadedNames = uploaded_files.map(f => f.file_name);

// //         setFiles(prev =>
// //           prev.filter(file => !uploadedNames.includes(file.name))
// //         );

// //         onUploadSuccess && onUploadSuccess();
// //       }

// //       setMessage(
// //         `Uploaded: ${uploaded_files.length} | Duplicates: ${duplicate_files.length}`
// //       );

// //       if (fileInputRef.current) {
// //         fileInputRef.current.value = "";
// //       }

// //     } catch (err) {
// //       setMessage(err.response?.data?.detail || "Upload failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="card shadow-sm mb-4">
// //       <div className="card-header">
// //         <h5>Upload Log Files</h5>
// //       </div>

// //       <div className="card-body">
// //         <form onSubmit={uploadFile}>

// //           <input
// //             ref={fileInputRef}
// //             type="file"
// //             multiple
// //             className="form-control"
// //             disabled={!teamId}
// //             onChange={handleFileChange}
// //           />

// //           {files.length > 0 && (
// //             <ul className="list-group mt-3">
// //               {files.map((file, index) => {
// //                 const isDuplicate = duplicateFiles.includes(file.name);

// //                 return (
// //                   <li
// //                     key={index}
// //                     className={`list-group-item d-flex justify-content-between align-items-center
// //                     ${isDuplicate ? "list-group-item-danger" : ""}`}
// //                   >
// //                     <span>
// //                       {file.name}
// //                       {isDuplicate && (
// //                         <strong className="text-danger ms-2">
// //                           (Already uploaded)
// //                         </strong>
// //                       )}
// //                     </span>

// //                     <button
// //                       type="button"
// //                       className="btn btn-sm btn-outline-danger"
// //                       onClick={() => removeFile(file.name)}
// //                     >
// //                       Remove
// //                     </button>
// //                   </li>
// //                 );
// //               })}
// //             </ul>
// //           )}

// //           <div className="row mt-3">
// //             <div className="col-md-4">
// //               <select
// //                 className="form-select"
// //                 value={teamId}
// //                 onChange={(e) => setTeamId(e.target.value)}
// //               >
// //                 <option value="">Select team</option>
// //                 {teams.map(t => (
// //                   <option key={t.team_id} value={t.team_id}>
// //                     {t.team_name}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             <div className="col-md-4">
// //               <select
// //                 className="form-select"
// //                 value={sourceId}
// //                 onChange={(e) => setSourceId(e.target.value)}
// //               >
// //                 <option value="">Select source</option>
// //                 {sources.map(s => (
// //                   <option key={s.source_id} value={s.source_id}>
// //                     {s.source_name}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           </div>

// //           <button
// //             className="btn btn-primary mt-3"
// //             disabled={loading}
// //           >
// //             {loading ? "Uploading..." : "Upload"}
// //           </button>
// //         </form>

// //         {message && (
// //           <div className="alert alert-info mt-3">
// //             {message}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
// import { useEffect, useState, useRef } from "react";
// import api from "../api/axios";

// export default function FileUpload({ onUploadSuccess }) {
//   const [files, setFiles] = useState([]);
//   const [duplicateFiles, setDuplicateFiles] = useState([]);
//   const [teams, setTeams] = useState([]);
//   const [sources, setSources] = useState([]);
//   const [teamId, setTeamId] = useState("");
//   const [sourceId, setSourceId] = useState("");
//   const [allowedFormats, setAllowedFormats] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const fileInputRef = useRef(null);

//   /* LOAD LOOKUPS */
//   useEffect(() => {
//     api.get("/lookups/my-teams").then(res => setTeams(res.data));
//     api.get("/lookups/log-sources").then(res => setSources(res.data));
//   }, []);

//   /* LOAD ALLOWED FORMATS */
//   useEffect(() => {
//     if (!teamId) {
//       setAllowedFormats([]);
//       return;
//     }

//     api
//       .get(`/lookups/teams/${teamId}/allowed-formats`)
//       .then(res => setAllowedFormats(res.data))
//       .catch(() => setAllowedFormats([]));
//   }, [teamId]);

//   /* APPEND FILES INSTEAD OF REPLACING */
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);

//     if (!teamId) {
//       setMessage(
//         "Please select your team first so supported file extensions can be displayed."
//       );
//       return;
//     }

//     setMessage("");

//     setFiles(prevFiles => {
//       const existingNames = prevFiles.map(f => f.name);

//       const newUniqueFiles = selectedFiles.filter(
//         file => !existingNames.includes(file.name)
//       );

//       return [...prevFiles, ...newUniqueFiles];
//     });

//     // reset input so same file can be selected again if removed
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   /* REMOVE FILE */
//   const removeFile = (name) => {
//     setFiles(prev => prev.filter(f => f.name !== name));
//     setDuplicateFiles(prev => prev.filter(n => n !== name));
//   };

//   /* UPLOAD */
//   const uploadFile = async (e) => {
//     e.preventDefault();

//     if (!files.length || !teamId || !sourceId) {
//       setMessage("Please select all fields");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const formData = new FormData();

//       files.forEach(file => {
//         formData.append("files", file);
//       });

//       formData.append("team_id", teamId);
//       formData.append("source_id", sourceId);

//       const res = await api.post("/files/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       const { uploaded_files = [], duplicate_files = [] } = res.data;

//       if (duplicate_files.length > 0) {
//         setDuplicateFiles(duplicate_files);
//       }

//       if (uploaded_files.length > 0) {
//         const uploadedNames = uploaded_files.map(f => f.file_name);

//         setFiles(prev =>
//           prev.filter(file => !uploadedNames.includes(file.name))
//         );

//         onUploadSuccess && onUploadSuccess();
//       }

//       setMessage(
//         `Uploaded: ${uploaded_files.length} | Duplicates: ${duplicate_files.length}`
//       );

//     } catch (err) {
//       setMessage(err.response?.data?.detail || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* FILE TYPE MAPPING */
// const formatToAccept = {
//   TEXT: ".txt,text/plain",
//   JSON: ".json,application/json",
//   CSV: ".csv,text/csv",
//   XML: ".xml,application/xml,text/xml"
// };

// const acceptTypes = allowedFormats
//   .map(f => formatToAccept[f.format_name?.toUpperCase()])
//   .filter(Boolean)
//   .join(",");

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-header">
//         <h5>Upload Log Files</h5>
//       </div>

//       <div className="card-body">
//         <form onSubmit={uploadFile}>
// {!teamId && (
//   <div className="alert alert-warning mb-2">
//     Please select a team first to see supported file formats.
//   </div>
// )}
// {/* TEAM + SOURCE */}
//           <div className="row mt-3">
//             <div className="col-md-4">
//               <select
//                 className="form-select"
//                 value={teamId}
//                 onChange={(e) => {
//                   setTeamId(e.target.value);
//                   setFiles([]);
//                   setDuplicateFiles([]);
//                 }}
//               >
//                 <option value="">Select team</option>
//                 {teams.map(t => (
//                   <option key={t.team_id} value={t.team_id}>
//                     {t.team_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-4">
//               <select
//                 className="form-select"
//                 value={sourceId}
//                 onChange={(e) => setSourceId(e.target.value)}
//               >
//                 <option value="">Select source</option>
//                 {sources.map(s => (
//                   <option key={s.source_id} value={s.source_id}>
//                     {s.source_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* FILE INPUT */}
//           <input
//   ref={fileInputRef}
//   type="file"
//   multiple
//   className="form-control"
//   accept={acceptTypes}
//   disabled={!teamId || allowedFormats.length === 0}
//   onChange={handleFileChange}
// />


//           {/* SELECTED FILE LIST */}
//           {files.length > 0 && (
//             <ul className="list-group mt-3">
//               {files.map((file, index) => {
//                 const isDuplicate = duplicateFiles.includes(file.name);

//                 return (
//                   <li
//                     key={index}
//                     className={`list-group-item d-flex justify-content-between align-items-center
//                     ${isDuplicate ? "list-group-item-danger" : ""}`}
//                   >
//                     <span>
//                       {file.name}
//                       {isDuplicate && (
//                         <strong className="text-danger ms-2">
//                           (Already uploaded)
//                         </strong>
//                       )}
//                     </span>

//                     <button
//                       type="button"
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() => removeFile(file.name)}
//                     >
//                       Remove
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//           {/* Show supported formats */}
//         {teamId && allowedFormats.length > 0 && (
//           <div className="mt-2 text-muted">
//             Supported formats:{" "}
//             {allowedFormats.map(f => f.format_name).join(", ")}
//           </div>
//         )}
          

//           <button
//             className="btn btn-primary mt-3"
//             disabled={loading}
//           >
//             {loading ? "Uploading..." : "Upload"}
//           </button>
//         </form>

//         {message && (
//           <div className="alert alert-info mt-3">
//             {message}
//           </div>
//         )}

        
//       </div>
//     </div>
//   );
// }
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function FileUpload({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [duplicateFiles, setDuplicateFiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [sources, setSources] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [allowedFormats, setAllowedFormats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  /* LOAD LOOKUPS */
  useEffect(() => {
    api.get("/lookups/my-teams").then(res => setTeams(res.data));
    api.get("/lookups/log-sources").then(res => setSources(res.data));
  }, []);

  /* LOAD ALLOWED FORMATS */
  useEffect(() => {
    if (!teamId) {
      setAllowedFormats([]);
      return;
    }

    api
      .get(`/lookups/teams/${teamId}/allowed-formats`)
      .then(res => setAllowedFormats(res.data))
      .catch(() => setAllowedFormats([]));
  }, [teamId]);

  /* APPEND FILES INSTEAD OF REPLACING */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (!teamId) {
      setMessage(
        "Please select your team first so supported file extensions can be displayed."
      );
      return;
    }

    setMessage("");

    setFiles(prevFiles => {
      const existingNames = prevFiles.map(f => f.name);

      const newUniqueFiles = selectedFiles.filter(
        file => !existingNames.includes(file.name)
      );

      return [...prevFiles, ...newUniqueFiles];
    });

    // reset input so same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* REMOVE FILE */
  const removeFile = (name) => {
    setFiles(prev => prev.filter(f => f.name !== name));
    setDuplicateFiles(prev => prev.filter(n => n !== name));
  };

  /* UPLOAD */
  const uploadFile = async (e) => {
    e.preventDefault();

    if (!files.length || !teamId || !sourceId) {
      setMessage("Please select all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      files.forEach(file => {
        formData.append("files", file);
      });

      formData.append("team_id", teamId);
      formData.append("source_id", sourceId);

      const res = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const { uploaded_files = [], duplicate_files = [] } = res.data;

      if (duplicate_files.length > 0) {
        setDuplicateFiles(duplicate_files);
      }

      if (uploaded_files.length > 0) {
        const uploadedNames = uploaded_files.map(f => f.file_name);

        setFiles(prev =>
          prev.filter(file => !uploadedNames.includes(file.name))
        );

        onUploadSuccess && onUploadSuccess();
      }

      setMessage(
        `Uploaded: ${uploaded_files.length} | Duplicates: ${duplicate_files.length}`
      );

    } catch (err) {
      setMessage(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* FILE TYPE MAPPING */
const formatToAccept = {
  TEXT: ".txt,text/plain",
  JSON: ".json,application/json",
  CSV: ".csv,text/csv",
  XML: ".xml,application/xml,text/xml"
};

const acceptTypes = allowedFormats
  .map(f => formatToAccept[f.format_name?.toUpperCase()])
  .filter(Boolean)
  .join(",");

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header">
        <h5>Upload Log Files</h5>
      </div>

      <div className="card-body">
       <form onSubmit={uploadFile}>

  {/* TEAM WARNING */}
  {!teamId && (
    <div className="alert alert-warning mb-3">
      Please select a team first to see supported file formats.
    </div>
  )}

  {/* TEAM + SOURCE SECTION */}
  <div className="row mb-4">
    <div className="col-md-4">
      <label className="form-label fw-semibold">
        Select Team
      </label>
      <select
        className="form-select"
        value={teamId}
        onChange={(e) => {
          setTeamId(e.target.value);
          setFiles([]);
          setDuplicateFiles([]);
        }}
      >
        <option value="">Select team</option>
        {teams.map(t => (
          <option key={t.team_id} value={t.team_id}>
            {t.team_name}
          </option>
        ))}
      </select>
    </div>

    <div className="col-md-4">
      <label className="form-label fw-semibold">
        Select Source
      </label>
      <select
        className="form-select"
        value={sourceId}
        onChange={(e) => setSourceId(e.target.value)}
      >
        <option value="">Select source</option>
        {sources.map(s => (
          <option key={s.source_id} value={s.source_id}>
            {s.source_name}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* FILE INPUT SECTION */}
  <div className="mb-4">
    <label className="form-label fw-semibold">
      Upload Log Files
    </label>

    <input
      ref={fileInputRef}
      type="file"
      multiple
      className="form-control"
      accept={acceptTypes}
      disabled={!teamId || allowedFormats.length === 0}
      onChange={handleFileChange}
    />

    {/* Supported formats */}
    {teamId && allowedFormats.length > 0 && (
      <div className="form-text mt-2">
        Supported formats:{" "}
        {allowedFormats.map(f => f.format_name).join(", ")}
      </div>
    )}
  </div>

  {/* SELECTED FILE LIST */}
  {files.length > 0 && (
    <div className="mb-4">
      <ul className="list-group">
        {files.map((file, index) => {
          const isDuplicate = duplicateFiles.includes(file.name);

          return (
            <li
              key={index}
              className={`list-group-item d-flex justify-content-between align-items-center
              ${isDuplicate ? "list-group-item-danger" : ""}`}
            >
              <span>
                {file.name}
                {isDuplicate && (
                  <strong className="text-danger ms-2">
                    (Already uploaded)
                  </strong>
                )}
              </span>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeFile(file.name)}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  )}

  {/* UPLOAD BUTTON */}
  <div className="mt-3">
    <button
      className="btn btn-primary"
      disabled={loading}
    >
      {loading ? "Uploading..." : "Upload"}
    </button>
  </div>

</form>


        {message && (
          <div className="alert alert-info mt-3">
            {message}
          </div>
        )}

        
      </div>
    </div>
  );
}