// import { useEffect, useState } from "react";
// import api from "../api/axios";

// export default function LoginHistoryPage() {
//   const [data, setData] = useState([]);

//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(20);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);


//   const [statusFilter, setStatusFilter] = useState(""); // "", "success", "failure"

//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   /* ---------------- LOAD LOGIN HISTORY ---------------- */
//   const loadLoginHistory = async () => {
//   try {
//     setLoading(true);

//     const res = await api.get("/admin/security/login-history", {
//       params: {
//         page,
//         page_size: pageSize,
//         success:
//           statusFilter === ""
//             ? undefined
//             : statusFilter === "success",
//       },
//     });

//     setData(res.data.data || []);
//     setTotal(res.data.total || 0);
//   } catch (error) {
//     console.error("Error loading login history:", error);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     loadLoginHistory();
//   }, [page, pageSize, statusFilter]);

//   return (
//     <div className="container-fluid px-4 mt-4 admin-page">

//       {/* ---------- HEADER + FILTERS ---------- */}
//       <div className="d-flex justify-content-between align-items-end mb-3 flex-wrap gap-3">
//         <h4 className="m-0">Login & Security Events</h4>

//         <div className="d-flex align-items-center gap-3 flex-wrap">

//           {/* STATUS FILTER */}
//           <div>
//             <label className="form-label small mb-0">Status</label>
//             <select
//               className="form-select form-select-sm"
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setPage(1);
//               }}
//             >
//               <option value="">All</option>
//               <option value="success">Success</option>
//               <option value="failure">Failure</option>
//             </select>
//           </div>

//           {/* SHOW ENTRIES */}
//           <div>
//             <label className="form-label small mb-0">Show</label>
//             <select
//               className="form-select form-select-sm"
//               value={pageSize}
//               onChange={(e) => {
//                 setPageSize(Number(e.target.value));
//                 setPage(1);
//               }}
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//             </select>
//           </div>

//           {/* RESET */}
//           <button
//             className="btn btn-sm btn-outline-secondary mt-4"
//             onClick={() => {
//               setStatusFilter("");
//               setPageSize(20);
//               setPage(1);
//             }}
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* ---------- TABLE CARD ---------- */}
//       <div className="card shadow-sm p-3">

//         {/* ✅ RESPONSIVE TABLE WRAPPER */}
//         <div className="table-responsive">
//           <table className="table table-sm table-hover align-middle">
//             <thead className="table-light">
//               <tr>
//                 <th className="text-nowrap">Sl No.</th>
//                 <th className="text-nowrap">Time</th>
//                 <th className="text-nowrap">User</th>
//                 <th className="text-nowrap">IP</th>
//                 <th>Status</th>
//                 <th>Reason</th>
//               </tr>
//             </thead>

//             <tbody>
//   {loading ? (
//     <tr>
//       <td colSpan="6" className="text-center">
//         <div className="spinner-border text-primary" role="status" />
//       </td>
//     </tr>
//   ) : data.length === 0 ? (
//     <tr>
//       <td colSpan="6" className="text-muted text-center">
//         No login history found
//       </td>
//     </tr>
//   ) : (
//     data.map((l, idx) => (
//       <tr key={l.login_id}>
//         <td className="text-nowrap">
//           {(page - 1) * pageSize + idx + 1}
//         </td>

//         <td className="text-nowrap">
//           {new Date(l.login_time).toLocaleString()}
//         </td>

//         <td className="text-nowrap">{l.user || "—"}</td>
//         <td className="text-nowrap">{l.login_ip || "—"}</td>

//         <td>
//           <span
//             className={`badge ${
//               l.success ? "bg-success" : "bg-danger"
//             }`}
//           >
//             {l.success ? "SUCCESS" : "FAILED"}
//           </span>
//         </td>

//         <td
//           className="text-truncate"
//           style={{ maxWidth: 250 }}
//           title={l.failure_reason}
//         >
//           {l.failure_reason || "—"}
//         </td>
//       </tr>
//     ))
//   )}
// </tbody>

//           </table>
//         </div>

//         {/* ---------- PAGINATION ---------- */}
//         <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
//           <span className="text-muted small">
//             Page <strong>{page}</strong> of{" "}
//             <strong>{totalPages}</strong> | Total:{" "}
//             <strong>{total}</strong>
//           </span>

//           <div className="btn-group">
//             <button
//               className="btn btn-sm btn-outline-dark"
//               disabled={page === 1}
//               onClick={() => setPage((p) => p - 1)}
//             >
//               ◀ Prev
//             </button>

//             <button
//               className="btn btn-sm btn-outline-dark"
//               disabled={page === totalPages}
//               onClick={() => setPage((p) => p + 1)}
//             >
//               Next ▶
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function LoginHistoryPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ---------------- DATE FORMATTER ---------------- */
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  /* ---------------- RELATIVE TIME ---------------- */
  const getRelativeTime = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hrs ago`;

    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  /* ---------------- LOAD LOGIN HISTORY ---------------- */
  const loadLoginHistory = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/security/login-history", {
        params: {
          page,
          page_size: pageSize,
          success:
            statusFilter === ""
              ? undefined
              : statusFilter === "success",
        },
      });

      setData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error("Error loading login history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoginHistory();
  }, [page, pageSize, statusFilter]);

  return (
    <div className="container-fluid px-4 mt-4 admin-page">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-semibold mb-0">
            Login & Security Events
          </h4>
          <small className="text-muted">
            Monitor authentication activity
          </small>
        </div>

        <div className="d-flex align-items-end gap-3 flex-wrap">

          {/* STATUS FILTER */}
          <div>
            <label className="form-label small mb-1">Status</label>
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </div>

          {/* PAGE SIZE */}
          <div>
            <label className="form-label small mb-1">Show</label>
            <select
              className="form-select form-select-sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* RESET BUTTON */}
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              setStatusFilter("");
              setPageSize(20);
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "70px" }}>#</th>
                  <th>Login Time</th>
                  <th>User</th>
                  <th>IP Address</th>
                  <th>Status</th>
                  <th>Failure Reason</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="spinner-border text-primary" />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No login history found
                    </td>
                  </tr>
                ) : (
                  data.map((l, idx) => (
                    <tr key={l.login_id}>
                      <td>
                        {(page - 1) * pageSize + idx + 1}
                      </td>

                      <td>
                        <div className="fw-medium">
                          {formatDateTime(l.login_time)}
                        </div>
                        <div className="text-muted small">
                          {getRelativeTime(l.login_time)}
                        </div>
                      </td>

                      <td>{l.user || "—"}</td>

                      <td className="text-monospace">
                        {l.login_ip || "—"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            l.success
                              ? "bg-success-subtle text-success"
                              : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {l.success ? "SUCCESS" : "FAILED"}
                        </span>
                      </td>

                      <td
                        style={{ maxWidth: 250 }}
                        className="text-truncate"
                        title={l.failure_reason}
                      >
                        {l.failure_reason || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="card-footer bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">

          <small className="text-muted">
            Page <strong>{page}</strong> of{" "}
            <strong>{totalPages}</strong> | Total:{" "}
            <strong>{total}</strong> records
          </small>

          <div className="btn-group">
            <button
              className="btn btn-sm btn-outline-dark"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ◀ Prev
            </button>

            <button
              className="btn btn-sm btn-outline-dark"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}