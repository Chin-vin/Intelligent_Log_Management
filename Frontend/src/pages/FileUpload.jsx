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
// // // //   const { uploaded_files = [], duplicate_files = [] } = res.data;


// // // //   const fileInputRef = useRef(null);

// // // //   /* LOAD LOOKUPS */
// // // //   useEffect(() => {
// // // //     api.get("/lookups/my-teams").then(res => setTeams(res.data));
// // // //     api.get("/lookups/log-sources").then(res => setSources(res.data));
// // // //   }, []);

// // // //   /* LOAD ALLOWED FORMATS */
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

// // // //   /* APPEND FILES INSTEAD OF REPLACING */
// // // //   const handleFileChange = (e) => {
// // // //     const selectedFiles = Array.from(e.target.files);

// // // //     if (!teamId) {
// // // //       setMessage(
// // // //         "Please select your team first so supported file extensions can be displayed."
// // // //       );
// // // //       return;
// // // //     }

// // // //     setMessage("");

// // // //     setFiles(prevFiles => {
// // // //       const existingNames = prevFiles.map(f => f.name);

// // // //       const newUniqueFiles = selectedFiles.filter(
// // // //         file => !existingNames.includes(file.name)
// // // //       );

// // // //       return [...prevFiles, ...newUniqueFiles];
// // // //     });

// // // //     // reset input so same file can be selected again if removed
// // // //     if (fileInputRef.current) {
// // // //       fileInputRef.current.value = "";
// // // //     }
// // // //   };

// // // //   /* REMOVE FILE */
// // // //   const removeFile = (name) => {
// // // //     setFiles(prev => prev.filter(f => f.name !== name));
// // // //     setDuplicateFiles(prev => prev.filter(n => n !== name));
// // // //   };

// // // //   /* UPLOAD */
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

// // // //       const res = await api.post("/files/upload", formData, {
// // // //         headers: { "Content-Type": "multipart/form-data" }
// // // //       });

// // // //       const { uploaded_files = [], duplicate_files = [] } = res.data;

// // // //       if (duplicate_files.length > 0) {
// // // //         setDuplicateFiles(duplicate_files);
// // // //       }

// // // //       if (uploaded_files.length > 0) {
// // // //         const uploadedNames = uploaded_files.map(f => f.file_name);

// // // //         setFiles(prev =>
// // // //           prev.filter(file => !uploadedNames.includes(file.name))
// // // //         );

// // // //         onUploadSuccess && onUploadSuccess();
// // // //       }

// // // //       setMessage(
// // // //         `Uploaded: ${uploaded_files.length} | Duplicates: ${duplicate_files.length}`
// // // //       );

// // // //     } catch (err) {
// // // //       setMessage(err.response?.data?.detail || "Upload failed");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   /* FILE TYPE MAPPING */
// // // // const formatToAccept = {
// // // //   TEXT: ".txt,text/plain",
// // // //   JSON: ".json,application/json",
// // // //   CSV: ".csv,text/csv",
// // // //   XML: ".xml,application/xml,text/xml"
// // // // };

// // // // const acceptTypes = allowedFormats
// // // //   .map(f => formatToAccept[f.format_name?.toUpperCase()])
// // // //   .filter(Boolean)
// // // //   .join(",");

// // // //   return (
// // // //     <div className="card shadow-sm mb-4">
// // // //       <div className="card-header">
// // // //         <h5>Upload Log Files</h5>
// // // //       </div>

// // // //       <div className="card-body">
// // // //        <form onSubmit={uploadFile}>

// // // //   {/* TEAM WARNING */}
// // // //   {!teamId && (
// // // //     <div className="alert alert-warning mb-3">
// // // //       Please select a team first to see supported file formats.
// // // //     </div>
// // // //   )}

// // // //   {/* TEAM + SOURCE SECTION */}
// // // //   <div className="row mb-4">
// // // //     <div className="col-md-4">
// // // //       <label className="form-label fw-semibold">
// // // //         Select Team
// // // //       </label>
// // // //       <select
// // // //         className="form-select"
// // // //         value={teamId}
// // // //         onChange={(e) => {
// // // //           setTeamId(e.target.value);
// // // //           setFiles([]);
// // // //           setDuplicateFiles([]);
// // // //         }}
// // // //       >
// // // //         <option value="">Select team</option>
// // // //         {teams.map(t => (
// // // //           <option key={t.team_id} value={t.team_id}>
// // // //             {t.team_name}
// // // //           </option>
// // // //         ))}
// // // //       </select>
// // // //     </div>

