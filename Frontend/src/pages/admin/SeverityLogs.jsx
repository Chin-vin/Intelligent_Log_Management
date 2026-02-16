// // // // // // import { useEffect, useState } from "react";
// // // // // // import api from "../../api/axios";
// // // // // // import { Link } from "react-router-dom";
// // // // // // export default function SeverityDistributionPage() {
// // // // // //   const [stats, setStats] = useState([]);

// // // // // //   const [range, setRange] = useState("all"); // ✅ default ALL
// // // // // //   const [page, setPage] = useState(1);
// // // // // //   const pageSize = 10;

// // // // // //   const [total, setTotal] = useState(0);
// // // // // //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// // // // // //   const loadStats = async () => {
// // // // // //     const res = await api.get("/logs/summary/severity-per-day", {
// // // // // //       params: {
// // // // // //         range: range !== "all" ? range : undefined,
// // // // // //         page,
// // // // // //         page_size: pageSize,
// // // // // //       },
// // // // // //     });

// // // // // //     setStats(res.data.data || []);
// // // // // //     setTotal(res.data.total || 0);
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     loadStats();
// // // // // //   }, [range, page]);

// // // // // //   return (
// // // // // //     <div className="admin-page">

// // // // // //       {/* ===== HEADER ===== */}
// // // // // //       {/* ===== HEADER ===== */}
// // // // // // <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">

// // // // // //   <div>
// // // // // //     <Link
// // // // // //       to="/admin"
// // // // // //       className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
// // // // // //     >
// // // // // //       ← Back to Overview
// // // // // //     </Link>

// // // // // //     <h5 className="mb-0 fw-semibold">Severity Distribution</h5>
// // // // // //   </div>

// // // // // //   <select
// // // // // //     className="form-select form-select-sm w-auto"
// // // // // //     value={range}
// // // // // //     onChange={(e) => {
// // // // // //       setRange(e.target.value);
// // // // // //       setPage(1);
// // // // // //     }}
// // // // // //   >
// // // // // //     <option value="all">All time</option>
// // // // // //     <option value="7d">Last 7 days</option>
// // // // // //     <option value="10d">Last 10 days</option>
// // // // // //     <option value="30d">Last 30 days</option>
// // // // // //     <option value="90d">Last 90 days</option>
// // // // // //     <option value="365d">Last 1 year</option>
// // // // // //   </select>

// // // // // // </div>

// // // // // //       {/* ===== TABLE ===== */}
// // // // // //       <div className="card admin-card p-3">
// // // // // //         <table className="table table-sm table-hover admin-table">
// // // // // //           <thead>
// // // // // //             <tr>
// // // // // //               <th>Date</th>
// // // // // //               <th>Severity</th>
// // // // // //               <th className="text-end">Count</th>
// // // // // //             </tr>
// // // // // //           </thead>

// // // // // //           <tbody>
// // // // // //             {stats.length === 0 ? (
// // // // // //               <tr>
// // // // // //                 <td colSpan="3" className="text-center text-muted py-3">
// // // // // //                   No data available
// // // // // //                 </td>
// // // // // //               </tr>
// // // // // //             ) : (
// // // // // //               stats.map((s, i) => (
// // // // // //                 <tr key={i}>
// // // // // //                   <td>{s.day}</td>
// // // // // //                   <td>
// // // // // //                     <span
// // // // // //                       className={`badge ${
// // // // // //                         s.severity === "ERROR"
// // // // // //                           ? "bg-danger"
// // // // // //                           : s.severity === "WARN"
// // // // // //                           ? "bg-warning text-dark"
// // // // // //                           : s.severity === "INFO"
// // // // // //                           ? "bg-info"
// // // // // //                           : s.severity === "DEBUG"
// // // // // //                           ? "bg-secondary"
// // // // // //                           : "bg-dark"
// // // // // //                       }`}
// // // // // //                     >
// // // // // //                       {s.severity}
// // // // // //                     </span>
// // // // // //                   </td>
// // // // // //                   <td className="text-end">{s.count}</td>
// // // // // //                 </tr>
// // // // // //               ))
// // // // // //             )}
// // // // // //           </tbody>
// // // // // //         </table>

// // // // // //         {/* ===== PAGINATION ===== */}
// // // // // //         <div className="d-flex justify-content-between align-items-center mt-2">
// // // // // //           <span className="text-muted small">
// // // // // //             Page <strong>{page}</strong> of <strong>{totalPages}</strong>
// // // // // //           </span>

// // // // // //           <div className="btn-group">
// // // // // //             <button
// // // // // //               className="btn btn-sm btn-outline-dark"
// // // // // //               disabled={page === 1}
// // // // // //               onClick={() => setPage(p => p - 1)}
// // // // // //             >
// // // // // //               ◀ Prev
// // // // // //             </button>
// // // // // //             <button
// // // // // //               className="btn btn-sm btn-outline-dark"
// // // // // //               disabled={page === totalPages}
// // // // // //               onClick={() => setPage(p => p + 1)}
// // // // // //             >
// // // // // //               Next ▶
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }
// // // // // import { useEffect, useState } from "react";
// // // // // import api from "../../api/axios";
// // // // // import { Link } from "react-router-dom";

// // // // // export default function SeverityDistributionPage() {
// // // // //   const [stats, setStats] = useState([]);

// // // // //   /* ================= FILTER STATES ================= */
// // // // //   const [range, setRange] = useState("all");

// // // // //   // UI date values (YYYY-MM-DD)
// // // // //   const [startDate, setStartDate] = useState("");
// // // // //   const [endDate, setEndDate] = useState("");

// // // // //   // 🔑 force reload trigger
// // // // //   const [filtersKey, setFiltersKey] = useState(0);

// // // // //   /* ================= PAGINATION ================= */
// // // // //   const [page, setPage] = useState(1);
// // // // //   const pageSize = 10;

// // // // //   const [total, setTotal] = useState(0);
// // // // //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// // // // //   /* ================= HELPERS ================= */
// // // // //   const toBackendDate = (date) => {
// // // // //     if (!date) return undefined;
// // // // //     const [yyyy, mm, dd] = date.split("-");
// // // // //     return `${dd}-${mm}-${yyyy}`;
// // // // //   };

// // // // //   /* ================= LOAD DATA ================= */
// // // // //   const loadStats = async () => {
// // // // //     const res = await api.get("/logs/summary/severity-per-day", {
// // // // //       params: {
// // // // //         range: range !== "all" ? range : undefined,
// // // // //         start_date: toBackendDate(startDate),
// // // // //         end_date: toBackendDate(endDate),
// // // // //         page,
// // // // //         page_size: pageSize,
// // // // //       },
// // // // //     });

