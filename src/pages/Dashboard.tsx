import React, { useState } from "react";
import { Search, Flame, Sparkles, TrendingUp, HelpCircle, History } from "lucide-react";

interface DashboardProps {
  onSearch: (gene: string) => void;
  recentSearches: string[];
  onClearRecent: () => void;
}

export default function Dashboard({ onSearch, recentSearches, onClearRecent }: DashboardProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const suggestedTargets = [
    { gene: "EGFR", area: "Oncology (Lung/Glioblastoma)", priority: "Critical" },
    { gene: "ACE2", area: "Virology (SARS Entry) / Cardio", priority: "High" },
    { gene: "BRCA1", area: "Oncology (DNA Repair / Breast)", priority: "Critical" },
  ];

  const marketTrends = [
    { target: "KRAS", area: "Oncology", score: 94, compounds: 154, trend: "+12%" },
    { target: "JAK2", area: "Immunology", score: 86, compounds: 89, trend: "+5%" },
    { target: "PD-L1", area: "Immunotherapy", score: 92, compounds: 210, trend: "+18%" },
    { target: "GLP-1R", area: "Metabolic Disease", score: 97, compounds: 34, trend: "+45%" },
  ];

  return (
    <div className="dashboard-container fade-in">
      {/* Welcome Banner */}
      <div className="welcome-banner glass-card">
        <div className="banner-content">
          <div className="banner-badge">
            <Sparkles size={12} className="sparkle-icon" />
            <span>AI Bioinformatics Copilot Active</span>
          </div>
          <h2 className="banner-title">Map the Druggable Proteome</h2>
          <p className="banner-subtitle">
            Instantly validate therapeutic targets. Input a gene symbol to search real-world databases (UniProt, ChEMBL, OpenTargets) and synthesize AI reports.
          </p>
        </div>
      </div>

      {/* Main Search Portal */}
      <div className="search-portal-card glass-card">
        <form onSubmit={handleSubmit} className="portal-search-form">
          <div className="search-glow-container">
            <Search className="portal-search-icon" size={24} />
            <input
              type="text"
              className="portal-search-input"
              placeholder="Enter Gene Symbol (e.g. EGFR, ACE2, BRCA1, ERBB2)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-primary portal-search-btn">
              Analyze Target
            </button>
          </div>
        </form>

        <div className="suggestions-row">
          <span className="suggestion-label">Suggested Targets:</span>
          <div className="suggestion-pills">
            {suggestedTargets.map((t) => (
              <button
                key={t.gene}
                onClick={() => onSearch(t.gene)}
                className="suggestion-pill"
              >
                <Flame size={12} className="pill-icon" />
                <span className="pill-gene">{t.gene}</span>
                <span className="pill-area">{t.area}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid-cols-2 margin-top-lg">
        {/* Left Column: Recent Activity */}
        <div className="recent-activity-card glass-card">
          <div className="card-header-flex border-bottom-light">
            <h3 className="section-title">
              <History size={16} /> Recent Searches
            </h3>
            {recentSearches.length > 0 && (
              <button onClick={onClearRecent} className="clear-btn text-muted">
                Clear
              </button>
            )}
          </div>
          
          <div className="recent-list">
            {recentSearches.length > 0 ? (
              recentSearches.map((gene, idx) => (
                <div
                  key={`${gene}-${idx}`}
                  className="recent-item"
                  onClick={() => onSearch(gene)}
                >
                  <span className="recent-gene">{gene}</span>
                  <span className="recent-time">Analyzed recently</span>
                </div>
              ))
            ) : (
              <div className="recent-empty">
                <HelpCircle size={32} className="empty-icon" />
                <p>No recent targets analyzed yet. Try searching for "EGFR" above.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Market Trends */}
        <div className="market-trends-card glass-card">
          <div className="card-header-flex border-bottom-light">
            <h3 className="section-title">
              <TrendingUp size={16} /> Trending BioTargets
            </h3>
            <span className="badge badge-cyan">Real-time</span>
          </div>

          <div className="trends-list">
            <table className="trends-table">
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Therapeutic Area</th>
                  <th>Score</th>
                  <th>Compounds</th>
                  <th className="align-right">Growth</th>
                </tr>
              </thead>
              <tbody>
                {marketTrends.map((t) => (
                  <tr key={t.target} className="trend-row" onClick={() => onSearch(t.target)}>
                    <td className="trend-target-cell">{t.target}</td>
                    <td>{t.area}</td>
                    <td>
                      <span className="trend-score-badge">{t.score}</span>
                    </td>
                    <td>{t.compounds}</td>
                    <td className="align-right text-cyan font-semibold">{t.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .welcome-banner {
          background: linear-gradient(135deg, hsl(var(--bg-secondary) / 0.8) 0%, hsl(var(--bg-tertiary) / 0.5) 100%);
          border-left: 4px solid hsl(var(--accent-purple));
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .banner-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: hsl(var(--accent-purple) / 0.1);
          color: hsl(var(--accent-purple));
          border: 1px solid hsl(var(--accent-purple) / 0.2);
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }

        .sparkle-icon {
          animation: pulse 1.5s infinite;
        }

        .banner-title {
          font-family: var(--font-title);
          font-size: 2rem;
          font-weight: 800;
          color: hsl(var(--text-primary));
          margin-bottom: 0.5rem;
          letter-spacing: -0.03em;
        }

        .banner-subtitle {
          color: hsl(var(--text-secondary));
          max-width: 800px;
          font-size: 0.95rem;
        }

        .search-portal-card {
          padding: 2rem;
          background: radial-gradient(circle at 10% 20%, hsl(var(--bg-secondary) / 0.9) 0%, hsl(var(--bg-card)) 90%);
          border: 1px solid hsl(var(--border-light));
          box-shadow: 0 20px 50px -15px rgba(0,0,0,0.6);
        }

        .portal-search-form {
          width: 100%;
        }

        .search-glow-container {
          display: flex;
          align-items: center;
          background: hsl(var(--bg-primary));
          border: 1px solid hsl(var(--border-light));
          border-radius: 12px;
          padding: 0.5rem 0.5rem 0.5rem 1.25rem;
          gap: 1rem;
          position: relative;
          transition: var(--transition-smooth);
        }
        .search-glow-container:focus-within {
          border-color: hsl(var(--accent-cyan));
          box-shadow: 0 0 20px -5px hsl(var(--accent-cyan) / 0.25);
        }

        .portal-search-icon {
          color: hsl(var(--text-muted));
        }

        .portal-search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: hsl(var(--text-primary));
          font-size: 1.125rem;
          font-family: var(--font-sans);
          min-width: 0;
        }
        .portal-search-input::placeholder {
          color: hsl(var(--text-muted));
        }

        .portal-search-btn {
          height: 48px;
          padding: 0 1.5rem;
          font-size: 0.95rem;
        }

        .suggestions-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .suggestion-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: hsl(var(--text-muted));
          letter-spacing: 0.05em;
        }

        .suggestion-pills {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .suggestion-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: hsl(var(--bg-tertiary) / 0.6);
          border: 1px solid hsl(var(--border-light));
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--transition-fast);
          color: hsl(var(--text-secondary));
        }
        .suggestion-pill:hover {
          background: hsl(var(--bg-tertiary));
          border-color: hsl(var(--accent-cyan) / 0.4);
          color: hsl(var(--text-primary));
          transform: translateY(-1px);
        }

        .pill-icon {
          color: hsl(var(--accent-gold));
        }

        .pill-gene {
          font-weight: 700;
          font-family: var(--font-title);
          font-size: 0.85rem;
        }

        .pill-area {
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
          border-left: 1px solid hsl(var(--border-light));
          padding-left: 0.5rem;
        }

        .margin-top-lg {
          margin-top: 1rem;
        }

        .border-bottom-light {
          border-bottom: 1px solid hsl(var(--border-light));
          padding-bottom: 0.75rem;
          margin-bottom: 1rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
        }

        .clear-btn {
          background: transparent;
          border: none;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .clear-btn:hover {
          color: hsl(var(--accent-rose));
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-height: 200px;
        }

        .recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          background: hsl(var(--bg-secondary) / 0.4);
          border: 1px solid transparent;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .recent-item:hover {
          background: hsl(var(--bg-tertiary) / 0.4);
          border-color: hsl(var(--accent-cyan) / 0.2);
        }

        .recent-gene {
          font-family: var(--font-title);
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .recent-time {
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
        }

        .recent-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          text-align: center;
          color: hsl(var(--text-muted));
          padding: 2rem;
        }

        .empty-icon {
          color: hsl(var(--text-muted) / 0.3);
        }

        .trends-list {
          min-height: 200px;
          overflow-x: auto;
        }

        .trends-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .trends-table th {
          text-align: left;
          color: hsl(var(--text-muted));
          font-size: 0.7rem;
          text-transform: uppercase;
          font-weight: 600;
          padding: 0.5rem 0.75rem;
          border-bottom: 1px solid hsl(var(--border-light));
        }

        .trends-table td {
          padding: 0.75rem;
          border-bottom: 1px solid hsl(var(--border-light));
          color: hsl(var(--text-secondary));
        }

        .trend-row {
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .trend-row:hover td {
          background: hsl(var(--bg-tertiary) / 0.3);
          color: hsl(var(--text-primary));
        }

        .trend-target-cell {
          font-family: var(--font-title);
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .trend-score-badge {
          background: hsl(var(--accent-gold) / 0.1);
          color: hsl(var(--accent-gold));
          border: 1px solid hsl(var(--accent-gold) / 0.2);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