// // // //     <div className="col-md-4">
// // // //       <label className="form-label fw-semibold">
// // // //         Select Source
// // // //       </label>
// // // //       <select
// // // //         className="form-select"
// // // //         value={sourceId}
// // // //         onChange={(e) => setSourceId(e.target.value)}
// // // //       >
// // // //         <option value="">Select source</option>
// // // //         {sources.map(s => (
// // // //           <option key={s.source_id} value={s.source_id}>
// // // //             {s.source_name}
// // // //           </option>
// // // //         ))}
// // // //       </select>
// // // //     </div>
// // // //   </div>

// // // //   {/* FILE INPUT SECTION */}
// // // //   <div className="mb-4">
// // // //     <label className="form-label fw-semibold">
// // // //       Upload Log Files
// // // //     </label>

// // // //     <input
// // // //       ref={fileInputRef}
// // // //       type="file"
// // // //       multiple
// // // //       className="form-control"
// // // //       accept={acceptTypes}
// // // //       disabled={!teamId || allowedFormats.length === 0}
// // // //       onChange={handleFileChange}
// // // //     />

// // // //     {/* Supported formats */}
// // // //     {teamId && allowedFormats.length > 0 && (
// // // //       <div className="form-text mt-2">
// // // //         Supported formats:{" "}
// // // //         {allowedFormats.map(f => f.format_name).join(", ")}
// // // //       </div>
// // // //     )}
// // // //   </div>

// // // //   {/* SELECTED FILE LIST */}
// // // //   {files.length > 0 && (
// // // //     <div className="mb-4">
// // // //       <ul className="list-group">
// // // //         {files.map((file, index) => {
// // // //           const isDuplicate = duplicateFiles.includes(file.name);

// // // //           return (
// // // //             <li
// // // //               key={index}
// // // //               className={`list-group-item d-flex justify-content-between align-items-center
// // // //               ${isDuplicate ? "list-group-item-danger" : ""}`}
// // // //             >
// // // //               <span>
// // // //                 {file.name}
// // // //                 {isDuplicate && (
// // // //                   <strong className="text-danger ms-2">
// // // //                     (Already uploaded)
// // // //                   </strong>
// // // //                 )}
// // // //               </span>

// // // //               <button
// // // //                 type="button"
// // // //                 className="btn btn-sm btn-outline-danger"
// // // //                 onClick={() => removeFile(file.name)}
// // // //               >
// // // //                 Remove
// // // //               </button>
// // // //             </li>
// // // //           );
// // // //         })}
// // // //       </ul>
// // // //     </div>
// // // //   )}

// // // //   {/* UPLOAD BUTTON */}
// // // //   <div className="mt-3">
// // // //     <button
// // // //       className="btn btn-primary"
// // // //       disabled={loading}
// // // //     >
// // // //       {loading ? "Uploading..." : "Upload"}
// // // //     </button>
// // // //   </div>

// // // // </form>


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
// // //   const { uploaded_files = [], duplicate_files = [] } = res.data;

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
// // //     api.get("/lookups/my-teams").then((res) => setTeams(res.data));
// // //     api.get("/lookups/log-sources").then((res) => setSources(res.data));
// // //   }, []);

// // //   /* ---------------- LOAD ALLOWED FORMATS ---------------- */
// // //   useEffect(() => {
// // //     if (!teamId) {
// // //       setAllowedFormats([]);
// // //       return;
// // //     }

// // //     api
// // //       .get(`/lookups/teams/${teamId}/allowed-formats`)
// // //       .then((res) => setAllowedFormats(res.data))
// // //       .catch(() => setAllowedFormats([]));
// // //   }, [teamId]);

// // //   /* ---------------- FILE CHANGE ---------------- */
// // //   const handleFileChange = (e) => {
// // //     const selectedFiles = Array.from(e.target.files);

// // //     if (!teamId) {
// // //       setMessage(
// // //         "Please select your team first so supported file extensions can be displayed."
// // //       );
// // //       return;
// // //     }

// // //     setMessage("");