// // // // //     setStats(res.data.data || []);
// // // // //     setTotal(res.data.total || 0);
// // // // //   };

// // // // //   /* ================= EFFECT ================= */
// // // // //   useEffect(() => {
// // // // //     loadStats();
// // // // //   }, [range, page, filtersKey]);

// // // // //   /* ================= APPLY / CLEAR ================= */
// // // // //   const applyDateFilter = () => {
// // // // //     if (startDate && endDate && startDate > endDate) {
// // // // //       alert("Start date cannot be after end date");
// // // // //       return;
// // // // //     }

// // // // //     setRange("all");
// // // // //     setPage(1);

// // // // //     // 🔥 force reload
// // // // //     setFiltersKey((k) => k + 1);
// // // // //   };

// // // // //   const clearDateFilter = () => {
// // // // //     setStartDate("");
// // // // //     setEndDate("");
// // // // //     setRange("all");
// // // // //     setPage(1);

// // // // //     // 🔥 force reload immediately
// // // // //     setFiltersKey((k) => k + 1);
// // // // //   };

// // // // //   return (
// // // // //     <div className="admin-page">

// // // // //       {/* ================= HEADER ================= */}
// // // // //       <div className="admin-page-header d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
// // // // //         <div>
// // // // //           <Link
// // // // //             to="/admin"
// // // // //             className="text-decoration-none text-muted small d-inline-flex align-items-center mb-1"
// // // // //           >
// // // // //             ← Back to Overview
// // // // //           </Link>
// // // // //           <h5 className="mb-0 fw-semibold">Severity Distribution</h5>
// // // // //         </div>

// // // // //         <select
// // // // //           className="form-select form-select-sm w-auto"
// // // // //           value={range}
// // // // //           onChange={(e) => {
// // // // //             setRange(e.target.value);
// // // // //             setStartDate("");
// // // // //             setEndDate("");
// // // // //             setPage(1);
// // // // //             setFiltersKey((k) => k + 1);
// // // // //           }}
// // // // //         >
// // // // //           <option value="all">All time</option>
// // // // //           <option value="7d">Last 7 days</option>
// // // // //           <option value="10d">Last 10 days</option>
// // // // //           <option value="30d">Last 30 days</option>
// // // // //           <option value="90d">Last 90 days</option>
// // // // //           <option value="365d">Last 1 year</option>
// // // // //         </select>
// // // // //       </div>

// // // // //       {/* ================= DATE FILTER ================= */}
// // // // //       <div className="card admin-card p-3 mb-3">
// // // // //         <div className="row g-3 align-items-end">

// // // // //           <div className="col-md-3">
// // // // //             <label className="form-label small">From Date</label>
// // // // //             <input
// // // // //               type="date"
// // // // //               className="form-control form-control-sm"
// // // // //               value={startDate}
// // // // //               onChange={(e) => setStartDate(e.target.value)}
// // // // //             />
// // // // //           </div>

// // // // //           <div className="col-md-3">
// // // // //             <label className="form-label small">To Date</label>
// // // // //             <input
// // // // //               type="date"
// // // // //               className="form-control form-control-sm"
// // // // //               value={endDate}
// // // // //               onChange={(e) => setEndDate(e.target.value)}
// // // // //             />
// // // // //           </div>

// // // // //           <div className="col-md-3 d-flex gap-2">
// // // // //             <button
// // // // //               className="btn btn-sm btn-primary w-100"
// // // // //               disabled={!startDate && !endDate}
// // // // //               onClick={applyDateFilter}
// // // // //             >
// // // // //               Apply
// // // // //             </button>
// // // // //             <button
// // // // //               className="btn btn-sm btn-outline-secondary w-100"
// // // // //               onClick={clearDateFilter}
// // // // //             >
// // // // //               Clear
// // // // //             </button>
// // // // //           </div>

// // // // //           <div className="col-md-3 text-muted small">
// // // // //             Filter severity counts by date range
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* ================= TABLE ================= */}
// // // // //       <div className="card admin-card p-3">
// // // // //         <table className="table table-borderless align-middle">
// // // // //           <thead className="border-bottom">
// // // // //             <tr>
// // // // //               <th>Date</th>
// // // // //               <th>Severity</th>
// // // // //               <th className="text-end">Count</th>
// // // // //             </tr>
// // // // //           </thead>

// // // // //           <tbody>
// // // // //             {stats.length === 0 ? (
// // // // //               <tr>
// // // // //                 <td colSpan="3" className="text-center text-muted py-4">
// // // // //                   No data available
// // // // //                 </td>
// // // // //               </tr>
// // // // //             ) : (
// // // // //               stats.map((s, i) => (
// // // // //                 <tr key={i} className="log-row">
// // // // //                   <td className="py-3">{s.day}</td>
// // // // //                   <td className="py-3">
// // // // //                     <span
// // // // //                       className={`badge ${
// // // // //                         s.severity === "ERROR"
// // // // //                           ? "bg-danger"
// // // // //                           : s.severity === "WARN"
// // // // //                           ? "bg-warning text-dark"
// // // // //                           : s.severity === "INFO"
// // // // //                           ? "bg-info"
// // // // //                           : s.severity === "DEBUG"
// // // // //                           ? "bg-secondary"
// // // // //                           : "bg-dark"
// // // // //                       }`}
// // // // //                     >
// // // // //                       {s.severity}
// // // // //                     </span>
// // // // //                   </td>
// // // // //                   <td className="text-end py-3">
// // // // //                     <span className="log-count-pill">
// // // // //                       {s.count}
// // // // //                     </span>
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               ))
// // // // //             )}
// // // // //           </tbody>
// // // // //         </table>

// // // // //         {/* ================= PAGINATION ================= */}
// // // // //         <div className="d-flex justify-content-between align-items-center mt-2">
// // // // //           <span className="text-muted small">
// // // // //             Page <strong>{page}</strong> of <strong>{totalPages}</strong> ·{" "}
// // // // //             <strong>{total}</strong> records
// // // // //           </span>

// // // // //           <div className="btn-group">
// // // // //             <button
// // // // //               className="btn btn-sm btn-outline-dark"
// // // // //               disabled={page === 1}
// // // // //               onClick={() => setPage((p) => p - 1)}
// // // // //             >
// // // // //               ◀ Prev
// // // // //             </button>
// // // // //             <button
// // // // //               className="btn btn-sm btn-outline-dark"
// // // // //               disabled={page === totalPages}
// // // // //               onClick={() => setPage((p) => p + 1)}
// // // // //             >
// // // // //               Next ▶
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // import { useEffect, useState } from "react";
// // // // import api from "../../api/axios";
// // // // import { Link } from "react-router-dom";
// // // // import {
// // // //   BarChart,
// // // //   Bar,
// // // //   XAxis,
// // // //   YAxis,
// // // //   Tooltip,
// // // //   Legend,
// // // //   CartesianGrid,
// // // //   ResponsiveContainer,
// // // // } from "recharts";

