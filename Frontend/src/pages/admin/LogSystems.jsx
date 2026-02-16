// // // import { useEffect, useState } from "react";
// // // import api from "../../api/axios";
// // // import { Link } from "react-router-dom";

// // // export default function ActiveSystemsPage() {
// // //   const [systems, setSystems] = useState([]);

// // //   const [range, setRange] = useState("all");
// // //   const [page, setPage] = useState(1);
// // //   const pageSize = 10;

// // //   const [total, setTotal] = useState(0);
// // //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// // //   const loadSystems = async () => {
// // //     const res = await api.get("/logs/summary/active-systems", {
// // //       params: {
// // //         range,
// // //         page,
// // //         page_size: pageSize,
// // //       },
// // //     });

// // //     setSystems(res.data.data || []);
// // //     setTotal(res.data.total || 0);
// // //   };

// // //   useEffect(() => {
// // //     loadSystems();
// // //   }, [range, page]);

// // //   return (
// // //     <div className="admin-page">

// // //       {/* ===== HEADER ===== */}
// // // <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">

// // //   <div>
// // //     <Link
// // //       to="/admin"
// // //       className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
// // //     >
// // //       ← Back to Overview
// // //     </Link>

// // //     <h5 className="mb-0 fw-semibold">Most Active Systems</h5>
// // //   </div>

// // //   <select
// // //     className="form-select form-select-sm w-auto"
// // //     value={range}
// // //     onChange={(e) => {
// // //       setRange(e.target.value);
// // //       setPage(1);
// // //     }}
// // //   >
// // //     <option value="all">All time</option>
// // //     <option value="7d">Last 7 days</option>
// // //     <option value="10d">Last 10 days</option>
// // //     <option value="30d">Last 30 days</option>
// // //     <option value="90d">Last 90 days</option>
// // //   </select>

// // // </div>

// // //       {/* ===== CARD ===== */}
// // //       <div className="card admin-card p-3 logs-card">

// // //         <table className="table table-sm table-hover admin-table">
// // //           <thead>
// // //             <tr>
// // //               <th>Host</th>
// // //               <th className="text-end">Log Count</th>
// // //             </tr>
// // //           </thead>

// // //           <tbody>
// // //             {systems.length === 0 ? (
// // //               <tr>
// // //                 <td colSpan="2" className="text-center text-muted py-3">
// // //                   No data available
// // //                 </td>
// // //               </tr>
// // //             ) : (
// // //               systems.map((s, i) => (
// // //                 <tr key={i}>
// // //                   <td>{s.host}</td>
// // //                   <td className="text-end">{s.log_count}</td>
// // //                 </tr>
// // //               ))
// // //             )}
// // //           </tbody>
// // //         </table>

// // //         {/* ===== PAGINATION ===== */}
// // //         <div className="admin-pagination d-flex justify-content-between align-items-center mt-3">
// // //           <div className="text-muted small">
// // //             Page <strong>{page}</strong> of <strong>{totalPages}</strong>
// // //             {" "} | Total <strong>{total}</strong> records
// // //           </div>

// // //           <div className="btn-group">
// // //             <button
// // //               className="btn btn-sm btn-outline-dark"
// // //               disabled={page === 1}
// // //               onClick={() => setPage(p => p - 1)}
// // //             >
// // //               ◀ Prev
// // //             </button>
// // //             <button
// // //               className="btn btn-sm btn-outline-dark"
// // //               disabled={page === totalPages}
// // //               onClick={() => setPage(p => p + 1)}
// // //             >
// // //               Next ▶
// // //             </button>
// // //           </div>
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useState } from "react";
// // import api from "../../api/axios";
// // import { Link } from "react-router-dom";

// // export default function ActiveSystemsPage() {
// //   const [systems, setSystems] = useState([]);

// //   /* ================= FILTERS ================= */
// //   const [range, setRange] = useState("all");
// //   const [host, setHost] = useState("");

// //   // keep UI date format as YYYY-MM-DD
// //   const [startDate, setStartDate] = useState("");
// //   const [endDate, setEndDate] = useState("");

// //   /* ================= PAGINATION ================= */
// //   const [page, setPage] = useState(1);
// //   const pageSize = 10;

