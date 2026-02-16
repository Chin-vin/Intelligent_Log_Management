// // import { useEffect, useState } from "react";
// // import api from "../../api/axios";
// // import { Link } from "react-router-dom";
// // export default function TopErrorsPage() {
// //   const [errors, setErrors] = useState([]);

// //   const [range, setRange] = useState("all");
// //   const [page, setPage] = useState(1);
// //   const pageSize = 10;

// //   const [total, setTotal] = useState(0);
// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// //   const loadErrors = async () => {
// //     const res = await api.get("/logs/summary/top-errors", {
// //       params: {
// //         range,
// //         page,
// //         page_size: pageSize,
// //       },
// //     });

// //     setErrors(res.data.data || []);
// //     setTotal(res.data.total || 0);
// //   };

// //   useEffect(() => {
// //     loadErrors();
// //   }, [range, page]);

// //   return (
// //     <div className="admin-page">

// //      {/* ===== HEADER ===== */}
// // <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">

// //   <div>
// //     <Link
// //       to="/admin"
// //       className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
// //     >
// //       ← Back to Overview
// //     </Link>

// //     <h5 className="mb-0 fw-semibold">Top Error Messages</h5>
// //   </div>

// //   <select
// //     className="form-select form-select-sm w-auto"
// //     value={range}
// //     onChange={(e) => {
// //       setRange(e.target.value);
// //       setPage(1);
// //     }}
// //   >
// //     <option value="all">All time</option>
// //     <option value="7d">Last 7 days</option>
// //     <option value="10d">Last 10 days</option>
// //     <option value="30d">Last 30 days</option>
// //     <option value="90d">Last 90 days</option>
// //   </select>

// // </div>

// //       {/* ===== CARD ===== */}
// //       <div className="card admin-card p-3 logs-card">

// //         <table className="table table-sm table-hover admin-table">
// //           <thead>
// //             <tr>
// //               <th>Error Message</th>
// //               <th className="text-end">Count</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {errors.length === 0 ? (
// //               <tr>
// //                 <td colSpan="2" className="text-center text-muted py-3">
// //                   No error data available
// //                 </td>
// //               </tr>
// //             ) : (
// //               errors.map((e, i) => (
// //                 <tr key={i}>
// //                   <td className="text-truncate" style={{ maxWidth: 600 }}>
// //                     {e.message}
// //                   </td>
// //                   <td className="text-end">{e.count}</td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </table>

// //         {/* ===== PAGINATION ===== */}
// //         <div className="admin-pagination d-flex justify-content-between align-items-center mt-3">
// //           <div className="text-muted small">
// //             Page <strong>{page}</strong> of <strong>{totalPages}</strong>
// //             {" "} | Total <strong>{total}</strong> records
// //           </div>

// //           <div className="btn-group">
// //             <button
// //               className="btn btn-sm btn-outline-dark"
// //               disabled={page === 1}
// //               onClick={() => setPage(p => p - 1)}
// //             >
// //               ◀ Prev
// //             </button>
// //             <button
// //               className="btn btn-sm btn-outline-dark"
// //               disabled={page === totalPages}
// //               onClick={() => setPage(p => p + 1)}
// //             >
// //               Next ▶
// //             </button>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }
// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import { Link } from "react-router-dom";

// export default function TopErrorsPage() {
//   const [errors, setErrors] = useState([]);

//   /* ================= FILTERS ================= */
//   const [range, setRange] = useState("all");

//   // UI dates (YYYY-MM-DD)
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   /* ================= PAGINATION ================= */
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   const [total, setTotal] = useState(0);
//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   /* ================= HELPERS ================= */
//   const toBackendDate = (date) => {
//     if (!date) return undefined;
//     const [yyyy, mm, dd] = date.split("-");
//     return `${dd}-${mm}-${yyyy}`;
//   };

//   /* ================= LOAD DATA ================= */
//   const loadErrors = async () => {
//     const res = await api.get("/logs/summary/top-errors", {
//       params: {
//         range: range !== "all" ? range : undefined,
//         start_date: toBackendDate(startDate),
//         end_date: toBackendDate(endDate),
//         page,
//         page_size: pageSize,
//       },
//     });

//     setErrors(res.data.data || []);
//     setTotal(res.data.total || 0);
//   };

//   useEffect(() => {
//     loadErrors();
//   }, [range, page]);

//   /* ================= APPLY / CLEAR ================= */
//   const applyDateFilter = () => {
//     if (startDate && endDate && startDate > endDate) {
//       alert("Start date cannot be after end date");
//       return;
//     }
//     setRange("all");
//     setPage(1);
//     loadErrors();
//   };

//   const clearDateFilter = () => {
//     setStartDate("");
//     setEndDate("");
//     setRange("all");
//     setPage(1);
//   };

//   return (
//     <div className="admin-page">

//       {/* ===== HEADER ===== */}
//       <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
//         <div>
//           <Link
//             to="/admin"
//             className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
//           >
//             ← Back to Overview
//           </Link>
//           <h5 className="mb-0 fw-semibold">Top Error Messages</h5>
//         </div>

//         {/* <select
//           className="form-select form-select-sm w-auto"
//           value={range}
//           onChange={(e) => {
//             setRange(e.target.value);
//             setStartDate("");
//             setEndDate("");
//             setPage(1);
//           }}
//         >
//           <option value="all">All time</option>
//           <option value="7d">Last 7 days</option>
//           <option value="10d">Last 10 days</option>
//           <option value="30d">Last 30 days</option>
//           <option value="90d">Last 90 days</option>
//         </select> */}
//       </div>

