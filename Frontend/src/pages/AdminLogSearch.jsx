// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import Navbar from "../components/Navbar";
// import Pagination from "../components/Pagination";

// export default function AdminLogSearch() {
//   /* ---------------- STATE ---------------- */
//   const [filters, setFilters] = useState({
//     start_date: "",
//     end_date: "",
//     severity_id: "",
//     category_id: "",
//     keyword: "",
//   });

//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [severities, setSeverities] = useState([]);
//   const [categories, setCategories] = useState([]);

//   /* ---------------- PAGINATION ---------------- */
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(25);
//   const [total, setTotal] = useState(0);

//   /* ---------------- HELPERS ---------------- */
//   const toDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "";
//     const [y, m, d] = dateStr.split("-");
//     return `${d}-${m}-${y}`;
//   };

//   const handleChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const severityMap = Object.fromEntries(
//     severities.map((s) => [s.severity_id, s.severity_code])
//   );

//   const categoryMap = Object.fromEntries(
//     categories.map((c) => [c.category_id, c.category_name])
//   );

//   const severityBadgeClass = (code) => {
//     switch (code?.toUpperCase()) {
//       case "INFO":
//         return "bg-info text-dark";
//       case "WARN":
//       case "WARNING":
//         return "bg-warning text-dark";
//       case "ERROR":
//         return "bg-danger";
//       case "DEBUG":
//         return "bg-secondary";
//       case "SECURITY":
//       case "CRITICAL":
//         return "bg-dark";
//       default:
//         return "bg-light text-dark";
//     }
//   };

//   /* ---------------- LOAD LOOKUPS ---------------- */
//   useEffect(() => {
//     Promise.all([
//       api.get("/lookups/severities"),
//       api.get("/lookups/categories"),
//     ]).then(([sev, cat]) => {
//       setSeverities(sev.data || []);
//       setCategories(cat.data || []);
//     });
//   }, []);

//   /* ---------------- SEARCH ---------------- */
//   const searchLogs = async () => {
//     try {
//       setLoading(true);

//       const params = {
//         page,
//         page_size: pageSize,
//       };

//       if (filters.start_date)
//         params.start_date = toDDMMYYYY(filters.start_date);

//       if (filters.end_date)
//         params.end_date = toDDMMYYYY(filters.end_date);

//       if (filters.severity_id)
//         params.severity_id = Number(filters.severity_id);

//       if (filters.category_id)
//         params.category_id = Number(filters.category_id);

//       if (filters.keyword)
//         params.keyword = filters.keyword;

//       const res = await api.get("/admin/logs/search", { params });

//       setLogs(Array.isArray(res.data.data) ? res.data.data : []);
//       setTotal(res.data.total || 0);
//       console.log(res.data)
//     } catch (err) {
//       console.error("Search failed", err);
//       setLogs([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- AUTO RELOAD ---------------- */
//   useEffect(() => {
//     searchLogs();
//   }, [page, pageSize]);

//   /* ---------------- UI ---------------- */
//   return (
//     <>
//       <Navbar />

//       <div className="container-fluid mt-4">
//         <h4 className="mb-3">Admin Log Search</h4>

//         {/* FILTERS */}
//         <div className="card shadow-sm p-3 mb-4">
//           <div className="row g-3">
//             <div className="col-md-3">
//               <label className="form-label">Start Date</label>
//               <input type="date" name="start_date" className="form-control" onChange={handleChange} />
//             </div>

//             <div className="col-md-3">
//               <label className="form-label">End Date</label>
//               <input type="date" name="end_date" className="form-control" onChange={handleChange} />
//             </div>

//             <div className="col-md-2">
//               <label className="form-label">Severity</label>
//               <select name="severity_id" className="form-select" onChange={handleChange}>
//                 <option value="">All</option>
//                 {severities.map(s => (
//                   <option key={s.severity_id} value={s.severity_id}>
//                     {s.severity_code}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-2">
//               <label className="form-label">Category</label>
//               <select name="category_id" className="form-select" onChange={handleChange}>
//                 <option value="">All</option>
//                 {categories.map(c => (
//                   <option key={c.category_id} value={c.category_id}>
//                     {c.category_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-md-2">
//               <label className="form-label">Keyword</label>
//               <input name="keyword" className="form-control" onChange={handleChange} />
//             </div>
//           </div>

//           <button
//             className="btn btn-primary mt-3"
//             onClick={() => {
//               setPage(1);
//               searchLogs();
//             }}
//           >
//             Search Logs
//           </button>
//         </div>

//         {/* RESULTS */}
//         <div className="card shadow-sm p-3">
//           {/* PAGE SIZE */}
//           <div className="d-flex justify-content-between mb-2">
//             <div>
//               <span className="text-muted small">Show</span>
//               <select
//                 className="form-select form-select-sm d-inline w-auto mx-2"
//                 value={pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                   setPage(1);
//                 }}
//               >
//                 <option value={10}>10</option>
//                 <option value={25}>25</option>
//                 <option value={50}>50</option>
//               </select>
//               <span className="text-muted small">entries</span>
//             </div>

//             {/* <span className="text-muted small">
//               Total: <strong>{total}</strong>
//             </span> */}
//           </div>

//           {loading ? (
//   <p className="text-muted">Loading logs...</p>
// ) : logs.length === 0 ? (
//   <p className="text-muted text-center">No logs found</p>
// ) : (
//   <div className="table-responsive">
//     <table className="table table-sm table-hover align-middle">
//       <thead className="table-light">
//         <tr>
//           <th className="text-nowrap">Time</th>
//           <th>Severity</th>
//           <th>Category</th>
//           <th className="text-nowrap">Host</th>
//           <th className="text-nowrap">Service</th>
//           <th>Message</th>
//         </tr>
//       </thead>