// // // // export default function SeverityDistributionPage() {
// // // //   const [stats, setStats] = useState([]);
// // // //   const [chartDataRaw, setChartDataRaw] = useState([]);

// // // //   /* ================= FILTER STATES ================= */
// // // //   const [range, setRange] = useState("all");
// // // //   const [startDate, setStartDate] = useState("");
// // // //   const [endDate, setEndDate] = useState("");
// // // //   const [filtersKey, setFiltersKey] = useState(0);

// // // //   /* ================= PAGINATION ================= */
// // // //   const [page, setPage] = useState(1);
// // // //   const pageSize = 10;
// // // //   const [total, setTotal] = useState(0);
// // // //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// // // //   const toBackendDate = (date) => {
// // // //     if (!date) return undefined;
// // // //     const [yyyy, mm, dd] = date.split("-");
// // // //     return `${dd}-${mm}-${yyyy}`;
// // // //   };

// // // //   /* ================= LOAD TABLE DATA ================= */
// // // //   const loadStats = async () => {
// // // //     const res = await api.get("/logs/summary/severity-per-day", {
// // // //       params: {
// // // //         range: range !== "all" ? range : undefined,
// // // //         start_date: toBackendDate(startDate),
// // // //         end_date: toBackendDate(endDate),
// // // //         page,
// // // //         page_size: pageSize,
// // // //       },
// // // //     });

// // // //     setStats(res.data.data || []);
// // // //     setTotal(res.data.total || 0);
// // // //   };

// // // //   /* ================= LOAD CHART DATA ================= */
// // // //   const loadChartData = async () => {
// // // //     const res = await api.get("/logs/summary/severity-per-day/all", {
// // // //       params: {
// // // //         range: range !== "all" ? range : undefined,
// // // //         start_date: toBackendDate(startDate),
// // // //         end_date: toBackendDate(endDate),
// // // //       },
// // // //     });

// // // //     setChartDataRaw(res.data.data || []);
// // // //   };

// // // //   /* ================= TRANSFORM FOR CHART ================= */
// // // //   const getChartData = () => {
// // // //     const map = {};

// // // //     chartDataRaw.forEach((item) => {
// // // //       if (!map[item.day]) {
// // // //         map[item.day] = {
// // // //           day: item.day,
// // // //           ERROR: 0,
// // // //           WARN: 0,
// // // //           INFO: 0,
// // // //           DEBUG: 0,
// // // //         };
// // // //       }

// // // //       map[item.day][item.severity] = item.count;
// // // //     });

// // // //     return Object.values(map);
// // // //   };

// // // //   /* ================= EFFECT ================= */
// // // //   useEffect(() => {
// // // //     loadStats();
// // // //     loadChartData();
// // // //   }, [range, page, filtersKey]);

// // // //   /* ================= APPLY / CLEAR ================= */
// // // //   const applyDateFilter = () => {
// // // //     if (startDate && endDate && startDate > endDate) {
// // // //       alert("Start date cannot be after end date");
// // // //       return;
// // // //     }

// // // //     setRange("all");
// // // //     setPage(1);
// // // //     setFiltersKey((k) => k + 1);
// // // //   };

// // // //   const clearDateFilter = () => {
// // // //     setStartDate("");
// // // //     setEndDate("");
// // // //     setRange("all");
// // // //     setPage(1);
// // // //     setFiltersKey((k) => k + 1);
// // // //   };

// // // //   const CustomTooltip = ({ active, payload, label }) => {
// // // //   if (active && payload && payload.length) {
// // // //     return (
// // // //       <div
// // // //         style={{
// // // //           background: "#fff",
// // // //           padding: "10px 15px",
// // // //           borderRadius: "8px",
// // // //           boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// // // //           fontSize: "13px",
// // // //         }}
// // // //       >
// // // //         <strong>{label}</strong>
// // // //         <hr style={{ margin: "5px 0" }} />
// // // //         {payload.map((entry, index) => (
// // // //           <div key={index} style={{ color: entry.color }}>
// // // //             {entry.name}: {entry.value}
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     );
// // // //   }
// // // //   return null;
// // // // };

// // // // return (
// // // //   <div className="container-fluid mt-4">

// // // //     {/* ================= FILTER BAR (FULL WIDTH) ================= */}
// // // //     <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">

// // // //       <div>
// // // //         <Link to="/admin" className="text-muted small">
// // // //           ← Back to Overview
// // // //         </Link>
// // // //         <h5 className="mb-0 fw-semibold mt-1">
// // // //           Severity Distribution
// // // //         </h5>
// // // //       </div>

// // // //       <select
// // // //         className="form-select form-select-sm w-auto"
// // // //         value={range}
// // // //         onChange={(e) => {
// // // //           setRange(e.target.value);
// // // //           setStartDate("");
// // // //           setEndDate("");
// // // //           setPage(1);
// // // //           setFiltersKey((k) => k + 1);
// // // //         }}
// // // //       >
// // // //         <option value="all">All time</option>
// // // //         <option value="7d">Last 7 days</option>
// // // //         <option value="30d">Last 30 days</option>
// // // //         <option value="90d">Last 90 days</option>
// // // //       </select>
// // // //     </div>


// // // //     {/* ================= MAIN SPLIT VIEW ================= */}
// // // //     <div className="row">

// // // //       {/* ===== LEFT SIDE → CHART ===== */}
// // // //       <div className="col-md-6 mb-4">
// // // //         <div className="card shadow-sm p-3 h-100">
// // // //           <h6 className="fw-semibold mb-3">Severity Trend</h6>

// // // //           <ResponsiveContainer width="100%" height={350}>
// // // //             <BarChart
// // // //               data={getChartData()}
// // // //               margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
// // // //             >
// // // //               <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
// // // //               <XAxis dataKey="day" />
// // // //               <YAxis />
// // // //               <Tooltip content={<CustomTooltip />} />
// // // //               <Legend />

