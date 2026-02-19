import { useEffect, useState } from "react";
import api from "../api/axios";

export default function UserDeletedArchived() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Fetch USER deleted + archived files
  const fetchFiles = async () => {
    try {
      const res = await api.get("/files/my-deleted-archived");
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // 🔹 Restore file (same API works)
  const handleRestore = async (fileId) => {
    try {
      await api.patch(`/files/${fileId}/restore`);

      setFiles((prev) =>
        prev.filter((file) => file.file_id !== fileId)
      );
    } catch (err) {
      console.error("Restore failed:", err);
    }
  };

  // 🔹 Filtering
  const filteredFiles = files.filter((file) => {
    const matchStatus =
      statusFilter === "ALL" || file.status === statusFilter;

    const matchSearch = file.original_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="container mt-4">
      <h4 className="fw-bold mb-4">Deleted & Archived Files</h4>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="SOFT_DELETED">Deleted</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-secondary"></div>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="alert alert-secondary">
          No files found.
        </div>
      ) : (
        <div className="list-group">
          {filteredFiles.map((file) => {
            const isDeleted =
              file.status === "SOFT_DELETED";
            const isArchived =
              file.status === "ARCHIVED";

            return (
              <div
                key={file.file_id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  isArchived ? "opacity-50" : ""
                }`}
              >
                <div>
                  <h6 className="mb-1">
                    {file.original_name}
                  </h6>

                  <small className="text-muted">
                    Uploaded:{" "}
                    {new Date(
                      file.uploaded_at
                    ).toLocaleString()}
                  </small>

                  <div className="mt-2">
                    <span
                      className={`badge ${
                        isDeleted
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {file.status}
                    </span>
                  </div>
                </div>

                {/* Restore only for Deleted */}
                {isDeleted && (
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() =>
                      handleRestore(file.file_id)
                    }
                  >
                    Restore
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
