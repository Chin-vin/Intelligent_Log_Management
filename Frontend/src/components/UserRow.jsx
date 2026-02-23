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