// // // //               <Bar dataKey="ERROR" stackId="a" fill="#dc3545" barSize={20} />
// // // //               <Bar dataKey="WARN" stackId="a" fill="#ffc107" barSize={20} />
// // // //               <Bar dataKey="INFO" stackId="a" fill="#0dcaf0" barSize={20} />
// // // //               <Bar dataKey="DEBUG" stackId="a" fill="#6c757d" barSize={20} />
// // // //             </BarChart>
// // // //           </ResponsiveContainer>
// // // //         </div>
// // // //       </div>


// // // //       {/* ===== RIGHT SIDE → TABLE ===== */}
// // // //       <div className="col-md-6 mb-4">
// // // //         <div className="card shadow-sm p-3 h-100">
// // // //           <h6 className="fw-semibold mb-3">Detailed View</h6>

// // // //           <table className="table table-sm align-middle">
// // // //             <thead className="border-bottom">
// // // //               <tr>
// // // //                 <th>Date</th>
// // // //                 <th>Severity</th>
// // // //                 <th className="text-end">Count</th>
// // // //               </tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {stats.length === 0 ? (
// // // //                 <tr>
// // // //                   <td colSpan="3" className="text-center text-muted py-4">
// // // //                     No data available
// // // //                   </td>
// // // //                 </tr>
// // // //               ) : (
// // // //                 stats.map((s, i) => (
// // // //                   <tr key={i}>
// // // //                     <td>{s.day}</td>
// // // //                     <td>
// // // //                       <span
// // // //                         className={`badge ${
// // // //                           s.severity === "ERROR"
// // // //                             ? "bg-danger"
// // // //                             : s.severity === "WARN"
// // // //                             ? "bg-warning text-dark"
// // // //                             : s.severity === "INFO"
// // // //                             ? "bg-info"
// // // //                             : "bg-secondary"
// // // //                         }`}
// // // //                       >
// // // //                         {s.severity}
// // // //                       </span>
// // // //                     </td>
// // // //                     <td className="text-end fw-semibold">
// // // //                       {s.count}
// // // //                     </td>
// // // //                   </tr>
// // // //                 ))
// // // //               )}
// // // //             </tbody>
// // // //           </table>

// // // //           {/* Pagination */}
// // // //           <div className="d-flex justify-content-between mt-3">
// // // //             <span className="small text-muted">
// // // //               Page {page} of {totalPages}
// // // //             </span>
// // // //             <div>
// // // //               <button
// // // //                 disabled={page === 1}
// // // //                 onClick={() => setPage(p => p - 1)}
// // // //                 className="btn btn-sm btn-outline-secondary me-2"
// // // //               >
// // // //                 ◀ Prev
// // // //               </button>
// // // //               <button
// // // //                 disabled={page === totalPages}
// // // //                 onClick={() => setPage(p => p + 1)}
// // // //                 className="btn btn-sm btn-outline-secondary"
// // // //               >
// // // //                 Next ▶
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //     </div>
// // // //   </div>
// // // // );
// // // // }
// // // import { useEffect, useState } from "react";
// // // import api from "../../api/axios";
// // // import { Link } from "react-router-dom";
// // // import {
// // //   LineChart,
// // //   Line,
// // //   BarChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   Tooltip,
// // //   Legend,
// // //   CartesianGrid,
// // //   ResponsiveContainer,
// // // } from "recharts";

// // // export default function SeverityDistributionPage() {

// // //   /* ================= STATES ================= */
// // //   const [stats, setStats] = useState([]);
// // //   const [chartDataRaw, setChartDataRaw] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const [range, setRange] = useState("all");
// // //   const [startDate, setStartDate] = useState("");
// // //   const [endDate, setEndDate] = useState("");
// // //   const [filtersKey, setFiltersKey] = useState(0);

// // //   const [page, setPage] = useState(1);
// // //   const pageSize = 10;
// // //   const [total, setTotal] = useState(0);
// // //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// // //   /* ================= DATE FORMAT ================= */
// // //   const toBackendDate = (date) => {
// // //     if (!date) return undefined;
// // //     const [yyyy, mm, dd] = date.split("-");
// // //     return `${dd}-${mm}-${yyyy}`;
// // //   };

// // //   /* ================= LOAD TABLE ================= */
// // //   const loadStats = async () => {
// // //     try {
// // //       setLoading(true);

// // //       const res = await api.get("/logs/summary/severity-per-day/all", {
// // //         params: {
// // //           range: range !== "all" ? range : undefined,
// // //           start_date: toBackendDate(startDate),
// // //           end_date: toBackendDate(endDate),
// // //           page,
// // //           page_size: pageSize,
// // //         },
// // //       });

// // //       setStats(res.data.data || []);
// // //       setTotal(res.data.total || 0);

// // //     } catch (err) {
// // //       setStats([]);
// // //       setTotal(0);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
// // //   console.log(stats)
// // //   /* ================= LOAD CHART ================= */
// // //   // const loadChartData = async () => {
// // //   //   try {
// // //   //     const res = await api.get("/logs/summary/severity-per-day/all", {
// // //   //       params: {
// // //   //         range: range !== "all" ? range : undefined,
// // //   //         start_date: toBackendDate(startDate),
// // //   //         end_date: toBackendDate(endDate),
// // //   //       },
// // //   //     });

// // //   //     setChartDataRaw(res.data.data || []);
// // //   //   } catch (err) {
// // //   //     setChartDataRaw([]);
// // //   //   }
// // //   // };
// // // const loadChartData = async () => {
// // //   const res = await api.get("/logs/summary/severity-trend", {
// // //     params: {
// // //       range: range !== "all" ? range : undefined,
// // //       start_date: toBackendDate(startDate),
// // //       end_date: toBackendDate(endDate),
// // //     },
// // //   });

// // //   setChartDataRaw(res.data.data || []);
// // // };

// // //   /* ================= TRANSFORM CHART DATA ================= */
// // //   const getChartData = () => {
// // //   const map = {};

// // //   chartDataRaw.forEach((item) => {
// // //     if (!map[item.period]) {
// // //       map[item.period] = {
// // //         period: item.period,
// // //         ERROR: 0,
// // //         WARN: 0,
// // //         INFO: 0,
// // //         DEBUG: 0,
// // //         FATAL: 0,
// // //       };
// // //     }

// // //     map[item.period][item.severity] = item.count;
// // //   });

// // //   return Object.values(map);
// // // };


// // //   /* ================= EFFECTS ================= */

// // //   // Table reloads on page change
// // //   useEffect(() => {
// // //     loadStats();
// // //   }, [range, page, filtersKey]);

// // //   // Chart reloads only on filter change
// // //   useEffect(() => {
// // //     loadChartData();
// // //   }, [range, filtersKey]);