// // //     setFiles((prevFiles) => {
// // //       const existingNames = prevFiles.map((f) => f.name);

// // //       const newUniqueFiles = selectedFiles.filter(
// // //         (file) => !existingNames.includes(file.name)
// // //       );

// // //       return [...prevFiles, ...newUniqueFiles];
// // //     });

// // //     // Reset input so same file can be selected again
// // //     if (fileInputRef.current) {
// // //       fileInputRef.current.value = "";
// // //     }
// // //   };

// // //   /* ---------------- REMOVE FILE ---------------- */
// // //   const removeFile = (name) => {
// // //     setFiles((prev) => prev.filter((f) => f.name !== name));
// // //     setDuplicateFiles((prev) => prev.filter((n) => n !== name));
// // //   };

// // //   /* ---------------- UPLOAD FILE ---------------- */
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

// // //       files.forEach((file) => {
// // //         formData.append("files", file);
// // //       });

// // //       formData.append("team_id", teamId);
// // //       formData.append("source_id", sourceId);

// // //       const res = await api.post("/files/upload", formData, {
// // //         headers: { "Content-Type": "multipart/form-data" },
// // //       });

// // //       const {
// // //         uploaded_files = [],
// // //         duplicate_files = [],
// // //       } = res.data;

// // //       if (duplicate_files.length > 0) {
// // //         setDuplicateFiles(duplicate_files);
// // //       }
// // //        if (uploaded_files.length > 0) {

// // //         // Build parsing summary message
// // //         const summary = uploaded_files.map(f =>
// // //           `${f.file_name} → Total: ${f.total_records}, Parsed: ${f.parsed_records}, Skipped: ${f.skipped_records}`
// // //         ).join("\n");

// // //         setMessage(summary);

// // //         // Remove successfully uploaded files from UI
// // //         const uploadedNames = uploaded_files.map(f => f.file_name);

// // //         setFiles(prev =>
// // //           prev.filter(file => !uploadedNames.includes(file.name))
// // //         );

// // //         onUploadSuccess && onUploadSuccess();
// // //       } else {
// // //         setMessage("No new files uploaded.");
// // //       }


// // //       if (uploaded_files.length > 0) {
// // //         const uploadedNames = uploaded_files.map((f) => f.file_name);

// // //         setFiles((prev) =>
// // //           prev.filter((file) => !uploadedNames.includes(file.name))
// // //         );

// // //         if (onUploadSuccess) {
// // //           onUploadSuccess();
// // //         }
// // //       }

// // //       setMessage(
// // //         `Uploaded: ${uploaded_files.length} | Duplicates: ${duplicate_files.length}`
// // //       );
// // //     } catch (err) {
// // //       setMessage(err.response?.data?.detail || "Upload failed");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   /* ---------------- FILE TYPE MAPPING ---------------- */
// // //   const formatToAccept = {
// // //     TEXT: ".txt,text/plain",
// // //     JSON: ".json,application/json",
// // //     CSV: ".csv,text/csv",
// // //     XML: ".xml,application/xml,text/xml",
// // //   };

// // //   const acceptTypes = allowedFormats
// // //     .map((f) => formatToAccept[f.format_name?.toUpperCase()])
// // //     .filter(Boolean)
// // //     .join(",");

// // //   /* ---------------- UI ---------------- */
// // //   return (
// // //     <div className="card shadow-sm mb-4">
// // //       <div className="card-header">
// // //         <h5>Upload Log Files</h5>
// // //       </div>

// // //       <div className="card-body">
// // //         <form onSubmit={uploadFile}>

// // //           {/* TEAM WARNING */}
// // //           {!teamId && (
// // //             <div className="alert alert-warning mb-3">
// // //               Please select a team first to see supported file formats.
// // //             </div>
// // //           )}

// // //           {/* TEAM + SOURCE */}
// // //           <div className="row mb-4">
// // //             <div className="col-md-4">
// // //               <label className="form-label fw-semibold">
// // //                 Select Team
// // //               </label>

// // //               <select
// // //                 className="form-select"
// // //                 value={teamId}
// // //                 onChange={(e) => {
// // //                   setTeamId(e.target.value);
// // //                   setFiles([]);
// // //                   setDuplicateFiles([]);
// // //                 }}
// // //               >
// // //                 <option value="">Select team</option>
// // //                 {teams.map((t) => (
// // //                   <option key={t.team_id} value={t.team_id}>
// // //                     {t.team_name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>