// //   const [total, setTotal] = useState(0);
// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// //   /* ================= HELPERS ================= */
// //   const toBackendDate = (date) => {
// //     if (!date) return undefined;
// //     const [yyyy, mm, dd] = date.split("-");
// //     return `${dd}-${mm}-${yyyy}`;
// //   };

// //   /* ================= LOAD DATA ================= */
// //   const loadSystems = async () => {
// //     const res = await api.get("/logs/summary/active-systems", {
// //       params: {
// //         range: range !== "all" ? range : undefined,
// //         host: host || undefined,
// //         start_date: toBackendDate(startDate),
// //         end_date: toBackendDate(endDate),
// //         page,
// //         page_size: pageSize,
// //       },
// //     });

// //     setSystems(res.data.data || []);
// //     setTotal(res.data.total || 0);
// //   };

// //   useEffect(() => {
// //     loadSystems();
// //   }, [range, page]);

// //   /* ================= APPLY / CLEAR ================= */
// //   const applyFilters = () => {
// //     if (startDate && endDate && startDate > endDate) {
// //       alert("Start date cannot be after end date");
// //       return;
// //     }
// //     setRange("all");
// //     setPage(1);
// //     loadSystems();
// //   };

// //   const clearFilters = () => {
// //     setHost("");
// //     setStartDate("");
// //     setEndDate("");
// //     setRange("all");
// //     setPage(1);
// //   };

// //   return (
// //     <div className="admin-page">

// //       {/* ================= HEADER ================= */}
// //       <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
// //         <div>
// //           <Link
// //             to="/admin"
// //             className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
// //           >
// //             ← Back to Overview
// //           </Link>
// //           <h5 className="mb-0 fw-semibold">Most Active Systems</h5>
// //         </div>

// //         <select
// //           className="form-select form-select-sm w-auto"
// //           value={range}
// //           onChange={(e) => {
// //             setRange(e.target.value);
// //             setHost("");
// //             setStartDate("");
// //             setEndDate("");
// //             setPage(1);
// //           }}
// //         >
// //           <option value="all">All time</option>
// //           <option value="7d">Last 7 days</option>
// //           <option value="10d">Last 10 days</option>
// //           <option value="30d">Last 30 days</option>
// //           <option value="90d">Last 90 days</option>
// //         </select>
// //       </div>

// //       {/* ================= FILTER CARD ================= */}
// //       <div className="card admin-card p-3 mb-3">
// //         <div className="row g-3 align-items-end">

// //           {/* HOST SEARCH */}
// //           <div className="col-md-3">
// //             <label className="form-label small">Host Name</label>
// //             <input
// //               type="text"
// //               className="form-control form-control-sm"
// //               placeholder="e.g. server-01"
// //               value={host}
// //               onChange={(e) => setHost(e.target.value)}
// //             />
// //           </div>

// //           {/* FROM DATE */}
// //           <div className="col-md-3">
// //             <label className="form-label small">From Date</label>
// //             <input
// //               type="date"
// //               className="form-control form-control-sm"
// //               value={startDate}
// //               onChange={(e) => setStartDate(e.target.value)}
// //             />
// //           </div>

// //           {/* TO DATE */}
// //           <div className="col-md-3">
// //             <label className="form-label small">To Date</label>
// //             <input
// //               type="date"
// //               className="form-control form-control-sm"
// //               value={endDate}
// //               onChange={(e) => setEndDate(e.target.value)}
// //             />
// //           </div>

// //           {/* ACTIONS */}
// //           <div className="col-md-3 d-flex gap-2">
// //             <button
// //               className="btn btn-sm btn-primary w-100"
// //               onClick={applyFilters}
// //               disabled={!host && !startDate && !endDate}
// //             >
// //               Apply
// //             </button>
// //             <button
// //               className="btn btn-sm btn-outline-secondary w-100"
// //               onClick={clearFilters}
// //             >
// //               Clear
// //             </button>
// //           </div>

// //         </div>
// //       </div>

// //       {/* ================= TABLE ================= */}
// //       <div className="card admin-card p-3 logs-card">
// //         <table className="table table-borderless align-middle">
// //           <thead className="border-bottom">
// //             <tr>
// //               <th>Host</th>
// //               <th className="text-end">Log Count</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {systems.length === 0 ? (
// //               <tr>
// //                 <td colSpan="2" className="text-center text-muted py-4">
// //                   No data available
// //                 </td>
// //               </tr>
// //             ) : (
// //               systems.map((s, i) => (
// //                 <tr key={i} className="log-row">
// //                   <td className="py-3 fw-medium">{s.host}</td>
// //                   <td className="text-end py-3">
// //                     <span className="log-count-pill">
// //                       {s.log_count}
// //                     </span>
// //                   </td>
// //                 </tr>
// //               ))
// //             )}
// //           </tbody>
// //         </table>