//       <tbody>
//         {logs.map(log => (
//           <tr key={log.log_id}>
//             <td className="text-nowrap">
//               {new Date(log.log_timestamp).toLocaleString()}
//             </td>

//             <td>
//               <span
//                 className={`badge ${severityBadgeClass(
//                   severityMap[log.severity_id]
//                 )}`}
//               >
//                 {severityMap[log.severity_id] || "—"}
//               </span>
//             </td>

//             <td>{categoryMap[log.category_id] || "—"}</td>

//             <td className="text-nowrap">{log.host_name || "—"}</td>
//             <td className="text-nowrap">{log.service_name || "—"}</td>

//             <td
//               className="text-truncate"
//               style={{ maxWidth: 400 }}
//               title={log.message}   // 👈 hover to see full message
//             >
//               {log.message}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// )}

          

//           <Pagination
//             page={page}
//             total={total}
//             pageSize={pageSize}
//             setPage={setPage}
//           />
//         </div>
//       </div>
//     </>
//   );
// }
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";

export default function AdminLogSearch() {
  /* ---------------- STATE ---------------- */
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    severity_id: "",
    category_id: "",
    keyword: "",
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [severities, setSeverities] = useState([]);
  const [categories, setCategories] = useState([]);

  /* ---------------- PAGINATION ---------------- */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);

  /* ---------------- HELPERS ---------------- */
  const toDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      severity_id: "",
      category_id: "",
      keyword: "",
    });
    setPage(1);
    searchLogs(true);
  };

  const severityMap = Object.fromEntries(
    severities.map((s) => [s.severity_id, s.severity_code])
  );

  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.category_id, c.category_name])
  );

  const severityBadgeClass = (code) => {
    switch (code?.toUpperCase()) {
      case "INFO":
        return "bg-info text-dark";
      case "WARN":
      case "WARNING":
        return "bg-warning text-dark";
      case "ERROR":
        return "bg-danger";
      case "DEBUG":
        return "bg-secondary";
      case "SECURITY":
      case "CRITICAL":
        return "bg-dark";
      default:
        return "bg-light text-dark";
    }
  };

  /* ---------------- LOAD LOOKUPS ---------------- */
  useEffect(() => {
    Promise.all([
      api.get("/lookups/severities"),
      api.get("/lookups/categories"),
    ]).then(([sev, cat]) => {
      setSeverities(sev.data || []);
      setCategories(cat.data || []);
    });
  }, []);

  /* ---------------- SEARCH ---------------- */
  const searchLogs = async (ignoreFilters = false) => {
    try {
      setLoading(true);

      const params = {
        page,
        page_size: pageSize,
      };

      if (!ignoreFilters) {
        if (filters.start_date)
          params.start_date = toDDMMYYYY(filters.start_date);

        if (filters.end_date)
          params.end_date = toDDMMYYYY(filters.end_date);

        if (filters.severity_id)
          params.severity_id = Number(filters.severity_id);

        if (filters.category_id)
          params.category_id = Number(filters.category_id);

        if (filters.keyword)
          params.keyword = filters.keyword;
      }

      const res = await api.get("/admin/logs/search", { params });

      setLogs(Array.isArray(res.data.data) ? res.data.data : []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Search failed", err);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- AUTO RELOAD ---------------- */
  useEffect(() => {
    searchLogs();
  }, [page, pageSize]);

  const isFilterEmpty = Object.values(filters).every((v) => !v);
  console.log(logs)
  /* ---------------- UI ---------------- */
  return (
    <>
      <Navbar />

      <div className="container-fluid mt-4">
        <h4 className="mb-3">Admin Log Search</h4>

        {/* FILTERS */}
        <div className="card shadow-sm p-3 mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="start_date"
                className="form-control"
                value={filters.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="end_date"
                className="form-control"
                value={filters.end_date}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Severity</label>
              <select
                name="severity_id"
                className="form-select"
                value={filters.severity_id}
                onChange={handleChange}
              >
                <option value="">All</option>
                {severities.map((s) => (
                  <option key={s.severity_id} value={s.severity_id}>
                    {s.severity_code}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Category</label>
              <select
                name="category_id"
                className="form-select"
                value={filters.category_id}
                onChange={handleChange}
              >
                <option value="">All</option>
                {categories.map((c) => (
                  <option key={c.category_id} value={c.category_id}>
                    {c.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <label className="form-label">Keyword</label>
              <input
                name="keyword"
                className="form-control"
                value={filters.keyword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                setPage(1);
                searchLogs();
              }}
            >
              Search Logs
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={resetFilters}
              disabled={isFilterEmpty}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="card shadow-sm p-3">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <span className="text-muted small">Show</span>
              <select
                className="form-select form-select-sm d-inline w-auto mx-2"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-muted small">entries</span>
            </div>
          </div>

          {loading ? (
            <p className="text-muted">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-muted text-center">No logs found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-nowrap">Time</th>
                    <th>Severity</th>
                    <th>Category</th>
                    <th className="text-nowrap">Host</th>
                    <th className="text-nowrap">Service</th>
                    <th>Message</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr key={log.log_id}>
                      <td className="text-nowrap">
                        {new Date(log.log_timestamp).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`badge ${severityBadgeClass(
                            severityMap[log.severity_id]
                          )}`}
                        >
                          {severityMap[log.severity_id] || "—"}
                        </span>
                      </td>

                      <td>{categoryMap[log.category_id] || "—"}</td>
                      <td className="text-nowrap">{log.host_name || "—"}</td>
                      <td className="text-nowrap">{log.service_name || "—"}</td>

                      <td
                        className="text-truncate"
                        style={{ maxWidth: 400 }}
                        title={log.message}
                      >
                        {log.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            page={page}
            total={total}
            pageSize={pageSize}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
}