// // //             <div className="col-md-4">
// // //               <label className="form-label fw-semibold">
// // //                 Select Source
// // //               </label>

// // //               <select
// // //                 className="form-select"
// // //                 value={sourceId}
// // //                 onChange={(e) => setSourceId(e.target.value)}
// // //               >
// // //                 <option value="">Select source</option>
// // //                 {sources.map((s) => (
// // //                   <option key={s.source_id} value={s.source_id}>
// // //                     {s.source_name}
// // //                   </option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //           </div>

// // //           {/* FILE INPUT */}
// // //           <div className="mb-4">
// // //             <label className="form-label fw-semibold">
// // //               Upload Log Files
// // //             </label>

// // //             <input
// // //               ref={fileInputRef}
// // //               type="file"
// // //               multiple
// // //               className="form-control"
// // //               accept={acceptTypes}
// // //               disabled={!teamId || allowedFormats.length === 0}
// // //               onChange={handleFileChange}
// // //             />

// // //             {teamId && allowedFormats.length > 0 && (
// // //               <div className="form-text mt-2">
// // //                 Supported formats:{" "}
// // //                 {allowedFormats.map((f) => f.format_name).join(", ")}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* FILE LIST */}
// // //           {files.length > 0 && (
// // //             <div className="mb-4">
// // //               <ul className="list-group">
// // //                 {files.map((file, index) => {
// // //                   const isDuplicate = duplicateFiles.includes(file.name);

// // //                   return (
// // //                     <li
// // //                       key={index}
// // //                       className={`list-group-item d-flex justify-content-between align-items-center ${
// // //                         isDuplicate ? "list-group-item-danger" : ""
// // //                       }`}
// // //                     >
// // //                       <span>
// // //                         {file.name}
// // //                         {isDuplicate && (
// // //                           <strong className="text-danger ms-2">
// // //                             (Already uploaded)
// // //                           </strong>
// // //                         )}
// // //                       </span>

// // //                       <button
// // //                         type="button"
// // //                         className="btn btn-sm btn-outline-danger"
// // //                         onClick={() => removeFile(file.name)}
// // //                       >
// // //                         Remove
// // //                       </button>
// // //                     </li>
// // //                   );
// // //                 })}
// // //               </ul>
// // //             </div>
// // //           )}

// // //           {/* BUTTON */}
// // //           <div className="mt-3">
// // //             <button className="btn btn-primary" disabled={loading}>
// // //               {loading ? "Uploading..." : "Upload"}
// // //             </button>
// // //           </div>
// // //         </form>

// // //         {message && (
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
// //   const [summary, setSummary] = useState(null);

// //   const fileInputRef = useRef(null);

// //   /* ---------------- LOAD LOOKUPS ---------------- */
// //   useEffect(() => {
// //     api.get("/lookups/my-teams").then(res => setTeams(res.data));
// //     api.get("/lookups/log-sources").then(res => setSources(res.data));
// //   }, []);

// //   /* ---------------- LOAD ALLOWED FORMATS ---------------- */
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

// //   /* ---------------- FILE CHANGE ---------------- */
// //   const handleFileChange = (e) => {
// //     const selectedFiles = Array.from(e.target.files);

// //     if (!teamId) {
// //       return;
// //     }

// //     setFiles(prev => {
// //       const existing = prev.map(f => f.name);
// //       const unique = selectedFiles.filter(f => !existing.includes(f.name));
// //       return [...prev, ...unique];
// //     });

// //     if (fileInputRef.current) {
// //       fileInputRef.current.value = "";
// //     }
// //   };

// //   /* ---------------- REMOVE FILE ---------------- */
// //   const removeFile = (name) => {
// //     setFiles(prev => prev.filter(f => f.name !== name));
// //     setDuplicateFiles(prev => prev.filter(n => n !== name));
// //   };

// //   /* ---------------- UPLOAD ---------------- */
// //   const uploadFile = async (e) => {
// //     e.preventDefault();

// //     if (!files.length || !teamId || !sourceId) {
// //       return;
// //     }

// //     setLoading(true);
// //     setSummary(null);

// //     try {
// //       const formData = new FormData();

// //       files.forEach(file => formData.append("files", file));
// //       formData.append("team_id", teamId);
// //       formData.append("source_id", sourceId);

