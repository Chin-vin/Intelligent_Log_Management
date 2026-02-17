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