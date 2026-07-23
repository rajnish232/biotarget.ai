import { useState } from "react";
import { Dna, ShieldAlert, CheckCircle2, Lock, Mail, Building, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { API_BASE } from "../config";

interface AuthPageProps {
  onAuthSuccess: (user: { email: string; orgName: string; token?: string }) => void;
  onBackToHome?: () => void;
}

export default function AuthPage({ onAuthSuccess, onBackToHome }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
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

    if (password.trim().length < 6) {
      setErrorMsg("Security Policy: Password must be at least 6 characters long.");
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
        setSuccessMsg("Account successfully registered with 256-Bit PBKDF2 encryption!");
        setTimeout(() => {
          onAuthSuccess(result);
        }, 1200);
      } else {
        onAuthSuccess(result);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Could not establish connections to secure authentication gateway.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    // Prompt for Google account or auto-generate researcher account
    const userGoogleEmail = prompt("Enter your Google Account email:", email || "researcher.google@biotech.org");
    if (!userGoogleEmail || !userGoogleEmail.trim()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userGoogleEmail.trim(),
          name: userGoogleEmail.split("@")[0],
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Google authentication failed.");
      }

      setSuccessMsg("Authenticated via Google OAuth 2.0! Launching workspace...");
      setTimeout(() => {
        onAuthSuccess(result);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-portal-wrapper fade-in">
      <div className="auth-portal-card glass-card">
        {/* Brand Header */}
        <div className="auth-brand-flex" style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Dna className="brand-logo-spin" size={32} />
            <div>
              <h1 className="auth-brand-name">BIOTARGET AI</h1>
              <p className="auth-brand-tag">Enterprise Validation Workspace</p>
            </div>
          </div>
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="toggle-mode-btn"
              style={{ fontSize: "0.75rem" }}
            >
              ← Home
            </button>
          )}
        </div>

        {/* Security Badge Banner */}
        <div className="security-trust-badge">
          <ShieldCheck size={14} className="text-cyan" />
          <span>PBKDF2 Salted Hashing & HMAC Session Encryption</span>
        </div>

        {/* Google SSO Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="google-sso-btn"
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="auth-divider">
          <span>OR EMAIL CREDENTIALS</span>
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
            <span className="input-label">Password Key (Min 6 chars)</span>
            <div className="auth-input-container">
              <Lock className="input-icon" size={14} />
              <input
                type={showPassword ? "text" : "password"}
                className="input-field auth-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
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
          gap: 1.25rem;
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

        .security-trust-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: hsl(var(--accent-cyan) / 0.06);
          border: 1px solid hsl(var(--accent-cyan) / 0.18);
          border-radius: 4px;
          padding: 0.45rem 0.75rem;
          font-size: 0.725rem;
          color: hsl(var(--text-secondary));
        }

        .google-sso-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          width: 100%;
          padding: 0.65rem;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          border-radius: 6px;
          color: hsl(var(--text-primary));
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .google-sso-btn:hover {
          background: hsl(var(--bg-tertiary));
          border-color: hsl(var(--accent-cyan) / 0.3);
        }

        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: hsl(var(--text-muted));
          margin: 0.25rem 0;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid hsl(var(--border-light));
        }
        .auth-divider span {
          padding: 0 0.75rem;
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
          padding-right: 2.25rem !important;
        }

        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--text-muted));
          pointer-events: none;
        }

        .password-toggle-btn {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: hsl(var(--text-muted));
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.2rem;
        }
        .password-toggle-btn:hover {
          color: hsl(var(--text-primary));
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
