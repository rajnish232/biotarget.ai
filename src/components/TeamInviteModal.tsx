import { useState } from "react";
import { Users, Mail, UserPlus, CheckCircle2, Copy, X } from "lucide-react";

interface TeamInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgName: string;
}

export default function TeamInviteModal({ isOpen, onClose, orgName }: TeamInviteModalProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedMembers, setInvitedMembers] = useState<Array<{ email: string; role: string; status: string }>>([
    { email: "lead.bio@novartis.com", role: "Principal Scientist", status: "Active" },
    { email: "target.validation@novartis.com", role: "Research Analyst", status: "Active" }
  ]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInvitedMembers([
      ...invitedMembers,
      { email: inviteEmail.trim(), role: "Research Analyst", status: "Invite Sent" }
    ]);
    setSuccessMsg(`Invitation sent to ${inviteEmail.trim()}!`);
    setInviteEmail("");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const copyShareableLink = () => {
    navigator.clipboard.writeText(`https://biotarget.ai/workspace?org=${encodeURIComponent(orgName)}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="modal-backdrop fade-in">
      <div className="modal-card glass-card">
        {/* Top Header */}
        <div className="modal-header">
          <div className="modal-title-flex">
            <Users className="text-cyan" size={22} />
            <div>
              <h2 className="modal-title">Invite Lab Teammates & Manage Workspace</h2>
              <p className="modal-sub">Organization: <strong className="text-cyan">{orgName}</strong></p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn"><X size={18} /></button>
        </div>

        {/* Invite Input */}
        <form onSubmit={handleSendInvite} className="invite-input-form">
          <span className="input-label">Invite Researcher by Email</span>
          <div className="invite-row">
            <div className="auth-input-container" style={{ flex: 1 }}>
              <Mail className="input-icon" size={14} />
              <input
                type="email"
                className="input-field auth-input"
                placeholder="colleague@novartis.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <UserPlus size={14} />
              <span>Send Invite</span>
            </button>
          </div>
        </form>

        {successMsg && (
          <div className="auth-alert alert-success fade-in" style={{ padding: "0.5rem 0.75rem", fontSize: "0.75rem" }}>
            <CheckCircle2 size={14} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Shareable Link Box */}
        <div className="shareable-link-box">
          <span className="input-label">Workspace Join Link</span>
          <div className="link-copy-row">
            <input
              type="text"
              readOnly
              className="input-field font-mono"
              style={{ fontSize: "0.75rem", background: "hsl(var(--bg-tertiary))" }}
              value={`https://biotarget.ai/workspace?org=${encodeURIComponent(orgName)}`}
            />
            <button onClick={copyShareableLink} className="btn btn-secondary btn-sm">
              <Copy size={12} />
              <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Roster Table */}
        <div className="teammates-roster-block">
          <span className="input-label">Active Lab Teammates ({invitedMembers.length})</span>
          <div className="roster-list">
            {invitedMembers.map((m, i) => (
              <div key={i} className="roster-item">
                <div className="roster-user-info">
                  <span className="user-email font-semibold">{m.email}</span>
                  <span className="user-role text-muted">{m.role}</span>
                </div>
                <span className={`badge ${m.status === "Active" ? "badge-cyan" : "badge-gold"}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-card {
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.75rem;
          border: 1px solid hsl(var(--border-light));
          background: hsl(var(--bg-secondary));
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid hsl(var(--border-light));
          padding-bottom: 0.85rem;
        }

        .modal-title-flex {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .modal-title {
          font-family: var(--font-title);
          font-size: 1.1rem;
          font-weight: 800;
        }

        .modal-sub {
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
        }

        .close-btn {
          background: transparent;
          border: none;
          color: hsl(var(--text-muted));
          cursor: pointer;
        }
        .close-btn:hover { color: hsl(var(--text-primary)); }

        .invite-input-form {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .invite-row {
          display: flex;
          gap: 0.5rem;
        }

        .shareable-link-box {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .link-copy-row {
          display: flex;
          gap: 0.5rem;
        }

        .teammates-roster-block {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 0.85rem;
        }

        .roster-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          max-height: 180px;
          overflow-y: auto;
        }

        .roster-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: hsl(var(--bg-primary));
          border: 1px solid hsl(var(--border-light));
          padding: 0.45rem 0.75rem;
          border-radius: 6px;
        }

        .roster-user-info {
          display: flex;
          flex-direction: column;
        }

        .user-email { font-size: 0.8rem; }
        .user-role { font-size: 0.675rem; }
      `}</style>
    </div>
  );
}