// //         {/* ================= PAGINATION ================= */}
// //         <div className="admin-pagination d-flex justify-content-between align-items-center mt-3">
// //           <div className="text-muted small">
// //             Page <strong>{page}</strong> of <strong>{totalPages}</strong> ·{" "}
// //             <strong>{total}</strong> records
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

// export default function ActiveSystemsPage() {
//   const [systems, setSystems] = useState([]);

//   /* ================= FILTERS ================= */
//   const [range, setRange] = useState("all");
//   const [host, setHost] = useState("");

//   // UI dates (YYYY-MM-DD)
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // 🔑 force reload trigger
//   const [filtersKey, setFiltersKey] = useState(0);

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
//   const loadSystems = async () => {
//     const res = await api.get("/logs/summary/active-systems", {
//       params: {
//         range: range !== "all" ? range : undefined,
//         host: host || undefined,
//         start_date: toBackendDate(startDate),
//         end_date: toBackendDate(endDate),
//         page,
//         page_size: pageSize,
//       },
//     });

//     setSystems(res.data.data || []);
//     setTotal(res.data.total || 0);
//   };

//   /* ================= EFFECT ================= */
//   useEffect(() => {
//     loadSystems();
//   }, [range, page, filtersKey]);

//   /* ================= APPLY / CLEAR ================= */
//   const applyFilters = () => {
//     if (startDate && endDate && startDate > endDate) {
//       alert("Start date cannot be after end date");
//       return;
//     }

//     setRange("all");
//     setPage(1);

//     // 🔥 force reload
//     setFiltersKey((k) => k + 1);
//   };

//   const clearFilters = () => {
//     setHost("");
//     setStartDate("");
//     setEndDate("");
//     setRange("all");
//     setPage(1);

//     // 🔥 force reload immediately
//     setFiltersKey((k) => k + 1);
//   };

//   return (
//     <div className="admin-page">

//       {/* ================= HEADER ================= */}
//       <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
//         <div>
//           <Link
//             to="/admin"
//             className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
//           >
//             ← Back to Overview
//           </Link>
//           <h5 className="mb-0 fw-semibold">Most Active Systems</h5>
//         </div>

//         <select
//           className="form-select form-select-sm w-auto"
//           value={range}
//           onChange={(e) => {
//             setRange(e.target.value);
//             setHost("");
//             setStartDate("");
//             setEndDate("");
//             setPage(1);

//             // 🔥 force reload
//             setFiltersKey((k) => k + 1);
//           }}
//         >
//           <option value="all">All time</option>
//           <option value="7d">Last 7 days</option>
//           <option value="10d">Last 10 days</option>
//           <option value="30d">Last 30 days</option>
//           <option value="90d">Last 90 days</option>
//         </select>
//       </div>

//       {/* ================= FILTER CARD ================= */}
//       <div className="card admin-card p-3 mb-3">
//         <div className="row g-3 align-items-end">

//           {/* HOST SEARCH */}
//           <div className="col-md-3">
//             <label className="form-label small">Host Name</label>
//             <input
//               type="text"
//               className="form-control form-control-sm"
//               placeholder="e.g. server-01"
//               value={host}
//               onChange={(e) => setHost(e.target.value)}
//             />
//           </div>

//           {/* FROM DATE */}
//           <div className="col-md-3">
//             <label className="form-label small">From Date</label>
//             <input
//               type="date"
//               className="form-control form-control-sm"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </div>

//           {/* TO DATE */}
//           <div className="col-md-3">
//             <label className="form-label small">To Date</label>
//             <input
//               type="date"
//               className="form-control form-control-sm"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>

