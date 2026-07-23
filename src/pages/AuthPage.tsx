import { useState } from "react";
import { Dna, ShieldAlert, CheckCircle2, Lock, Mail, Building } from "lucide-react";
import { API_BASE } from "../config";

interface AuthPageProps {
  onAuthSuccess: (user: { email: string; orgName: string }) => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all credentials fields.");
      return;
    }

    setLoading(true);
    const endpoint = isSignUp ? "signup" : "login";

    try {
      const response = await fetch(`${API_BASE}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          orgName: isSignUp ? orgName.trim() : undefined
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Authentication request failed.");
      }

      if (isSignUp) {
        setSuccessMsg("Account successfully registered! Proceeding to workspace...");
        setTimeout(() => {
          onAuthSuccess(result);
        }, 1500);
      } else {
        onAuthSuccess(result);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not establish connections to secure authentication gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-portal-wrapper fade-in">
      <div className="auth-portal-card glass-card">
        {/* Brand Header */}
        <div className="auth-brand-flex">
          <Dna className="brand-logo-spin" size={32} />
          <div>
            <h1 className="auth-brand-name">BIOTARGET AI</h1>
            <p className="auth-brand-tag">Enterprise Validation Workspace</p>
          </div>
        </div>

        {/* Form Panel */}
        <form onSubmit={handleSubmit} className="auth-form-layout">
          <h2 className="auth-panel-title">
            {isSignUp ? "Create Researcher Account" : "Access Validations Hub"}
          </h2>
          <p className="auth-panel-desc">
            {isSignUp 
              ? "Register B2B credentials to store custom gene pipelines." 
              : "Login using your authenticated corporate credentials."}
          </p>

          {/* Messages */}
          {errorMsg && (
            <div className="auth-alert alert-error fade-in">
              <ShieldAlert size={16} />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="auth-alert alert-success fade-in">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Inputs */}
          <div className="input-group">
            <span className="input-label">Corporate Email Address</span>
            <div className="auth-input-container">
              <Mail className="input-icon" size={14} />
              <input
                type="email"
                className="input-field auth-input"
                placeholder="researcher@novartis.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <span className="input-label">Password Key</span>
            <div className="auth-input-container">
              <Lock className="input-icon" size={14} />
              <input
                type="password"
                className="input-field auth-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="input-group fade-in">
              <span className="input-label">Organization Name</span>
              <div className="auth-input-container">
                <Building className="input-icon" size={14} />
                <input
                  type="text"
                  className="input-field auth-input"
                  placeholder="Novartis R&D Group"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Establishing Secure Sync..." : isSignUp ? "Create B2B Account" : "Access Workspace"}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="auth-toggle-footer">
          <span>{isSignUp ? "Already have registered credentials?" : "New research organization?"}</span>
          <button
            type="button"
            className="toggle-mode-btn"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            disabled={loading}
          >
            {isSignUp ? "Sign In" : "Register Organization"}
          </button>
        </div>
      </div>

      <style>{`
        .auth-portal-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          background: hsl(var(--bg-primary));
          padding: 1.5rem;
        }

        .auth-portal-card {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-brand-flex {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid hsl(var(--border-light));
          padding-bottom: 1rem;
        }

        .brand-logo-spin {
          color: hsl(var(--accent-cyan));
        }

        .auth-brand-name {
          font-family: var(--font-title);
          font-size: 1.25rem;
          font-weight: 800;
          color: hsl(var(--text-primary));
        }

        .auth-brand-tag {
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
          font-weight: 500;
        }

        .auth-form-layout {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-panel-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .auth-panel-desc {
          font-size: 0.8rem;
          color: hsl(var(--text-muted));
          line-height: 1.4;
          margin-top: -0.35rem;
        }

        /* Input overrides */
        .auth-input-container {
          position: relative;
          width: 100%;
        }

        .auth-input {
          padding-left: 2.25rem !important;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--text-muted));
          pointer-events: none;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 0.7rem 1rem;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        /* Alert notifications */
        .auth-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.775rem;
          padding: 0.65rem 0.85rem;
          border-radius: 4px;
          line-height: 1.4;
        }

        .alert-error {
          background: hsl(var(--accent-rose) / 0.05);
          border: 1px solid hsl(var(--accent-rose) / 0.2);
          color: hsl(var(--accent-rose));
        }

        .alert-success {
          background: hsl(var(--accent-cyan) / 0.05);
          border: 1px solid hsl(var(--accent-cyan) / 0.2);
          color: hsl(var(--accent-cyan));
        }

        .auth-toggle-footer {
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.775rem;
          color: hsl(var(--text-muted));
        }

        .toggle-mode-btn {
          background: transparent;
          border: none;
          color: hsl(var(--accent-cyan));
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .toggle-mode-btn:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