//       {/* ===== DATE FILTER ===== */}
//       <div className="card admin-card p-3 mb-3">
//         <div className="row g-3 align-items-end">

//           <div className="col-md-3">
//             <label className="form-label small">From Date</label>
//             <input
//               type="date"
//               className="form-control form-control-sm"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </div>

//           <div className="col-md-3">
//             <label className="form-label small">To Date</label>
//             <input
//               type="date"
//               className="form-control form-control-sm"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>

//           <div className="col-md-3 d-flex gap-2">
//             <button
//               className="btn btn-sm btn-primary w-100"
//               disabled={!startDate && !endDate}
//               onClick={applyDateFilter}
//             >
//               Apply
//             </button>
//             <button
//               className="btn btn-sm btn-outline-secondary w-100"
//               onClick={clearDateFilter}
//             >
//               Clear
//             </button>
//           </div>
// {/* 
//           <div className="col-md-3 text-muted small">
//             Filter error counts by date range
//           </div> */}

//         </div>
//       </div>

//       {/* ===== TABLE ===== */}
//       <div className="card admin-card p-3 logs-card">
//         <table className="table table-borderless align-middle">
//           <thead className="border-bottom">
//             <tr>
//               <th>Error Message</th>
//               <th className="text-end">Count</th>
//             </tr>
//           </thead>

//           <tbody>
//             {errors.length === 0 ? (
//               <tr>
//                 <td colSpan="2" className="text-center text-muted py-4">
//                   No error data available
//                 </td>
//               </tr>
//             ) : (
//               errors.map((e, i) => (
//                 <tr key={i} className="log-row">
//                   <td className="py-3 text-truncate" style={{ maxWidth: 600 }}>
//                     {e.message}
//                   </td>
//                   <td className="text-end py-3">
//                     <span className="log-count-pill">
//                       {e.count}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* ===== PAGINATION ===== */}
//         <div className="admin-pagination d-flex justify-content-between align-items-center mt-3">
//           <div className="text-muted small">
//             Page <strong>{page}</strong> of <strong>{totalPages}</strong> ·{" "}
//             <strong>{total}</strong> records
//           </div>

//           <div className="btn-group">
//             <button
//               className="btn btn-sm btn-outline-dark"
//               disabled={page === 1}
//               onClick={() => setPage(p => p - 1)}
//             >
//               ◀ Prev
//             </button>
//             <button
//               className="btn btn-sm btn-outline-dark"
//               disabled={page === totalPages}
//               onClick={() => setPage(p => p + 1)}
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
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function TopErrorsPage() {
  const [errors, setErrors] = useState([]);

  /* ================= FILTERS ================= */
  const [range, setRange] = useState("all");

  // UI dates (YYYY-MM-DD)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔑 force reload trigger
  const [filtersKey, setFiltersKey] = useState(0);

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ================= HELPERS ================= */
  const toBackendDate = (date) => {
    if (!date) return undefined;
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  /* ================= LOAD DATA ================= */
  const loadErrors = async () => {
    const res = await api.get("/logs/summary/top-errors", {
      params: {
        range: range !== "all" ? range : undefined,
        start_date: toBackendDate(startDate),
        end_date: toBackendDate(endDate),
        page,
        page_size: pageSize,
      },
    });

    setErrors(res.data.data || []);
    setTotal(res.data.total || 0);
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    loadErrors();
  }, [range, page, filtersKey]);

  /* ================= APPLY / CLEAR ================= */
  const applyDateFilter = () => {
    if (startDate && endDate && startDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }

    setRange("all");
    setPage(1);

    // 🔥 force reload
    setFiltersKey((k) => k + 1);
  };

  const clearDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setRange("all");
    setPage(1);

    // 🔥 force reload
    setFiltersKey((k) => k + 1);
  };

  return (
    <div className="admin-page">

      {/* ===== HEADER ===== */}
      <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div>
          <Link
            to="/admin"
            className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
          >
            ← Back to Overview
          </Link>
          <h5 className="mb-0 fw-semibold">Top Error Messages</h5>
        </div>
      </div>

      {/* ===== DATE FILTER ===== */}
      <div className="card admin-card p-3 mb-3">
        <div className="row g-3 align-items-end">

          <div className="col-md-3">
            <label className="form-label small">From Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small">To Date</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="col-md-3 d-flex gap-2">
            <button
              className="btn btn-sm btn-primary w-100"
              disabled={!startDate && !endDate}
              onClick={applyDateFilter}
            >
              Apply
            </button>
            <button
              className="btn btn-sm btn-outline-secondary w-100"
              onClick={clearDateFilter}
            >
              Clear
            </button>
          </div>

        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="card admin-card p-3 logs-card">
        <table className="table table-borderless align-middle">
          <thead className="border-bottom">
            <tr>
              <th>Error Message</th>
              <th className="text-end">Count</th>
            </tr>
          </thead>

          <tbody>
            {errors.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center text-muted py-4">
                  No error data available
                </td>
              </tr>
            ) : (
              errors.map((e, i) => (
                <tr key={i} className="log-row">
                  <td className="py-3 text-truncate" style={{ maxWidth: 600 }}>
                    {e.message}
                  </td>
                  <td className="text-end py-3">
                    <span className="log-count-pill">
                      {e.count}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ===== PAGINATION ===== */}
        <div className="admin-pagination d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong> ·{" "}
            <strong>{total}</strong> records
          </div>

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
