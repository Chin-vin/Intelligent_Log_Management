import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function FileUpload({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [duplicateFiles, setDuplicateFiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [sources, setSources] = useState([]);
  const [teamId, setTeamId] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef(null);

  /* ================= LOAD LOOKUPS ================= */
  useEffect(() => {
    api.get("/lookups/my-teams").then(res => setTeams(res.data));
    api.get("/lookups/log-sources").then(res => setSources(res.data));
  }, []);

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

      setDuplicateFiles(duplicate_files);

      const uploadedNames = uploaded_files.map(f =>
        f.file_name.toLowerCase()
      );

      setFiles(prev =>
        prev.filter(file =>
          !uploadedNames.includes(file.name.toLowerCase())
        )
      );

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

  /* ================= UI ================= */
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header">
        <h5>Upload Log Files</h5>
      </div>

      <div className="card-body">
        <form onSubmit={uploadFile}>

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
              accept=".txt,.csv,.json,.xml"
              disabled={!teamId}
              onChange={handleFileChange}
            />
            <div className="form-text mt-2">
              Supported formats: TXT, CSV, JSON, XML
            </div>
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

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </button>

        </form>

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
