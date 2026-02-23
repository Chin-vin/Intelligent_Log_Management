
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
