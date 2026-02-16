import { useEffect, useState } from "react";
import api from "../api/axios";
import FileUpload from "./FileUpload";
import FileTable from "../components/FileTable";

export default function UserFiles() {
  const [mode, setMode] = useState("my"); // my | team
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- LOAD FILES ---------- */
  const loadFiles = async () => {
    setLoading(true);
    try {
      const endpoint =
        mode === "my"
          ? "/files/my-uploads"
          : "/files/team-uploads";

      const res = await api.get(endpoint);
      setFiles(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [mode]);

  return (
    <div className="container-fluid mt-4">

      {/* ===== UPLOAD SECTION ===== */}
      <FileUpload onUploadSuccess={loadFiles} />

      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Files</h4>

        <select
          className="form-select form-select-sm w-auto"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="my">My Files</option>
          <option value="team">My Team Files</option>
        </select>
      </div>

      {/* ===== FILE TABLE ===== */}
      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : (
            <FileTable files={files} onRefresh={loadFiles} />
          )}
        </div>
      </div>
    </div>
  );
}
