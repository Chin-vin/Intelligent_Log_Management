import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import Navbar from "../components/Navbar";
import "./UserLayout.css";

export default function UserLayout() {
  return (
    <>
      <Navbar />

      <div className="user-wrapper">
        {/* SIDEBAR */}
        <aside className="user-sidebar">
          <UserSidebar />
        </aside>

        {/* CONTENT */}
        <main className="user-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
