export default function Pagination({ page, total, pageSize, setPage }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <span className="text-muted small">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      </span>

      <div className="btn-group">
        <button
          className="btn btn-sm btn-outline-dark"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          ◀ Prev
        </button>

        <button
          className="btn btn-sm btn-outline-dark"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