//           {/* ACTIONS */}
//           <div className="col-md-3 d-flex gap-2">
//             <button
//               className="btn btn-sm btn-primary w-100"
//               onClick={applyFilters}
//               disabled={!host && !startDate && !endDate}
//             >
//               Apply
//             </button>
//             <button
//               className="btn btn-sm btn-outline-secondary w-100"
//               onClick={clearFilters}
//             >
//               Clear
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="card admin-card p-3 logs-card">
//         <table className="table table-borderless align-middle">
//           <thead className="border-bottom">
//             <tr>
//               <th>Host</th>
//               <th className="text-end">Log Count</th>
//             </tr>
//           </thead>

//           <tbody>
//             {systems.length === 0 ? (
//               <tr>
//                 <td colSpan="2" className="text-center text-muted py-4">
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               systems.map((s, i) => (
//                 <tr key={i} className="log-row">
//                   <td className="py-3 fw-medium">{s.host}</td>
//                   <td className="text-end py-3">
//                     <span className="log-count-pill">
//                       {s.log_count}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>

//         {/* ================= PAGINATION ================= */}
//         <div className="admin-pagination d-flex justify-content-between align-items-center mt-3">
//           <div className="text-muted small">
//             Page <strong>{page}</strong> of <strong>{totalPages}</strong> ·{" "}
//             <strong>{total}</strong> records
//           </div>

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
import api from "../../api/axios";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ActiveSystemsPage() {

  const [systems, setSystems] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("all");
  const [host, setHost] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filtersKey, setFiltersKey] = useState(0);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const toBackendDate = (date) => {
    if (!date) return undefined;
    const [yyyy, mm, dd] = date.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  /* ================= LOAD TABLE ================= */
  const loadSystems = async () => {
    try {
      setLoading(true);

      const res = await api.get("/logs/summary/active-systems", {
        params: {
          range: range !== "all" ? range : undefined,
          host: host || undefined,
          start_date: toBackendDate(startDate),
          end_date: toBackendDate(endDate),
          page,
          page_size: pageSize,
        },
      });

      setSystems(res.data.data || []);
      setTotal(res.data.total || 0);

    } catch {
      setSystems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD CHART (TOP 10 ONLY) ================= */
  const loadChartData = async () => {
    const res = await api.get("/logs/summary/active-systems", {
      params: {
        range: range !== "all" ? range : undefined,
        host: host || undefined,
        start_date: toBackendDate(startDate),
        end_date: toBackendDate(endDate),
        page: 1,
        page_size: 10, // chart shows top 10
      },
    });

    setChartData(res.data.data || []);
  };

  useEffect(() => {
    loadSystems();
  }, [range, page, filtersKey]);

  useEffect(() => {
    loadChartData();
  }, [range, filtersKey]);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const applyFilters = () => {
    setRange("all");
    setPage(1);
    setFiltersKey(k => k + 1);
  };

  const clearFilters = () => {
    setHost("");
    setStartDate("");
    setEndDate("");
    setRange("all");
    setPage(1);
    setFiltersKey(k => k + 1);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#fff",
          padding: 10,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <strong>{payload[0].payload.host}</strong>
          <div>Logs: {payload[0].value}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container-fluid mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <Link to="/admin" className="text-muted small">
            ← Back to Overview
          </Link>
          <h5 className="mt-1 fw-semibold">Most Active Systems</h5>
        </div>

        <select
          className="form-select form-select-sm w-auto"
          value={range}
          onChange={(e) => {
            setRange(e.target.value);
            setPage(1);
            setFiltersKey(k => k + 1);
          }}
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="row">

        {/* CHART */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="fw-semibold mb-3">Top Active Hosts</h6>

            {chartData.length === 0 ? (
              <div className="text-muted text-center py-5">
                No chart data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="host" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="log_count" fill="#0d6efd" barSize={25} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-3 h-100">
            <h6 className="fw-semibold mb-3">Detailed View</h6>

            <table className="table table-sm align-middle">
              <thead className="border-bottom">
                <tr>
                  <th>Host</th>
                  <th className="text-end">Log Count</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : systems.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-muted">
                      No data found
                    </td>
                  </tr>
                ) : (
                  systems.map((s, i) => (
                    <tr key={i}>
                      <td>{s.host}</td>
                      <td className="text-end fw-semibold">
                        {s.log_count}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {!loading && total > 0 && (
              <div className="d-flex justify-content-between mt-3">
                <span className="small text-muted">
                  Page {page} of {totalPages}
                </span>
                <div>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="btn btn-sm btn-outline-secondary me-2"
                  >
                    ◀ Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
