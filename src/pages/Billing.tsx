import { useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Check, Sparkles, History, Info } from "lucide-react";

export default function Billing() {
  const [activePlan, setActivePlan] = useState("Biotech Scale");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string>("$149");

  useEffect(() => {
    const plan = localStorage.getItem("biotarget_plan") || "Biotech Scale";
    setActivePlan(plan);
  }, []);

  const plans = [
    {
      name: "Academic Researcher",
      price: "$0",
      originalPrice: "$149",
      period: "month",
      description: "Perfect for single investigators and academic research labs mapping local pipelines.",
      features: [
        "Unlimited target validation searches",
        "Standard heuristic AI summaries",
        "ChEMBL bioactive compound grids",
        "Up to 10 PDF report downloads / month",
        "Standard query queuing speed"
      ],
      cta: "Unlock Researcher Plan",
      badge: null,
      active: activePlan === "Academic Researcher"
    },
    {
      name: "Biotech Scale",
      price: "$0",
      originalPrice: "$499",
      period: "month",
      description: "Engineered for therapeutics startups and multi-disciplinary teams launching lead pipelines.",
      features: [
        "Unrestricted AI target validation reports",
        "Full Ensembl + OpenTargets live connections",
        "Subcellular compartimental visualizer mapping",
        "Unlimited high-fidelity report downloads",
        "Priority API query speed (no rate limits)",
        "Gemini Live AI integration (own API Key)",
        "Collaborative saved target pipelines"
      ],
      cta: "Unlock Scale Plan",
      badge: "Beta Active",
      active: activePlan === "Biotech Scale"
    },
    {
      name: "Pharma Enterprise",
      price: "$0",
      originalPrice: "Custom",
      period: "beta",
      description: "Tailored infrastructure for enterprise pharmaceutical computational drug discovery divisions.",
      features: [
        "On-premise secure database integrations",
        "Custom LLM fine-tuning on proprietary targets",
        "SLA guaranteed 99.99% core server uptime",
        "Dedicated computational bioinformatician support",
        "SSO, SAML & role-based access logs",
        "Custom compliance reports generation"
      ],
      cta: "Unlock Enterprise Beta",
      badge: "Limited Spots",
      active: activePlan === "Pharma Enterprise"
    }
  ];

  const paymentHistory = [
    { id: "INV-2026-004", date: "July 15, 2026", amount: "$0.00", status: "Beta Trial", method: "Beta License Waived" },
    { id: "INV-2026-003", date: "June 15, 2026", amount: "$0.00", status: "Beta Trial", method: "Beta License Waived" }
  ];

  const handleCtaClick = (plan: typeof plans[0]) => {
    if (plan.active) return;
    setSelectedPlan(plan.name);
    setSelectedPrice(plan.originalPrice);
    setShowCheckoutModal(true);
  };

  const handleAuthorizeUpgrade = () => {
    if (!selectedPlan) return;
    localStorage.setItem("biotarget_plan", selectedPlan);
    setActivePlan(selectedPlan);
    
    // Dispatch local storage update event for Sidebar to pick up the change
    window.dispatchEvent(new Event("storage"));
    
    setShowCheckoutModal(false);
  };

  return (
    <div className="billing-container fade-in">
      <div className="header-row">
        <div>
          <h1 className="page-title">Subscription & Licensing</h1>
          <p className="subtitle">Manage plans, active licenses, and workspace campaign permissions.</p>
        </div>
      </div>

      {/* Beta Notice Banner */}
      <div className="beta-promotion-banner glass-card">
        <Info className="beta-banner-icon" size={18} />
        <div className="beta-banner-text">
          <strong>Beta Launch Promotion Active:</strong> All B2B plans are currently **100% free of charge** to encourage academic and corporate pilot programs. No billing coordinates or credit cards are required.
        </div>
      </div>

      {/* Credit Status Card */}
      <div className="billing-status-banner glass-card">
        <div className="status-flex">
          <div className="status-info">
            <span className="status-meta">Current Active Tier</span>
            <h2 className="status-title">{activePlan} (Free Launch License)</h2>
            <p className="status-desc">All charges are currently waived under the Beta Campaign.</p>
          </div>
          <div className="usage-meter-block">
            <div className="usage-label-flex">
              <span>Beta Query Allowance</span>
              <span className="usage-stats">Unlimited / Free</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: "100%" }} />
            </div>
            <span className="meter-footer">Corporate Pilot Account</span>
          </div>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="pricing-grid grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`plan-card glass-card ${p.active ? "active-plan-border" : ""}`}>
            {p.badge && (
              <span className={`plan-badge-tag ${p.badge === "Beta Active" ? "popular" : "enterprise"}`}>
                {p.badge}
              </span>
            )}
            
            <h3 className="plan-name">{p.name}</h3>
            
            <div className="price-block">
              <span className="price-num">{p.price}</span>
              <span className="price-period">
                {p.period !== "quote" && `/ ${p.period}`} 
                <span className="strike-price"> (Was {p.originalPrice})</span>
              </span>
            </div>

            <p className="plan-desc">{p.description}</p>

            <button
              onClick={() => handleCtaClick(p)}
              disabled={p.active}
              className={`btn plan-cta-btn ${p.active ? "btn-secondary" : "btn-primary"}`}
            >
              {p.active ? (
                <>
                  <ShieldCheck size={16} /> Active Beta Plan
                </>
              ) : (
                p.cta
              )}
            </button>

            <div className="plan-features-list">
              <span className="features-header">Includes:</span>
              {p.features.map((f, idx) => (
                <div key={idx} className="feature-item">
                  <Check className="feature-check-icon" size={14} />
                  <span className="feature-text">{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Log */}
      <div className="invoice-section-card glass-card">
        <div className="card-header-flex border-bottom-light">
          <h3 className="section-title">
            <History size={16} /> Beta License Registry History
          </h3>
          <span className="text-muted">Total Billed: $0.00</span>
        </div>

        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>License ID</th>
                <th>Activation Date</th>
                <th>License Type</th>
                <th>Receipt Amount</th>
                <th className="align-right">Campaign Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono font-semibold">{item.id}</td>
                  <td>{item.date}</td>
                  <td className="payment-method-cell">
                    <Sparkles size={14} className="text-cyan" /> {item.method}
                  </td>
                  <td className="font-semibold text-primary">{item.amount}</td>
                  <td className="align-right">
                    <span className="status-badge paid">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mock Stripe Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-card fade-in">
            <div className="modal-header">
              <Sparkles className="modal-glow-icon" />
              <h3>Activate {selectedPlan} for Free</h3>
            </div>
            
            <p className="modal-desc">
              All payment requirements are waived during the launch promotion. Click below to upgrade your corporate license instantly.
            </p>

            <div className="checkout-summary-box">
              <div className="summary-row">
                <span>{selectedPlan} Plan</span>
                <span>$0.00 / month (Was {selectedPrice})</span>
              </div>
              <div className="summary-row border-top-light pt-sm">
                <strong>Due Today</strong>
                <strong className="text-cyan">$0.00</strong>
              </div>
            </div>

            <div className="credit-card-form">
              <div className="input-group">
                <span className="input-label">Corporate Owner Name</span>
                <input type="text" className="input-field" defaultValue="Dr. Researcher" />
              </div>
              <div className="input-group">
                <span className="input-label">Credit Card Authorization</span>
                <div className="mock-card-details-field" style={{ background: "hsl(var(--bg-tertiary))", opacity: 0.7 }}>
                  <CreditCard size={16} className="card-input-icon" />
                  <span style={{ fontSize: "0.8rem", color: "hsl(var(--text-muted))" }}>
                    No card required — Launch Campaign Waived
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowCheckoutModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={handleAuthorizeUpgrade}
                className="btn btn-primary"
              >
                Activate Free Plan
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .billing-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .subtitle {
          color: hsl(var(--text-secondary));
          font-size: 0.9rem;
          margin-top: 0.25rem;
        }

        .beta-promotion-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: hsl(var(--accent-cyan) / 0.05);
          border: 1px solid hsl(var(--accent-cyan) / 0.2);
          border-left: 4px solid hsl(var(--accent-cyan));
          padding: 1rem 1.25rem;
        }

        .beta-banner-icon {
          color: hsl(var(--accent-cyan));
          flex-shrink: 0;
        }

        .beta-banner-text {
          font-size: 0.8rem;
          color: hsl(var(--text-secondary));
          line-height: 1.45;
        }

        .billing-status-banner {
          background: linear-gradient(135deg, hsl(var(--bg-secondary) / 0.8) 0%, hsl(var(--bg-tertiary) / 0.5) 100%);
          border-left: 4px solid hsl(var(--accent-cyan));
        }

        .status-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .status-meta {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--accent-cyan));
        }

        .status-title {
          font-family: var(--font-title);
          font-size: 1.75rem;
          font-weight: 800;
          color: hsl(var(--text-primary));
          margin-top: 0.25rem;
        }

        .status-desc {
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          margin-top: 0.25rem;
        }

        .usage-meter-block {
          width: 320px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        @media (max-width: 640px) {
          .usage-meter-block {
            width: 100%;
          }
        }

        .usage-label-flex {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          font-weight: 500;
          color: hsl(var(--text-secondary));
        }

        .usage-stats {
          font-family: var(--font-mono);
          font-weight: 600;
          color: hsl(var(--text-primary));
        }

        .meter-track {
          height: 6px;
          background: hsl(var(--bg-primary));
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid hsl(var(--border-light));
        }

        .meter-fill {
          height: 100%;
          background: hsl(var(--accent-cyan));
          border-radius: 9999px;
        }

        .meter-footer {
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
          text-align: right;
        }

        /* Plan Cards */
        .pricing-grid {
          margin-top: 0.5rem;
        }

        .plan-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: hsl(var(--bg-card));
        }

        .active-plan-border {
          border: 1px solid hsl(var(--accent-cyan) / 0.5);
        }

        .plan-badge-tag {
          position: absolute;
          top: -10px;
          right: 1.5rem;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .plan-badge-tag.popular {
          background: hsl(var(--accent-cyan) / 0.1);
          color: hsl(var(--accent-cyan));
          border: 1px solid hsl(var(--accent-cyan) / 0.25);
        }
        .plan-badge-tag.enterprise {
          background: hsl(var(--accent-purple) / 0.1);
          color: hsl(var(--accent-purple));
          border: 1px solid hsl(var(--accent-purple) / 0.25);
        }

        .plan-name {
          font-family: var(--font-title);
          font-size: 1.25rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .price-block {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .price-num {
          font-family: var(--font-title);
          font-size: 2.5rem;
          font-weight: 800;
          color: hsl(var(--text-primary));
          letter-spacing: -0.04em;
        }

        .price-period {
          font-size: 0.85rem;
          color: hsl(var(--text-muted));
          font-weight: 500;
        }

        .strike-price {
          text-decoration: line-through;
          color: hsl(var(--text-muted));
          font-size: 0.775rem;
          margin-left: 0.25rem;
        }

        .plan-desc {
          font-size: 0.825rem;
          color: hsl(var(--text-secondary));
          min-height: 50px;
          line-height: 1.5;
        }

        .plan-cta-btn {
          width: 100%;
          font-weight: 600;
        }

        .plan-features-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 1.25rem;
          margin-top: 0.5rem;
        }

        .features-header {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-muted));
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .feature-check-icon {
          color: hsl(var(--accent-cyan));
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .feature-text {
          font-size: 0.8rem;
          color: hsl(var(--text-secondary));
          line-height: 1.4;
        }

        /* Invoice Section */
        .invoice-section-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .payment-method-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-badge {
          display: inline-flex;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-badge.paid {
          background: hsl(var(--accent-cyan) / 0.1);
          color: hsl(var(--accent-cyan));
        }

        /* Modal Details */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1.5rem;
        }

        .modal-content {
          width: 100%;
          max-width: 480px;
          background: hsl(var(--bg-secondary));
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 2rem;
          border: 1px solid hsl(var(--border-light));
        }

        .modal-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-title);
          font-size: 1.25rem;
          font-weight: 700;
        }

        .modal-glow-icon {
          color: hsl(var(--accent-cyan));
        }

        .modal-desc {
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          line-height: 1.5;
        }

        .checkout-summary-box {
          background: hsl(var(--bg-primary));
          border: 1px solid hsl(var(--border-light));
          border-radius: 8px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          color: hsl(var(--text-secondary));
        }

        .pt-sm { padding-top: 0.5rem; }

        .credit-card-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mock-card-details-field {
          background: hsl(var(--bg-primary));
          border: 1px solid hsl(var(--border-light));
          border-radius: 8px;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-input-icon {
          color: hsl(var(--text-muted));
        }

        .mock-card-details-field input {
          background: transparent;
          border: none;
          outline: none;
          color: hsl(var(--text-primary));
          font-family: var(--font-mono);
          font-size: 0.875rem;
        }
        .card-no { flex: 1; }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