// //       const res = await api.post("/files/upload", formData, {
// //         headers: { "Content-Type": "multipart/form-data" }
// //       });

// //       const {
// //         uploaded_files = [],
// //         duplicate_files = []
// //       } = res.data;

// //       setDuplicateFiles(duplicate_files);

// //       // Remove successfully uploaded files from list
// //       const uploadedNames = uploaded_files.map(f => f.file_name);

// //       setFiles(prev =>
// //         prev.filter(file => !uploadedNames.includes(file.name))
// //       );

// //       // Build transparent summary object
// //       setSummary({
// //         uploaded: uploaded_files,
// //         duplicates: duplicate_files
// //       });

// //       onUploadSuccess && onUploadSuccess();

// //     } catch (err) {
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------------- FILE TYPE MAPPING ---------------- */
// //   const formatToAccept = {
// //     TEXT: ".txt,text/plain",
// //     JSON: ".json,application/json",
// //     CSV: ".csv,text/csv",
// //     XML: ".xml,application/xml,text/xml"
// //   };

// //   const acceptTypes = allowedFormats
// //     .map(f => formatToAccept[f.format_name?.toUpperCase()])
// //     .filter(Boolean)
// //     .join(",");

// //   /* ---------------- UI ---------------- */
// //   return (
// //     <div className="card shadow-sm mb-4">
// //       <div className="card-header">
// //         <h5>Upload Log Files</h5>
// //       </div>

// //       <div className="card-body">

// //         <form onSubmit={uploadFile}>

// //           {/* TEAM + SOURCE */}
// //           <div className="row mb-4">
// //             <div className="col-md-4">
// //               <label className="form-label fw-semibold">Select Team</label>
// //               <select
// //                 className="form-select"
// //                 value={teamId}
// //                 onChange={(e) => {
// //                   setTeamId(e.target.value);
// //                   setFiles([]);
// //                   setDuplicateFiles([]);
// //                 }}
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
// //               <label className="form-label fw-semibold">Select Source</label>
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

// //           {/* FILE INPUT */}
// //           <div className="mb-4">
// //             <input
// //               ref={fileInputRef}
// //               type="file"
// //               multiple
// //               className="form-control"
// //               accept={acceptTypes}
// //               disabled={!teamId}
// //               onChange={handleFileChange}
// //             />
// //           </div>

// //           {/* FILE LIST */}
// //           {files.length > 0 && (
// //             <ul className="list-group mb-3">
// //               {files.map((file, index) => (
// //                 <li key={index} className="list-group-item d-flex justify-content-between">
// //                   {file.name}
// //                   <button
// //                     type="button"
// //                     className="btn btn-sm btn-outline-danger"
// //                     onClick={() => removeFile(file.name)}
// //                   >
// //                     Remove
// //                   </button>
// //                 </li>
// //               ))}
// //             </ul>
// //           )}

// //           <button className="btn btn-primary" disabled={loading}>
// //             {loading ? "Uploading..." : "Upload"}
// //           </button>
// //         </form>

// //         {/* ================= SUMMARY DISPLAY ================= */}

// //         {summary && (
// //           <div className="mt-4">

// //             {/* Uploaded Files Transparent Breakdown */}
// //             {summary.uploaded.length > 0 && (
// //               <div className="alert alert-success">
// //                 <strong>Upload Summary</strong>
// //                 <ul className="mt-2">
// //                   {summary.uploaded.map((f, idx) => (
// //                     <li key={idx}>
// //                       <strong>{f.file_name}</strong> →
// //                       Total: {f.total_records} |
// //                       Parsed: {f.parsed_records} |
// //                       Skipped: {f.skipped_records}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}

// //             {/* Duplicate Files */}
// //             {summary.duplicates.length > 0 && (
// //               <div className="alert alert-warning">
// //                 <strong>Duplicate Files:</strong>
// //                 <ul className="mt-2">
// //                   {summary.duplicates.map((d, idx) => (
// //                     <li key={idx}>{d}</li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}

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

//   /* FILE CHANGE */
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);

//     if (!teamId) {
//       setMessage(
//         "Please select your team first so supported file extensions can be displayed."
//       );
//       return;
//     }

//     setMessage("");

