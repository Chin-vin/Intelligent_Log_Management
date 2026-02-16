import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <>
     
          {/* CONTENT */}
          <div className="col-md-10 p-4">
            <Outlet />
          </div>

        
    </>
  );
}