// // //   // Auto-reset invalid page
// // //   useEffect(() => {
// // //     if (page > totalPages) {
// // //       setPage(1);
// // //     }
// // //   }, [totalPages]);

// // //   /* ================= APPLY / CLEAR ================= */
// // //   const applyDateFilter = () => {
// // //     if (startDate && endDate && startDate > endDate) {
// // //       alert("Start date cannot be after end date");
// // //       return;
// // //     }

// // //     setRange("all");
// // //     setPage(1);
// // //     setFiltersKey((k) => k + 1);
// // //   };

// // //   const clearDateFilter = () => {
// // //     setStartDate("");
// // //     setEndDate("");
// // //     setRange("all");
// // //     setPage(1);
// // //     setFiltersKey((k) => k + 1);
// // //   };

// // //   /* ================= CUSTOM TOOLTIP ================= */
// // //   const CustomTooltip = ({ active, payload, label }) => {
// // //     if (active && payload && payload.length) {
// // //       return (
// // //         <div
// // //           style={{
// // //             background: "#fff",
// // //             padding: "10px 15px",
// // //             borderRadius: "8px",
// // //             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// // //             fontSize: "13px",
// // //           }}
// // //         >
// // //           <strong>{label}</strong>
// // //           <hr style={{ margin: "5px 0" }} />
// // //           {payload.map((entry, index) => (
// // //             <div key={index} style={{ color: entry.color }}>
// // //               {entry.name}: {entry.value}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       );
// // //     }
// // //     return null;
// // //   };

// // //   /* ================= UI ================= */
// // //   return (
// // //     <div className="container-fluid mt-4">

// // //       {/* ===== FILTER BAR ===== */}
// // //       <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
// // //         <div>
// // //           <Link to="/admin" className="text-muted small">
// // //             ← Back to Overview
// // //           </Link>
// // //           <h5 className="mb-0 fw-semibold mt-1">
// // //             Severity Distribution
// // //           </h5>
// // //         </div>

// // //         <select
// // //           className="form-select form-select-sm w-auto"
// // //           value={range}
// // //           onChange={(e) => {
// // //             setRange(e.target.value);
// // //             setStartDate("");
// // //             setEndDate("");
// // //             setPage(1);
// // //             setFiltersKey((k) => k + 1);
// // //           }}
// // //         >
// // //           <option value="all">All time</option>
// // //           <option value="7d">Last 7 days</option>
// // //           <option value="30d">Last 30 days</option>
// // //           <option value="90d">Last 90 days</option>
// // //         </select>
// // //       </div>

// // //       {/* ===== SPLIT VIEW ===== */}
// // //       <div className="row">

// // //         {/* ===== CHART ===== */}
// // //         <div className="col-md-6 mb-4">
// // //           <div className="card shadow-sm p-3 h-100">
// // //             <h6 className="fw-semibold mb-3">Severity Trend</h6>

// // //             {chartDataRaw.length === 0 ? (
// // //               <div className="text-muted text-center py-5">
// // //                 No chart data available
// // //               </div>
// // //             ) : (
// // //               <ResponsiveContainer width="100%" height={350}>
// // //   <LineChart data={getChartData()}>
// // //     <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
// // //     <XAxis
// // //       dataKey="period"
// // //       angle={-45}
// // //       textAnchor="end"
// // //       height={60}
// // //     />
// // //     <YAxis />
// // //     <Tooltip content={<CustomTooltip />} />
// // //     <Legend />

// // //     <Line type="monotone" dataKey="ERROR" stroke="#dc3545" />
// // //     <Line type="monotone" dataKey="WARN" stroke="#ffc107" />
// // //     <Line type="monotone" dataKey="INFO" stroke="#0dcaf0" />
// // //     <Line type="monotone" dataKey="DEBUG" stroke="#6c757d" />
// // //     <Line type="monotone" dataKey="FATAL" stroke="#000000" />
// // //   </LineChart>
// // // </ResponsiveContainer>

// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* ===== TABLE ===== */}
// // //         <div className="col-md-6 mb-4">
// // //           <div className="card shadow-sm p-3 h-100">
// // //             <h6 className="fw-semibold mb-3">Detailed View</h6>

// // //             <table className="table table-sm align-middle">
// // //               <thead className="border-bottom">
// // //                 <tr>
// // //                   <th>Date</th>
// // //                   <th>Severity</th>
// // //                   <th className="text-end">Count</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {loading ? (
// // //                   <tr>
// // //                     <td colSpan="3" className="text-center py-4">
// // //                       <span className="text-muted">Loading...</span>
// // //                     </td>
// // //                   </tr>
// // //                 ) : total === 0 ? (
// // //                   <tr>
// // //                     <td colSpan="3" className="text-center py-4">
// // //                       <span className="text-muted">
// // //                         No data found for selected filters
// // //                       </span>
// // //                     </td>
// // //                   </tr>
// // //                 ) : (
// // //                   stats.map((s, i) => (
// // //                     <tr key={i}>
// // //                       <td>{s.day}</td>
// // //                       <td>
// // //                         <span
// // //                           className={`badge ${
// // //                             s.severity === "ERROR"
// // //                               ? "bg-danger"
// // //                               : s.severity === "WARN"
// // //                               ? "bg-warning text-dark"
// // //                               : s.severity === "INFO"
// // //                               ? "bg-info"
// // //                               : "bg-secondary"
// // //                           }`}
// // //                         >
// // //                           {s.severity}
// // //                         </span>
// // //                       </td>
// // //                       <td className="text-end fw-semibold">
// // //                         {s.count}
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>

// // //             {/* Pagination */}
// // //             {!loading && total > 0 && (
// // //               <div className="d-flex justify-content-between mt-3">
// // //                 <span className="small text-muted">
// // //                   Page {page} of {totalPages}
// // //                 </span>
// // //                 <div>
// // //                   <button
// // //                     disabled={page === 1}
// // //                     onClick={() => setPage(p => p - 1)}
// // //                     className="btn btn-sm btn-outline-secondary me-2"
// // //                   >
// // //                     ◀ Prev
// // //                   </button>
// // //                   <button
// // //                     disabled={page === totalPages}
// // //                     onClick={() => setPage(p => p + 1)}
// // //                     className="btn btn-sm btn-outline-secondary"
// // //                   >
// // //                     Next ▶
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             )}

// // //           </div>
// // //         </div>

// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useState } from "react";
// // import api from "../../api/axios";
// // import { Link } from "react-router-dom";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   Legend,
// //   CartesianGrid,
// //   ResponsiveContainer,
// // } from "recharts";

// // export default function SeverityDistributionPage() {

