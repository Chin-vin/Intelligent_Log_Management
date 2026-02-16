import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-root">

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container text-center">
          <h1 className="hero-title">
            Intelligent Log & File Management System
          </h1>

          <p className="hero-subtitle">
            A centralized platform to upload, clean, classify, search, and analyze
            system logs across teams — simple, structured, and efficient.
          </p>

          <div className="hero-actions">
           

            <Link to="/login" className="btn btn-outline-light btn-lg">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">
            What This System Does
          </h2>

          <div className="row g-4 mt-4">
            <Feature
              icon="bi-upload"
              title="Log & File Upload"
              text="Upload logs in TXT, JSON, CSV, or XML formats with automatic metadata tracking."
            />

            <Feature
              icon="bi-funnel"
              title="Log Cleaning & Parsing"
              text="Automatically removes empty or duplicate entries and extracts structured fields."
            />

            <Feature
              icon="bi-tags"
              title="Automatic Categorization"
              text="Logs are classified into Application, Security, Infrastructure, Audit, or Uncategorized."
            />

            <Feature
              icon="bi-search"
              title="Advanced Search"
              text="Filter logs by date, severity, category, keyword, user, team, or file."
            />

            <Feature
              icon="bi-graph-up"
              title="Dashboards & Insights"
              text="Visual summaries like error trends, active systems, and severity distribution."
            />

            <Feature
              icon="bi-shield-lock"
              title="Role-Based Access"
              text="Admins manage users and teams; users access only their own and team data."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="workflow-section">
        <div className="container">
          <h2 className="section-title text-center">
            How It Works
          </h2>

          <div className="row text-center mt-4">
  <Step number="1" text="Upload Log Files" />
  <Step number="2" text="Parse & Clean Logs" />
  <Step number="3" text="Categorize Automatically" />
  <Step number="4" text="Search & Analyze" />
  <Step number="5" text="Archive & Audit" />
</div>

        </div>
      </section>

      {/* USER VS ADMIN */}
      <section className="roles-section">
        <div className="container">
          <h2 className="section-title text-center">
            Built for Users & Admins
          </h2>

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="role-card">
                <h5>User Capabilities</h5>
                <ul>
                  <li>Upload and manage log files</li>
                  <li>Search personal and team logs</li>
                  <li>View log summaries and statistics</li>
                  <li>Edit personal profile details</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="role-card">
                <h5>Admin Capabilities</h5>
                <ul>
                  <li>User & team management</li>
                  <li>System-wide log visibility</li>
                  <li>Audit trail monitoring</li>
                  <li>Retention & archival control</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container text-center">
          <p className="mb-1">
            Intelligent Log & File Management System
          </p>
          <small className="text-muted">
            Built for scalable log analysis and secure file management
          </small>
        </div>
      </footer>

    </div>
  );
}

/* ---------- HELPERS ---------- */

function Feature({ icon, title, text }) {
  return (
    <div className="col-md-4">
      <div className="feature-card">
        <i className={`bi ${icon} feature-icon`}></i>
        <h5>{title}</h5>
        <p>{text}</p>
      </div>
    </div>
  );
}
function Step({ number, text }) {
  return (
    <div className="col step-box">
      <div className="step-number">{number}</div>
      <p>{text}</p>
    </div>
  );
}

