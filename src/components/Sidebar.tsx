import { useState, useEffect } from "react";
import { LayoutDashboard, Target, GitCompare, Sparkles, CreditCard, Settings, Dna, LogOut, LogOutIcon } from "lucide-react";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  savedTargetsCount: number;
  onExitConsole?: () => void;
  onLogout?: () => void;
  userEmail?: string;
  userOrg?: string;
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  savedTargetsCount, 
  onExitConsole,
  onLogout,
  userEmail,
  userOrg
}: SidebarProps) {
  const [activePlan, setActivePlan] = useState("Biotech Scale");

  useEffect(() => {
    const plan = localStorage.getItem("biotarget_plan") || "Biotech Scale";
    setActivePlan(plan);

    const handleStorageChange = () => {
      const updatedPlan = localStorage.getItem("biotarget_plan") || "Biotech Scale";
      setActivePlan(updatedPlan);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "discovery", label: "Target Discovery", icon: Target, badge: savedTargetsCount > 0 ? savedTargetsCount.toString() : undefined },
    { id: "comparison", label: "Compare Matrix", icon: GitCompare },
    { id: "billing", label: "Plans & Billing", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getInitials = (emailStr?: string) => {
    if (!emailStr) return "RD";
    const parts = emailStr.split("@")[0];
    return parts.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Dna className="logo-icon" />
        <span className="logo-text">BioTarget <span className="logo-highlight">AI</span></span>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="nav-icon" size={18} />
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">{getInitials(userEmail)}</div>
          <div className="user-info">
            <span className="username" title={userEmail}>{userEmail || "Dr. Researcher"}</span>
            <span className="role" title={userOrg}>{userOrg || "Principal Scientist"}</span>
          </div>
        </div>
        
        <div className="plan-badge">
          <Sparkles size={12} className="plan-badge-icon" />
          <span>{activePlan} Tier</span>
        </div>

        <div className="footer-buttons-row">
          {onExitConsole && (
            <button onClick={onExitConsole} className="exit-console-btn" title="Return to Landing Page">
              <LogOut size={12} />
              <span>Exit Workspace</span>
            </button>
          )}

          {onLogout && (
            <button onClick={onLogout} className="exit-console-btn signout-btn" title="Sign Out Profile">
              <LogOutIcon size={12} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: hsl(var(--bg-secondary));
          border-right: 1px solid hsl(var(--border-light));
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.4rem;
          margin-bottom: 1.75rem;
        }

        .logo-icon {
          color: hsl(var(--accent-cyan));
        }

        .logo-text {
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: -0.02em;
        }

        .logo-highlight {
          color: hsl(var(--accent-cyan));
        }

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.85rem;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: hsl(var(--text-secondary));
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-fast);
          width: 100%;
          text-align: left;
          position: relative;
        }

        .nav-item:hover {
          color: hsl(var(--text-primary));
          background: hsl(var(--bg-tertiary) / 0.5);
        }

        .nav-item.active {
          color: hsl(var(--text-primary));
          background: hsl(var(--bg-tertiary));
          border-left: 2px solid hsl(var(--accent-cyan));
          padding-left: calc(0.85rem - 2px);
        }

        .nav-item.active .nav-icon {
          color: hsl(var(--accent-cyan));
        }

        .nav-badge {
          margin-left: auto;
          background: hsl(var(--accent-cyan) / 0.08);
          border: 1px solid hsl(var(--accent-cyan) / 0.15);
          color: hsl(var(--accent-cyan));
          font-size: 0.7rem;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .sidebar-footer {
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          background: hsl(var(--accent-purple) / 0.15);
          border: 1px solid hsl(var(--accent-purple) / 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
          color: hsl(var(--accent-purple));
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .username {
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--text-primary));
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .role {
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .plan-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          background: hsl(var(--bg-tertiary));
          border: 1px solid hsl(var(--border-light));
          padding: 0.35rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
        }

        .plan-badge-icon {
          color: hsl(var(--accent-cyan));
        }

        .footer-buttons-row {
          display: flex;
          gap: 0.4rem;
          width: 100%;
        }

        .exit-console-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          background: transparent;
          border: 1px dashed hsl(var(--border-light));
          padding: 0.35rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: hsl(var(--text-muted));
          cursor: pointer;
          transition: var(--transition-fast);
          flex: 1;
        }
        .exit-console-btn:hover {
          color: hsl(var(--accent-cyan));
          border-color: hsl(var(--accent-cyan) / 0.4);
          background: hsl(var(--accent-cyan) / 0.05);
        }

        .signout-btn:hover {
          color: hsl(var(--accent-rose));
          border-color: hsl(var(--accent-rose) / 0.4);
          background: hsl(var(--accent-rose) / 0.05);
        }

        @media (max-width: 1024px) {
          .sidebar {
            width: 100%;
            height: 60px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 0 1rem;
            border-right: none;
            border-bottom: 1px solid hsl(var(--border-light));
          }

          .logo-container {
            margin-bottom: 0;
          }

          .nav-menu {
            display: none;
          }

          .sidebar-footer {
            border-top: none;
            padding-top: 0;
            flex-direction: row;
            align-items: center;
          }
          .plan-badge, .footer-buttons-row {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