//     setFiles(prev => {
//       const existingNames = prev.map(f => f.name);
//       const unique = selectedFiles.filter(
//         file => !existingNames.includes(file.name)
//       );
//       return [...prev, ...unique];
//     });

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

//       const {
//         uploaded_files = [],
//         duplicate_files = []
//       } = res.data;

//       setDuplicateFiles(duplicate_files);

//       /* REMOVE UPLOADED FILES FROM LIST */
//       const uploadedNames = uploaded_files.map(f => f.file_name);
//       setFiles(prev =>
//         prev.filter(file => !uploadedNames.includes(file.name))
//       );

//       /* BUILD TRANSPARENT MESSAGE */
//       let summaryMessage = "";

//       if (uploaded_files.length > 0) {
//         summaryMessage += "Upload Summary:\n";

//         uploaded_files.forEach(f => {
//           summaryMessage +=
//             `${f.file_name} → Total: ${f.total_records}, ` +
//             `Parsed: ${f.parsed_records}, ` +
//             `Skipped: ${f.skipped_records}\n`;
//         });
//       }

//       if (duplicate_files.length > 0) {
//         summaryMessage += "\nDuplicate Files:\n";
//         duplicate_files.forEach(d => {
//           summaryMessage += `${d}\n`;
//         });
//       }

//       if (!summaryMessage) {
//         summaryMessage = "No new files uploaded.";
//       }

//       setMessage(summaryMessage);

//       onUploadSuccess && onUploadSuccess();

//     } catch (err) {
//       setMessage(err.response?.data?.detail || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* FILE TYPE MAPPING */
//   const formatToAccept = {
//     TEXT: ".txt,text/plain",
//     JSON: ".json,application/json",
//     CSV: ".csv,text/csv",
//     XML: ".xml,application/xml,text/xml"
//   };

//   const acceptTypes = allowedFormats
//     .map(f => formatToAccept[f.format_name?.toUpperCase()])
//     .filter(Boolean)
//     .join(",");

//   return (
//     <div className="card shadow-sm mb-4">
//       <div className="card-header">
//         <h5>Upload Log Files</h5>
//       </div>

//       <div className="card-body">
//         <form onSubmit={uploadFile}>

//           {/* TEAM WARNING */}
//           {!teamId && (
//             <div className="alert alert-warning mb-3">
//               Please select a team first to see supported file formats.
//             </div>
//           )}

//           {/* TEAM + SOURCE SECTION */}
//           <div className="row mb-4">
//             <div className="col-md-4">
//               <label className="form-label fw-semibold">
//                 Select Team
//               </label>
//               <select
//                 className="form-select"
//                 value={teamId}
//                 onChange={(e) => {
//                   setTeamId(e.target.value);
//                   setFiles([]);
//                   setDuplicateFiles([]);
//                   setMessage("");
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
//               <label className="form-label fw-semibold">
//                 Select Source
//               </label>
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

//           {/* FILE INPUT SECTION */}
//           <div className="mb-4">
//             <label className="form-label fw-semibold">
//               Upload Log Files
//             </label>

//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               className="form-control"
//               accept={acceptTypes}
//               disabled={!teamId || allowedFormats.length === 0}
//               onChange={handleFileChange}
//             />

//             {teamId && allowedFormats.length > 0 && (
//               <div className="form-text mt-2">
//                 Supported formats:{" "}
//                 {allowedFormats.map(f => f.format_name).join(", ")}
//               </div>
//             )}
//           </div>

//           {/* FILE LIST */}
//           {files.length > 0 && (
//             <div className="mb-4">
//               <ul className="list-group">
//                 {files.map((file, index) => {
//                   const isDuplicate = duplicateFiles.includes(file.name);

//                   return (
//                     <li
//                       key={index}
//                       className={`list-group-item d-flex justify-content-between align-items-center
//                       ${isDuplicate ? "list-group-item-danger" : ""}`}
//                     >
//                       <span>
//                         {file.name}
//                         {isDuplicate && (
//                           <strong className="text-danger ms-2">
//                             (Already uploaded)
//                           </strong>
//                         )}
//                       </span>

//                       <button
//                         type="button"
//                         className="btn btn-sm btn-outline-danger"
//                         onClick={() => removeFile(file.name)}
//                       >
//                         Remove
//                       </button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           )}

