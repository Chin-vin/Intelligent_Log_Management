
import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function ConfirmModal({
  show,
  title = "Confirm",
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
}) {
  useEffect(() => {
    if (show) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");

    return () => document.body.classList.remove("modal-open");
  }, [show]);

  if (!show) return null;

  return createPortal(
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button className="btn-close" onClick={onCancel}></button>
            </div>

            <div className="modal-body">
              <p>{message}</p>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onCancel}>
                {cancelText}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
              >
                {confirmText}
              </button>
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop show"></div>
    </>,
    document.body
  );
}
