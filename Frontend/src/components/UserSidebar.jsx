// import { Link } from "react-router-dom";
// import "./sidebar/Sidebar.css";

// export default function UserSidebar() {
//   return (
//     <div className="sidebar">
//       {/* <h6 className="sidebar-title">USER</h6> */}

//       <Link to="/dashboard" className="sidebar-link">
//         <i className="bi bi-speedometer2 me-2"></i>
//         Overview
//       </Link>

//       <Link to="/dashboard/logs" className="sidebar-link">
//         <i className="bi bi-search me-2"></i>
//         My Logs
//       </Link>

//       <Link to="/dashboard/files" className="sidebar-link">
//         <i className="bi bi-folder2-open me-2"></i>
//         My & Team Files
//       </Link>
//     </div>
//   );
// }
import { NavLink } from "react-router-dom";
import "./sidebar/Sidebar.css";

export default function UserSidebar() {
  return (
    <div className="sidebar">
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        <i className="bi bi-speedometer2"></i>
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/dashboard/logs"
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        <i className="bi bi-search"></i>
        <span>My Logs</span>
      </NavLink>

      <NavLink
        to="/dashboard/files"
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        <i className="bi bi-folder2"></i>
        <span>Files</span>
      </NavLink>
      <NavLink
        to="/dashboard/recycle"
        className={({ isActive }) =>
          `sidebar-link ${isActive ? "active" : ""}`
        }
      >
        <i className="bi bi-trash3"></i>
        <span>Recycle Bin</span>
      </NavLink>
    </div>
  );
}
