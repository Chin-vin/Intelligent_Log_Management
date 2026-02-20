import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "./AdminLayout.css";

export default function AdminLayout() {
  const isResizing = useRef(false);

  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ---------- SCREEN SIZE ---------- */
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* ---------- RESIZE ---------- */
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizing.current || isMobile) return;
      setSidebarWidth(Math.max(64, Math.min(e.clientX, 320)));
    };

    const onMouseUp = () => (isResizing.current = false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isMobile]);

  return (
    <>
      <Navbar onMenuClick={() => setMobileOpen(true)} />

      <div className="admin-wrapper">
        {/* OVERLAY (MOBILE) */}
        {isMobile && mobileOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`admin-sidebar
            ${sidebarWidth <= 72 ? "icon-only" : ""}
            ${isMobile ? "mobile" : ""}
            ${mobileOpen ? "open" : ""}
          `}
          style={{ width: isMobile ? 240 : sidebarWidth }}
        >
          <NavLink to="/admin" end className="sidebar-link" onClick={() => setMobileOpen(false)}>
            <i className="bi bi-speedometer2"></i>
            <span>Overview</span>
          </NavLink>

          <NavLink to="/admin/users" className="sidebar-link" onClick={() => setMobileOpen(false)}>
            <i className="bi bi-people"></i>
            <span>Users</span>
          </NavLink>

          <NavLink to="/admin/create-user" className="sidebar-link" onClick={() => setMobileOpen(false)}>
            <i className="bi bi-person-plus"></i>
            <span>Create User</span>
          </NavLink>

          <NavLink to="/admin/logs" className="sidebar-link" onClick={() => setMobileOpen(false)}>
            <i className="bi bi-search"></i>
            <span>Logs</span>
          </NavLink>
          <NavLink to="/admin/files" className="sidebar-link" onClick={() => setMobileOpen(false)}>
  <i className="bi bi-folder2-open"></i>
  <span>Files</span>
</NavLink>
<NavLink
  to="/admin/deletedFiles"
  className="sidebar-link"
  onClick={() => setMobileOpen(false)}
>
  <i className="bi bi-trash3"></i>
  <span>Deleted & Archived</span>
</NavLink>
<NavLink
  to="/admin/manage-teams"
  className="sidebar-link"
  onClick={() => setMobileOpen(false)}
>
  <i className="bi bi-diagram-3"></i>
  <span>Teams</span>
</NavLink>

          <NavLink
  to="/admin/security/logins"
  className="sidebar-link"
  onClick={() => setMobileOpen(false)}

>
  <i className="bi bi-shield-lock"></i>
  <span>Security</span>
</NavLink>
<NavLink
  to="/admin/security/audit-trail"
  className="sidebar-link"
  onClick={() => setMobileOpen(false)}
>
  <i className="bi bi-shield-lock"></i>
  <span>Audit Trail</span>
</NavLink>


          {/* RESIZE HANDLE (DESKTOP ONLY) */}
          {!isMobile && (
            <div
              className="resize-handle"
              onMouseDown={() => (isResizing.current = true)}
            />
          )}
        </aside>

        {/* CONTENT */}
        <main
          className="admin-content"
          style={{
            marginLeft: isMobile ? 0 : sidebarWidth,
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}