// //   /* ================= STATES ================= */
// //   const [stats, setStats] = useState([]);
// //   const [chartDataRaw, setChartDataRaw] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [range, setRange] = useState("all");
// //   const [startDate, setStartDate] = useState("");
// //   const [endDate, setEndDate] = useState("");
// //   const [filtersKey, setFiltersKey] = useState(0);

// //   const [page, setPage] = useState(1);
// //   const pageSize = 10;
// //   const [total, setTotal] = useState(0);
// //   const totalPages = Math.max(1, Math.ceil(total / pageSize));

// //   /* ================= DATE FORMAT ================= */
// //   const toBackendDate = (date) => {
// //     if (!date) return undefined;
// //     const [yyyy, mm, dd] = date.split("-");
// //     return `${dd}-${mm}-${yyyy}`;
// //   };

// //   /* ================= LOAD TABLE ================= */
// //   const loadStats = async () => {
// //     try {
// //       setLoading(true);

// //       const res = await api.get("/logs/summary/severity-trend", {
// //         params: {
// //           range: range !== "all" ? range : undefined,
// //           start_date: toBackendDate(startDate),
// //           end_date: toBackendDate(endDate),
// //           page,
// //           page_size: pageSize,
// //         },
// //       });

// //       setStats(res.data.data || []);
// //       setTotal(res.data.total || 0);

// //     } catch (err) {
// //       setStats([]);
// //       setTotal(0);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ================= LOAD CHART ================= */
// //   const loadChartData = async () => {
// //     try {
// //       const res = await api.get("/logs/summary/severity-trend", {
// //         params: {
// //           range: range !== "all" ? range : undefined,
// //           start_date: toBackendDate(startDate),
// //           end_date: toBackendDate(endDate),
// //           page: 1,
// //           page_size: 200, // large for full trend
// //         },
// //       });

// //       setChartDataRaw(res.data.data || []);
// //     } catch {
// //       setChartDataRaw([]);
// //     }
// //   };

// //   /* ================= TRANSFORM FOR CHART ================= */
// //   const getChartData = () => {
// //     const map = {};

// //     chartDataRaw.forEach((item) => {
// //       if (!map[item.period]) {
// //         map[item.period] = {
// //           period: item.period,
// //           ERROR: 0,
// //           WARN: 0,
// //           INFO: 0,
// //           DEBUG: 0,
// //           FATAL: 0,
// //         };
// //       }

// //       map[item.period][item.severity] = item.count;
// //     });

// //     return Object.values(map);
// //   };

// //   /* ================= EFFECTS ================= */

// //   useEffect(() => {
// //     loadStats();
// //   }, [range, page, filtersKey]);

// //   useEffect(() => {
// //     loadChartData();
// //   }, [range, filtersKey]);

// //   useEffect(() => {
// //     if (page > totalPages) {
// //       setPage(1);
// //     }
// //   }, [totalPages]);

// //   /* ================= CUSTOM TOOLTIP ================= */
// //   const CustomTooltip = ({ active, payload, label }) => {
// //     if (active && payload && payload.length) {
// //       return (
// //         <div
// //           style={{
// //             background: "#fff",
// //             padding: "10px 15px",
// //             borderRadius: "8px",
// //             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
// //             fontSize: "13px",
// //           }}
// //         >
// //           <strong>{label}</strong>
// //           <hr style={{ margin: "5px 0" }} />
// //           {payload.map((entry, index) => (
// //             <div key={index} style={{ color: entry.color }}>
// //               {entry.name}: {entry.value}
// //             </div>
// //           ))}
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   /* ================= UI ================= */
// //   return (
// //     <div className="container-fluid mt-4">

// //       {/* HEADER */}
// //       <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
// //         <div>
// //           <Link to="/admin" className="text-muted small">
// //             ← Back to Overview
// //           </Link>
// //           <h5 className="mt-1 fw-semibold">Severity Distribution</h5>
// //         </div>

// //         <select
// //           className="form-select form-select-sm w-auto"
// //           value={range}
// //           onChange={(e) => {
// //             setRange(e.target.value);
// //             setPage(1);
// //             setFiltersKey((k) => k + 1);
// //           }}
// //         >
// //           <option value="all">All time</option>
// //           <option value="7d">Last 7 days</option>
// //           <option value="30d">Last 30 days</option>
// //           <option value="90d">Last 90 days</option>
// //         </select>
// //       </div>

// //       <div className="row">

// //         {/* CHART */}
// //         <div className="col-md-6 mb-4">
// //           <div className="card shadow-sm p-3 h-100">
// //             <h6 className="fw-semibold mb-3">Severity Trend</h6>

// //             {chartDataRaw.length === 0 ? (
// //               <div className="text-muted text-center py-5">
// //                 No chart data available
// //               </div>
// //             ) : (
// //               <ResponsiveContainer width="100%" height={350}>
// //                 <LineChart data={getChartData()}>
// //                   <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
// //                   <XAxis
// //                     dataKey="period"
// //                     angle={-45}
// //                     textAnchor="end"
// //                     height={60}
// //                   />
// //                   <YAxis />
// //                   <Tooltip content={<CustomTooltip />} />
// //                   <Legend />
// //                   <Line type="monotone" dataKey="ERROR" stroke="#dc3545" />
// //                   <Line type="monotone" dataKey="WARN" stroke="#ffc107" />
// //                   <Line type="monotone" dataKey="INFO" stroke="#0dcaf0" />
// //                   <Line type="monotone" dataKey="DEBUG" stroke="#6c757d" />
// //                   <Line type="monotone" dataKey="FATAL" stroke="#000000" />
// //                 </LineChart>
// //               </ResponsiveContainer>
// //             )}
// //           </div>
// //         </div>

// //         {/* TABLE */}
// //         <div className="col-md-6 mb-4">
// //           <div className="card shadow-sm p-3 h-100">
// //             <h6 className="fw-semibold mb-3">Detailed View</h6>

