import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import { Save, CheckCircle, Database, Server, RefreshCw, ChevronDown, ShieldCheck } from "lucide-react";
import { checkBackendStatus } from "../services/ai";
import type { BackendStatus } from "../services/ai";

// Sleek Custom Dropdown Option interface
interface DropdownOption {
  value: string;
  label: string;
}

// Styled Custom React Dropdown Component (replaces old browser native select)
function CustomDropdown({
  options,
  value,
  onChange,
  className = ""
}: {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-dropdown-container ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="custom-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selected.label}</span>
        <ChevronDown size={14} className={`dropdown-chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <ul className="custom-dropdown-list fade-in" role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`custom-dropdown-item ${opt.value === value ? "selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Settings() {
  const [backendState, setBackendState] = useState<BackendStatus>({ online: false, hasApiKey: false });
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings configs
  const [defaultSearch, setDefaultSearch] = useState("EGFR");
  const [exportFormat, setExportFormat] = useState("pdf");
  const [showMarketing, setShowMarketing] = useState(true);
  
  // VPC & ZDR State Simulator
  const [vpcTunnel, setVpcTunnel] = useState(true);
  const [zdrTunnel, setZdrTunnel] = useState(true);

  const verifyBackend = async () => {
    setCheckingBackend(true);
    const status = await checkBackendStatus();
    setBackendState(status);
    setCheckingBackend(false);
  };

  useEffect(() => {
    verifyBackend();

    const storedSearch = localStorage.getItem("biotarget_default_search") || "EGFR";
    setDefaultSearch(storedSearch);

    const storedFormat = localStorage.getItem("biotarget_export_format") || "pdf";
    setExportFormat(storedFormat);

    const storedMarketing = localStorage.getItem("biotarget_show_marketing") !== "false";
    setShowMarketing(storedMarketing);

    const storedVpc = localStorage.getItem("biotarget_vpc_tunnel") !== "false";
    setVpcTunnel(storedVpc);

    const storedZdr = localStorage.getItem("biotarget_zdr_tunnel") !== "false";
    setZdrTunnel(storedZdr);
  }, []);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("biotarget_default_search", defaultSearch.trim().toUpperCase());
    localStorage.setItem("biotarget_export_format", exportFormat);
    localStorage.setItem("biotarget_show_marketing", showMarketing ? "true" : "false");
    localStorage.setItem("biotarget_vpc_tunnel", vpcTunnel ? "true" : "false");
    localStorage.setItem("biotarget_zdr_tunnel", zdrTunnel ? "true" : "false");

    setSavedSuccess(true);
    // Dispatch local storage update event for responsive visual header updates
    window.dispatchEvent(new Event("storage"));
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const exportOptions = [
    { value: "pdf", label: "Formatted PDF Printout" },
    { value: "json", label: "Raw JSON (BioInformatic Datasets)" }
  ];

  return (
    <div className="settings-container fade-in">
      <div className="header-row">
        <div>
          <h1 className="page-title">Workspace Settings</h1>
          <p className="subtitle">Configure full-stack AI engine credentials, database paths, and export preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form-layout">
        {/* Secure Backend Connection Status Card */}
        <div className="settings-card glass-card">
          <div className="section-header-flex">
            <div className="header-title-wrapper">
              <Server size={16} />
              <span>Secure Backend Status</span>
            </div>
            <button
              type="button"
              className="refresh-btn"
              onClick={verifyBackend}
              disabled={checkingBackend}
              title="Refresh connection status"
            >
              <RefreshCw size={14} className={checkingBackend ? "spinning" : ""} />
            </button>
          </div>

          <p className="settings-desc-text">
            For B2B security, API credentials are now managed securely inside the server-side environment configurations (<code>server/.env</code> file) and are never exposed to the client browser.
          </p>

          <div className="backend-status-panel">
            <div className="status-indicator-row">
              <span className="status-label-text">Server Status:</span>
              {backendState.online ? (
                backendState.hasApiKey ? (
                  <span className="badge badge-cyan font-bold">SECURE ACCESSIBLE</span>
                ) : (
                  <span className="badge badge-gold font-bold">KEY CONFIGURATION MISSING</span>
                )
              ) : (
                <span className="badge badge-rose font-bold">SERVER OFFLINE</span>
              )}
            </div>

            <div className="status-message-box">
              {backendState.online ? (
                backendState.hasApiKey ? (
                  <p className="status-text text-glowing-green">
                    <strong>Connected:</strong> Node.js server is online on port 3001. Live Gemini target validations are active and secured.
                  </p>
                ) : (
                  <p className="status-text text-glowing-yellow">
                    <strong>Action Required:</strong> The backend server is online, but <code>GEMINI_API_KEY</code> is not set in <code>server/.env</code>. The application is falling back to local heuristic calculations.
                  </p>
                )
              ) : (
                <p className="status-text text-glowing-red">
                  <strong>Action Required:</strong> The backend server is offline. Please launch the Node.js server (run <code>npm start</code> in the <code>/server</code> directory). The application is falling back to local heuristic calculations.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Enterprise Security & ZDR Tunnels */}
        <div className="settings-card glass-card">
          <div className="section-header">
            <ShieldCheck size={16} />
            <span>Enterprise Security & Tunneling</span>
          </div>

          <p className="settings-desc-text">
            Configure secure routing proxies for proprietary drug candidate research. Toggling these changes how target inquiries are logged.
          </p>

          <div className="toggles-list">
            <label className="toggle-label-row">
              <div className="toggle-label-info">
                <span className="toggle-title">Simulate Secure VPC Tunneling</span>
                <span className="toggle-desc">Encrypt queries and tunnel them through a simulated virtual private cloud backend.</span>
              </div>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  className="switch-checkbox"
                  checked={vpcTunnel}
                  onChange={(e) => setVpcTunnel(e.target.checked)}
                />
                <span className="switch-slider" />
              </div>
            </label>

            <label className="toggle-label-row" style={{ marginTop: "1rem" }}>
              <div className="toggle-label-info">
                <span className="toggle-title">Zero-Data Retention (ZDR) Mandate</span>
                <span className="toggle-desc">Instruct the AI proxy to prevent query logging and skip cache storage.</span>
              </div>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  className="switch-checkbox"
                  checked={zdrTunnel}
                  onChange={(e) => setZdrTunnel(e.target.checked)}
                />
                <span className="switch-slider" />
              </div>
            </label>
          </div>
        </div>

        {/* Workspace Defaults */}
        <div className="settings-card glass-card">
          <div className="section-header">
            <Database size={16} />
            <span>Workbench Configurations</span>
          </div>

          <div className="settings-grid">
            <div className="input-group">
              <span className="input-label">Default Target Gene Symbol</span>
              <input
                type="text"
                className="input-field"
                value={defaultSearch}
                onChange={(e) => setDefaultSearch(e.target.value)}
              />
              <span className="input-hint-muted">Launches this target query on workspace login.</span>
            </div>

            <div className="input-group">
              <span className="input-label">Preferred Report Export Format</span>
              <CustomDropdown
                options={exportOptions}
                value={exportFormat}
                onChange={(val) => setExportFormat(val)}
                className="w-100"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="toggles-list">
            <label className="toggle-label-row">
              <div className="toggle-label-info">
                <span className="toggle-title">Interactive Notifications</span>
                <span className="toggle-desc">Show updates during database polling loops.</span>
              </div>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  className="switch-checkbox"
                  checked={showMarketing}
                  onChange={(e) => setShowMarketing(e.target.checked)}
                />
                <span className="switch-slider" />
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions Floating Bar */}
        <div className="settings-actions-footer">
          {savedSuccess && (
            <div className="success-toast fade-in">
              <CheckCircle size={16} />
              <span>Configurations successfully synchronized!</span>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary btn-save-settings">
            <Save size={16} /> Save Configurations
          </button>
        </div>
      </form>

      <style>{`
        /* Custom styled select boxes markup details */
        .custom-dropdown-container {
          position: relative;
          min-width: 160px;
          flex: 1;
        }

        .w-100 {
          width: 100%;
        }

        .custom-dropdown-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          color: hsl(var(--text-secondary));
          padding: 0.6rem 0.85rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-family: var(--font-sans);
          cursor: pointer;
          width: 100%;
          transition: var(--transition-fast);
          text-align: left;
        }
        .custom-dropdown-trigger:hover {
          color: hsl(var(--text-primary));
          border-color: hsl(var(--border-glass));
        }
        .custom-dropdown-trigger:focus {
          border-color: hsl(var(--accent-cyan) / 0.5);
          outline: none;
        }

        .dropdown-chevron {
          color: hsl(var(--text-muted));
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .dropdown-chevron.open {
          transform: rotate(180deg);
        }

        .custom-dropdown-list {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 100%;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          border-radius: 6px;
          list-style: none;
          z-index: 50;
          padding: 0.25rem 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
          max-height: 220px;
          overflow-y: auto;
        }

        .custom-dropdown-item {
          padding: 0.55rem 0.85rem;
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .custom-dropdown-item:hover {
          background: hsl(var(--bg-tertiary) / 0.5);
          color: hsl(var(--text-primary));
        }
        .custom-dropdown-item.selected {
          background: hsl(var(--accent-cyan) / 0.08);
          color: hsl(var(--accent-cyan));
          font-weight: 600;
        }

        .settings-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .settings-form-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .settings-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid hsl(var(--border-light));
          padding-bottom: 0.4rem;
          margin-bottom: 1rem;
        }

        .header-title-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: hsl(var(--text-primary));
          font-family: var(--font-title);
          font-size: 1.1rem;
        }

        .header-title-wrapper svg {
          color: hsl(var(--accent-cyan));
        }

        .refresh-btn {
          background: transparent;
          border: none;
          color: hsl(var(--text-muted));
          cursor: pointer;
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          padding: 0.2rem;
          border-radius: 4px;
        }
        .refresh-btn:hover {
          color: hsl(var(--text-primary));
          background: hsl(var(--bg-tertiary));
        }
        .refresh-btn:disabled {
          opacity: 0.5;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .settings-desc-text {
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          line-height: 1.5;
        }

        .backend-status-panel {
          background: hsl(var(--bg-secondary) / 0.5);
          border: 1px solid hsl(var(--border-light));
          border-radius: 6px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .status-indicator-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
        }

        .status-label-text {
          font-weight: 500;
          color: hsl(var(--text-secondary));
        }

        .status-message-box {
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 0.75rem;
        }

        .status-text {
          font-size: 0.8rem;
          line-height: 1.45;
        }

        .text-glowing-green { color: hsl(var(--accent-cyan)); }
        .text-glowing-yellow { color: hsl(var(--accent-gold)); }
        .text-glowing-red { color: hsl(var(--accent-rose)); }

        .input-hint-muted {
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
          line-height: 1.4;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        @media (max-width: 640px) {
          .settings-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        .toggles-list {
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 1.25rem;
          margin-top: 0.5rem;
        }

        .toggle-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          gap: 2rem;
        }

        .toggle-label-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .toggle-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: hsl(var(--text-primary));
        }

        .toggle-desc {
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
        }

        .switch-wrapper {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 22px;
          flex-shrink: 0;
        }

        .switch-checkbox {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .switch-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: hsl(var(--bg-tertiary));
          transition: .3s;
          border-radius: 34px;
          border: 1px solid hsl(var(--border-light));
        }
        .switch-slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: hsl(var(--text-secondary));
          transition: .3s;
          border-radius: 50%;
        }

        .switch-checkbox:checked + .switch-slider {
          background-color: hsl(var(--accent-cyan) / 0.15);
          border-color: hsl(var(--accent-cyan));
        }

        .switch-checkbox:checked + .switch-slider:before {
          transform: translateX(22px);
          background-color: hsl(var(--accent-cyan));
        }

        .settings-actions-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .success-toast {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: hsl(var(--accent-cyan));
          font-weight: 500;
        }

        .btn-save-settings {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