//           {/* UPLOAD BUTTON */}
//           <div className="mt-3">
//             <button
//               className="btn btn-primary"
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Upload"}
//             </button>
//           </div>
//         </form>

//         {/* MESSAGE DISPLAY */}
//         {message && (
//           <div className="alert alert-info mt-3" style={{ whiteSpace: "pre-line" }}>
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

  /* ================= LOAD LOOKUPS ================= */
  useEffect(() => {
    api.get("/lookups/my-teams").then(res => setTeams(res.data));
    api.get("/lookups/log-sources").then(res => setSources(res.data));
  }, []);

  /* ================= LOAD ALLOWED FORMATS ================= */
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

  /* ================= HANDLE FILE SELECT ================= */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (!teamId) {
      setMessage("Please select a team first.");
      return;
    }

    setMessage("");

    setFiles(prev => {
      const existingNames = prev.map(f => f.name.toLowerCase());
      const unique = selectedFiles.filter(
        file => !existingNames.includes(file.name.toLowerCase())
      );
      return [...prev, ...unique];
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ================= REMOVE FILE ================= */
  const removeFile = (name) => {
    setFiles(prev => prev.filter(f => f.name !== name));
    setDuplicateFiles(prev =>
      prev.filter(d => d.toLowerCase() !== name.toLowerCase())
    );
  };

  /* ================= UPLOAD ================= */
  const uploadFile = async (e) => {
    e.preventDefault();

    if (!files.length || !teamId || !sourceId) {
      setMessage("Please select all required fields.");
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

      const {
        uploaded_files = [],
        duplicate_files = []
      } = res.data;

      /* ================= STORE DUPLICATES ================= */
      setDuplicateFiles(duplicate_files);

      /* ================= REMOVE SUCCESSFUL UPLOADS ================= */
      const uploadedNames = uploaded_files.map(f =>
        f.file_name.toLowerCase()
      );

      setFiles(prev =>
        prev.filter(file =>
          !uploadedNames.includes(file.name.toLowerCase())
        )
      );

      /* ================= BUILD SUMMARY MESSAGE ================= */
      let summaryMessage = "";

      if (uploaded_files.length > 0) {
        summaryMessage += "Upload Summary:\n\n";
        uploaded_files.forEach(f => {
          summaryMessage +=
            `${f.file_name}\n` +
            `Total: ${f.total_records}, ` +
            `Parsed: ${f.parsed_records}, ` +
            `Skipped: ${f.skipped_records}\n\n`;
        });
      }

      if (duplicate_files.length > 0) {
        summaryMessage += "Duplicate Files:\n\n";
        duplicate_files.forEach(d => {
          summaryMessage += `${d}\n`;
        });
      }

      if (!summaryMessage) {
        summaryMessage = "No new files uploaded.";
      }

      setMessage(summaryMessage);

      onUploadSuccess && onUploadSuccess();

    } catch (err) {
      setMessage(err.response?.data?.detail || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORMAT MAPPING ================= */
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

  /* ================= UI ================= */
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

          {/* TEAM + SOURCE */}
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
                  setMessage("");
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

          {/* FILE INPUT */}
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="form-control"
              accept={acceptTypes}
              disabled={!teamId || allowedFormats.length === 0}
              onChange={handleFileChange}
            />

            {teamId && allowedFormats.length > 0 && (
              <div className="form-text mt-2">
                Supported formats:{" "}
                {allowedFormats.map(f => f.format_name).join(", ")}
              </div>
            )}
          </div>

          {/* FILE LIST */}
          {files.length > 0 && (
            <ul className="list-group mb-3">
              {files.map((file, index) => {

                const normalizedDuplicates = duplicateFiles.map(d =>
                  d.toLowerCase().trim()
                );

                const isDuplicate = normalizedDuplicates.includes(
                  file.name.toLowerCase().trim()
                );

                return (
                  <li
                    key={index}
                    className={`list-group-item d-flex justify-content-between align-items-center
                    ${isDuplicate ? "border border-danger bg-danger-subtle" : ""}`}
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
          )}

          {/* BUTTON */}
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>

        </form>

        {/* SUMMARY MESSAGE */}
        {message && (
          <div
            className="alert alert-info mt-3"
            style={{ whiteSpace: "pre-line" }}
          >
            {message}
          </div>
        )}

      </div>
    </div>
  );
}