// //             <table className="table table-sm align-middle">
// //               <thead className="border-bottom">
// //                 <tr>
// //                   <th>Period</th>
// //                   <th>Severity</th>
// //                   <th className="text-end">Count</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {loading ? (
// //                   <tr>
// //                     <td colSpan="3" className="text-center py-4">
// //                       Loading...
// //                     </td>
// //                   </tr>
// //                 ) : total === 0 ? (
// //                   <tr>
// //                     <td colSpan="3" className="text-center py-4 text-muted">
// //                       No data found
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   stats.map((s, i) => (
// //                     <tr key={i}>
// //                       <td>{s.period}</td>
// //                       <td>
// //                         <span
// //                           className={`badge ${
// //                             s.severity === "ERROR"
// //                               ? "bg-danger"
// //                               : s.severity === "WARN"
// //                               ? "bg-warning text-dark"
// //                               : s.severity === "INFO"
// //                               ? "bg-info"
// //                               : "bg-secondary"
// //                           }`}
// //                         >
// //                           {s.severity}
// //                         </span>
// //                       </td>
// //                       <td className="text-end fw-semibold">
// //                         {s.count}
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>

// //             {!loading && total > 0 && (
// //               <div className="d-flex justify-content-between mt-3">
// //                 <span className="small text-muted">
// //                   Page {page} of {totalPages}
// //                 </span>
// //                 <div>
// //                   <button
// //                     disabled={page === 1}
// //                     onClick={() => setPage(p => p - 1)}
// //                     className="btn btn-sm btn-outline-secondary me-2"
// //                   >
// //                     ◀ Prev
// //                   </button>
// //                   <button
// //                     disabled={page === totalPages}
// //                     onClick={() => setPage(p => p + 1)}
// //                     className="btn btn-sm btn-outline-secondary"
// //                   >
// //                     Next ▶
// //                   </button>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }
// import { useEffect, useState, useMemo } from "react";
// import api from "../../api/axios";
// import { Link } from "react-router-dom";
// import {
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// export default function SeverityDistributionPage() {

//   const [stats, setStats] = useState([]);
//   const [chartDataRaw, setChartDataRaw] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [range, setRange] = useState("all");
//   const [page, setPage] = useState(1);
//   const pageSize = 10;
//   const [total, setTotal] = useState(0);

//   const totalPages = Math.max(1, Math.ceil(total / pageSize));

//   /* ================= LOAD DATA ================= */
//   const loadData = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get("/logs/summary/severity-trend", {
//         params: {
//           range: range !== "all" ? range : undefined,
//           page,
//           page_size: pageSize,
//         },
//       });

//       setStats(res.data.data || []);
//       setTotal(res.data.total || 0);

//       // fetch full data for charts
//       const chartRes = await api.get("/logs/summary/severity-trend", {
//         params: {
//           range: range !== "all" ? range : undefined,
//           page: 1,
//           page_size: 200,
//         },
//       });

//       setChartDataRaw(chartRes.data.data || []);

//     } catch {
//       setStats([]);
//       setChartDataRaw([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, [range, page]);

//   /* ================= TRANSFORM FOR AREA ================= */
//   const areaData = useMemo(() => {
//     const map = {};

//     chartDataRaw.forEach((item) => {
//       if (!map[item.period]) {
//         map[item.period] = {
//           period: item.period,
//           ERROR: 0,
//           WARN: 0,
//           INFO: 0,
//           DEBUG: 0,
//           FATAL: 0,
//         };
//       }
//       map[item.period][item.severity] = item.count;
//     });

//     return Object.values(map);
//   }, [chartDataRaw]);

//   /* ================= KPI CALCULATIONS ================= */
//   const kpis = useMemo(() => {
//     let totalLogs = 0;
//     let errorCount = 0;
//     let peakPeriod = "";
//     let peakValue = 0;

//     areaData.forEach((row) => {
//       const rowTotal =
//         row.ERROR + row.WARN + row.INFO + row.DEBUG + row.FATAL;

//       totalLogs += rowTotal;
//       errorCount += row.ERROR;

//       if (row.ERROR > peakValue) {
//         peakValue = row.ERROR;
//         peakPeriod = row.period;
//       }
//     });

//     const errorRate =
//       totalLogs > 0 ? ((errorCount / totalLogs) * 100).toFixed(1) : 0;

//     return { totalLogs, errorCount, errorRate, peakPeriod };
//   }, [areaData]);

//   /* ================= DONUT DATA ================= */
//   const donutData = useMemo(() => {
//     const totals = {};

//     chartDataRaw.forEach((item) => {
//       totals[item.severity] =
//         (totals[item.severity] || 0) + item.count;
//     });

//     return Object.keys(totals).map((key) => ({
//       name: key,
//       value: totals[key],
//     }));
//   }, [chartDataRaw]);

//   const COLORS = ["#dc3545", "#ffc107", "#0dcaf0", "#6c757d", "#000000"];

//   return (
//     <div className="container-fluid mt-4">

//       {/* HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <Link to="/admin" className="text-muted small">
//             ← Back
//           </Link>
//           <h5 className="mt-1 fw-semibold">Severity Analytics</h5>
//         </div>

//         <select
//           className="form-select form-select-sm w-auto"
//           value={range}
//           onChange={(e) => {
//             setRange(e.target.value);
//             setPage(1);
//           }}
//         >
//           <option value="all">All time</option>
//           <option value="7d">Last 7 days</option>
//           <option value="30d">Last 30 days</option>
//           <option value="90d">Last 90 days</option>
//         </select>
//       </div>

//       {/* KPI CARDS */}
//       <div className="row mb-4">
//         <div className="col-md-3">
//           <div className="card shadow-sm p-3">
//             <small>Total Logs</small>
//             <h4>{kpis.totalLogs}</h4>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow-sm p-3">
//             <small>Total Errors</small>
//             <h4 className="text-danger">{kpis.errorCount}</h4>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow-sm p-3">
//             <small>Error Rate</small>
//             <h4>{kpis.errorRate}%</h4>
//           </div>
//         </div>

//         <div className="col-md-3">
//           <div className="card shadow-sm p-3">
//             <small>Peak Error Period</small>
//             <h6>{kpis.peakPeriod || "-"}</h6>
//           </div>
//         </div>
//       </div>

//       {/* CHART ROW */}
//       <div className="row mb-4">

//         {/* AREA CHART */}
//         <div className="col-md-8">
//           <div className="card shadow-sm p-3">
//             <h6 className="fw-semibold mb-3">Severity Trend</h6>

//             <ResponsiveContainer width="100%" height={350}>
//               <AreaChart data={areaData}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                 <XAxis dataKey="period" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Area type="monotone" dataKey="ERROR" stackId="1" fill="#dc3545" />
//                 <Area type="monotone" dataKey="WARN" stackId="1" fill="#ffc107" />
//                 <Area type="monotone" dataKey="INFO" stackId="1" fill="#0dcaf0" />
//                 <Area type="monotone" dataKey="DEBUG" stackId="1" fill="#6c757d" />
//                 <Area type="monotone" dataKey="FATAL" stackId="1" fill="#000000" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* DONUT */}
//         <div className="col-md-4">
//           <div className="card shadow-sm p-3">
//             <h6 className="fw-semibold mb-3">Severity Distribution</h6>

//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={donutData}
//                   dataKey="value"
//                   nameKey="name"
//                   outerRadius={100}
//                   label
//                 >
//                   {donutData.map((entry, index) => (
//                     <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="card shadow-sm p-3">
//         <h6 className="fw-semibold mb-3">Detailed View</h6>

//         <table className="table table-sm align-middle">
//           <thead>
//             <tr>
//               <th>Period</th>
//               <th>Severity</th>
//               <th className="text-end">Count</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="3" className="text-center">Loading...</td>
//               </tr>
//             ) : stats.map((s, i) => (
//               <tr key={i}>
//                 <td>{s.period}</td>
//                 <td>
//                   <span className={`badge ${
//                     s.severity === "ERROR" ? "bg-danger" :
//                     s.severity === "WARN" ? "bg-warning text-dark" :
//                     s.severity === "INFO" ? "bg-info" :
//                     "bg-secondary"
//                   }`}>
//                     {s.severity}
//                   </span>
//                 </td>
//                 <td className="text-end fw-semibold">{s.count}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {!loading && (
//           <div className="d-flex justify-content-between">
//             <span className="small text-muted">
//               Page {page} of {totalPages}
//             </span>
//             <div>
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage(p => p - 1)}
//                 className="btn btn-sm btn-outline-secondary me-2"
//               >
//                 ◀ Prev
//               </button>
//               <button
//                 disabled={page === totalPages}
//                 onClick={() => setPage(p => p + 1)}
//                 className="btn btn-sm btn-outline-secondary"
//               >
//                 Next ▶
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }
import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";


export default function SeverityDistributionPage() {

  const [stats, setStats] = useState([]);
  const [chartDataRaw, setChartDataRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      // Paginated data (table)
      const res = await api.get("/logs/summary/severity-trend", {
        params: {
          range: range !== "all" ? range : undefined,
          page,
          page_size: pageSize,
        },
      });

      setStats(res.data.data || []);
      setTotal(res.data.total || 0);

      // Full data for charts
      const chartRes = await api.get("/logs/summary/severity-trend", {
        params: {
          range: range !== "all" ? range : undefined,
          page: 1,
          page_size: 200,
        },
      });

      setChartDataRaw(chartRes.data.data || []);

    } catch (err) {
      setStats([]);
      setChartDataRaw([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [range, page]);

  /* ================= TRANSFORM FOR STACKED BAR ================= */
  const chartData = useMemo(() => {
    const map = {};

    chartDataRaw.forEach((item) => {
      if (!map[item.period]) {
        map[item.period] = {
          period: item.period,
          ERROR: 0,
          WARN: 0,
          INFO: 0,
          DEBUG: 0,
          FATAL: 0,
        };
      }
      map[item.period][item.severity] = item.count;
    });

    return Object.values(map);
  }, [chartDataRaw]);

  /* ================= KPI CALCULATIONS ================= */
  const kpis = useMemo(() => {
    let totalLogs = 0;
    let totalErrors = 0;
    let peakPeriod = "";
    let peakValue = 0;

    chartData.forEach((row) => {
      const rowTotal =
        row.ERROR + row.WARN + row.INFO + row.DEBUG + row.FATAL;

      totalLogs += rowTotal;
      totalErrors += row.ERROR;

      if (row.ERROR > peakValue) {
        peakValue = row.ERROR;
        peakPeriod = row.period;
      }
    });

    const errorRate =
      totalLogs > 0 ? ((totalErrors / totalLogs) * 100).toFixed(1) : 0;

    return { totalLogs, totalErrors, errorRate, peakPeriod };
  }, [chartData]);

  /* ================= DONUT DATA ================= */
  const donutData = useMemo(() => {
    const totals = {};

    chartDataRaw.forEach((item) => {
      totals[item.severity] =
        (totals[item.severity] || 0) + item.count;
    });

    return Object.keys(totals).map((key) => ({
      name: key,
      value: totals[key],
    }));
  }, [chartDataRaw]);

  const COLORS = ["#dc3545", "#ffc107", "#0dcaf0", "#6c757d", "#000000"];

  return (
    <div className="container-fluid mt-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/admin" className="text-muted small">
            ← Back
          </Link>
          <h5 className="mt-1 fw-semibold">Severity Analytics Dashboard</h5>
        </div>

        <select
          className="form-select form-select-sm w-auto"
          value={range}
          onChange={(e) => {
            setRange(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <small>Total Logs</small>
            <h4>{kpis.totalLogs}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <small>Total Errors</small>
            <h4 className="text-danger">{kpis.totalErrors}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <small>Error Rate</small>
            <h4>{kpis.errorRate}%</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <small>Peak Error Period</small>
            <h6>{kpis.peakPeriod || "-"}</h6>
          </div>
        </div>
      </div>

      {/* ================= CHART ROW ================= */}
      <div className="row mb-4">

        {/* STACKED BAR CHART */}
        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h6 className="fw-semibold mb-3">Severity Trend</h6>

            <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={chartData}
    barGap={4}
    barCategoryGap="25%"
  >
    <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
    <XAxis
      dataKey="period"
      tick={{ fontSize: 12 }}
    />
    <YAxis tick={{ fontSize: 12 }} />
    <Tooltip />
    <Legend wrapperStyle={{ fontSize: "12px" }} />

    <Bar dataKey="ERROR" fill="#dc3545" barSize={12} />
    <Bar dataKey="WARN" fill="#ffc107" barSize={12} />
    <Bar dataKey="INFO" fill="#0dcaf0" barSize={12} />
    <Bar dataKey="DEBUG" fill="#6c757d" barSize={12} />
    <Bar dataKey="FATAL" fill="#000000" barSize={12} />
  </BarChart>
</ResponsiveContainer>

          </div>
        </div>

        {/* DONUT CHART */}
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h6 className="fw-semibold mb-3">Overall Distribution</h6>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {donutData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card shadow-sm p-3">
        <h6 className="fw-semibold mb-3">Detailed View</h6>

        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Period</th>
              <th>Severity</th>
              <th className="text-end">Count</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center">Loading...</td>
              </tr>
            ) : stats.map((s, i) => (
              <tr key={i}>
                <td>{s.period}</td>
                <td>
                  <span className={`badge ${
                    s.severity === "ERROR" ? "bg-danger" :
                    s.severity === "WARN" ? "bg-warning text-dark" :
                    s.severity === "INFO" ? "bg-info" :
                    "bg-secondary"
                  }`}>
                    {s.severity}
                  </span>
                </td>
                <td className="text-end fw-semibold">{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && (
          <div className="d-flex justify-content-between">
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
  );
}
