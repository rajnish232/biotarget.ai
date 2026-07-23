import { useState } from "react";
import { 
  GitCompare, Flame, ExternalLink
} from "lucide-react";

interface ComparisonTarget {
  symbol: string;
  fullName: string;
  uniprotId: string;
  score: number;
  tractability: string;
  location: string;
  depMapScore: number;
  depMapStatus: string;
  leadCompound: string;
  affinity: string;
  trialsCount: number;
  ftoRisk: "Low Risk" | "Medium Risk" | "High Risk";
  recommendation: string;
}

const COMPARISON_DATABASE: Record<string, ComparisonTarget> = {
  EGFR: {
    symbol: "EGFR",
    fullName: "Epidermal Growth Factor Receptor",
    uniprotId: "P00533",
    score: 98,
    tractability: "Highly Druggable (Small Molecule / Antibody)",
    location: "Cell Membrane",
    depMapScore: -0.89,
    depMapStatus: "Strongly Dependent Target",
    leadCompound: "Osimertinib (CHEMBL3544961)",
    affinity: "1.4 nM (IC50)",
    trialsCount: 142,
    ftoRisk: "High Risk",
    recommendation: "Proceed with 3rd-Gen Mutation-Selective Inhibitors"
  },
  TP53: {
    symbol: "TP53",
    fullName: "Cellular Tumor Antigen p53",
    uniprotId: "P04637",
    score: 85,
    tractability: "Modulator (Protein-Protein Interface)",
    location: "Nucleus & Cytoplasm",
    depMapScore: -0.95,
    depMapStatus: "Pan-Cancer Essential Gene",
    leadCompound: "Eprenetapopt (APR-246)",
    affinity: "320 nM (Ki)",
    trialsCount: 88,
    ftoRisk: "Medium Risk",
    recommendation: "Target Reactivators or PROTAC Degraders"
  },
  KRAS: {
    symbol: "KRAS",
    fullName: "GTPase KRas Locus",
    uniprotId: "P01116",
    score: 94,
    tractability: "Covalent Inhibitor (G12C Selective)",
    location: "Plasma Membrane",
    depMapScore: -0.92,
    depMapStatus: "Strongly Dependent Target",
    leadCompound: "Sotorasib (CHEMBL4297580)",
    affinity: "1.2 nM (IC50)",
    trialsCount: 110,
    ftoRisk: "High Risk",
    recommendation: "Focus on G12D or G12V Allele-Specific Covalent Leads"
  },
  BRCA1: {
    symbol: "BRCA1",
    fullName: "BRCA1 DNA Repair Associated",
    uniprotId: "P38398",
    score: 91,
    tractability: "Synthetic Lethality (PARP Target)",
    location: "Nucleus",
    depMapScore: -0.76,
    depMapStatus: "Conditionally Dependent Target",
    leadCompound: "Olaparib (CHEMBL1088686)",
    affinity: "6.0 nM (IC50)",
    trialsCount: 75,
    ftoRisk: "Low Risk",
    recommendation: "Explore PARP1-Selective Combo Therapies"
  },
  ACE2: {
    symbol: "ACE2",
    fullName: "Angiotensin-Converting Enzyme 2",
    uniprotId: "Q9BYF1",
    score: 88,
    tractability: "Receptor Blockade / Monoclonal Antibody",
    location: "Cell Membrane",
    depMapScore: -0.04,
    depMapStatus: "Non-Essential Target",
    leadCompound: "MLN-4760 (CHEMBL410190)",
    affinity: "440 nM (IC50)",
    trialsCount: 34,
    ftoRisk: "Medium Risk",
    recommendation: "Evaluate Neutralizing Decoy Protein Reagents"
  }
};

interface ComparisonViewProps {
  onSearchTarget: (symbol: string) => void;
  savedTargets?: string[];
}

export default function ComparisonView({ onSearchTarget, savedTargets = [] }: ComparisonViewProps) {
  // Active targets selected for comparison matrix (default: EGFR, KRAS, TP53)
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["EGFR", "KRAS", "TP53"]);

  const allAvailableSymbols = Array.from(new Set([...Object.keys(COMPARISON_DATABASE), ...savedTargets]));

  const toggleTargetSelection = (sym: string) => {
    if (selectedSymbols.includes(sym)) {
      if (selectedSymbols.length <= 2) return; // Keep at least 2
      setSelectedSymbols(selectedSymbols.filter(s => s !== sym));
    } else {
      if (selectedSymbols.length >= 4) return; // Max 4 targets side-by-side
      setSelectedSymbols([...selectedSymbols, sym]);
    }
  };

  const getTargetData = (sym: string): ComparisonTarget => {
    if (COMPARISON_DATABASE[sym]) {
      return COMPARISON_DATABASE[sym];
    }
    // Fallback for custom saved target
    return {
      symbol: sym,
      fullName: `Human Target ${sym}`,
      uniprotId: "P99999",
      score: 82,
      tractability: "Small Molecule / Antibody",
      location: "Cell Membrane",
      depMapScore: -0.65,
      depMapStatus: "Dependent Target",
      leadCompound: "Experimental Compound",
      affinity: "12.0 nM (IC50)",
      trialsCount: 15,
      ftoRisk: "Medium Risk",
      recommendation: "Initiate High-Throughput Binding Screening"
    };
  };

  const comparisonTargets = selectedSymbols.map(s => getTargetData(s));

  return (
    <div className="comparison-container fade-in">
      <div className="header-row">
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <GitCompare className="text-cyan" size={24} />
            <span>Target Comparison Matrix</span>
          </h1>
          <p className="subtitle">Evaluate and rank drug target candidates side-by-side before committing R&D resources.</p>
        </div>
      </div>

      {/* Target Selector Bar */}
      <div className="selector-bar glass-card">
        <span className="selector-label">SELECT TARGET CANDIDATES TO COMPARE (2 to 4):</span>
        <div className="selector-pills">
          {allAvailableSymbols.map(sym => {
            const isSelected = selectedSymbols.includes(sym);
            return (
              <button
                key={sym}
                onClick={() => toggleTargetSelection(sym)}
                className={`selector-pill ${isSelected ? "active" : ""}`}
              >
                <Flame size={12} className={isSelected ? "text-cyan" : "text-muted"} />
                <span>{sym}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Matrix Table */}
      <div className="matrix-wrapper glass-card">
        <table className="comparison-matrix-table">
          <thead>
            <tr>
              <th className="metric-header-col">METRIC / ATTRIBUTE</th>
              {comparisonTargets.map(t => (
                <th key={t.symbol} className="target-header-col">
                  <div className="target-col-title-flex">
                    <div>
                      <h3 className="target-sym-title">{t.symbol}</h3>
                      <p className="target-full-name">{t.fullName}</p>
                    </div>
                    <button
                      onClick={() => onSearchTarget(t.symbol)}
                      className="btn btn-primary nav-cta"
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.725rem" }}
                    >
                      Inspect Canvas <ExternalLink size={10} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 1. Feasibility Score */}
            <tr>
              <td className="metric-label-cell">
                <span className="m-title">Druggability Feasibility Score</span>
                <span className="m-sub">AI synthesis rating (0-100)</span>
              </td>
              {comparisonTargets.map(t => (
                <td key={t.symbol} className="metric-value-cell">
                  <div className="score-flex">
                    <span className="score-val text-cyan">{t.score}</span>
                    <span className="score-max">/100</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-fill" style={{ width: `${t.score}%` }} />
                  </div>
                </td>
              ))}
            </tr>

            {/* 2. Tractability Class */}
            <tr>
              <td className="metric-label-cell">
                <span className="m-title">Tractability Modality</span>
                <span className="m-sub">OpenTargets Classification</span>
              </td>
              {comparisonTargets.map(t => (
                <td key={t.symbol} className="metric-value-cell">
                  <span className="badge badge-cyan font-semibold">{t.tractability}</span>
                </td>
              ))}
            </tr>

            {/* 3. Subcellular Localization */}
            <tr>
              <td className="metric-label-cell">
                <span className="m-title">Subcellular Localization</span>
                <span className="m-sub">UniProt Compartment</span>
              </td>
              {comparisonTargets.map(t => (
                <td key={t.symbol} className="metric-value-cell font-mono">
                  {t.location}
                </td>
              ))}
            </tr>

            {/* 4. DepMap Essentiality */}
            <tr>
              <td className="metric-label-cell">
                <span className="m-title">CRISPR DepMap Knockout</span>
                <span className="m-sub">Broad Institute Chronos</span>
              </td>
              {comparisonTargets.map(t => (
                <td key={t.symbol} className="metric-value-cell">
                  <span className="font-mono font-semibold text-purple">{t.depMapScore}</span>
                  <span className="badge badge-purple" style={{ marginLeft: "0.5rem", fontSize: "0.65rem" }}>
                    {t.depMapStatus}
                  </span>
                </td>
              ))}
            </tr>

            {/* 5. Lead Compound & Binding Affinity */}
            <tr>
              <td className="metric-label-cell">
                <span className="m-title">Lead Inhibitor Candidate</span>
                <span className="m-sub">ChEMBL Bioactivity</span>
              </td>
              {comparisonTargets.map(t => (
                <td key={t.symbol} className="metric-value-cell">
                  <div className="font-semibold">{t.leadCompound}</div>
                  <div className="text-gold font-mono" style={{ fontSize: "0.75rem", marginTop: "0.2rem" }}>
                    Affinity: {t.affinity}
                  </div>
                </td>
              ))}
            </tr>

            {/* 6. Active Clinical Trials */}
            <tr>
              <td className="metric-label-cell">
                <span className="m-title">Clinical Trials Index</span>
                <span className="m-sub">ClinicalTrials.gov v2</span>
              </td>
              {comparisonTargets.map(t => (
                <td key={t.symbol} className="metric-value-cell">
                  <span className="font-bold">{t.trialsCount} Registered Trials</span>
                </td>
              ))}
            </tr>

            {/* 7. Patent FTO Risk */}
            <tr>
              <td className="metric-label-cell">
                <span className="m-title">Freedom-to-Operate (FTO)</span>
                <span className="m-sub">SureChEMBL Patent Landscape</span>
              </td>
              {comparisonTargets.map(t => (
                <td key={t.symbol} className="metric-value-cell">
                  <span className={`badge ${t.ftoRisk === "High Risk" ? "badge-rose" : t.ftoRisk === "Medium Risk" ? "badge-gold" : "badge-cyan"}`}>
                    {t.ftoRisk}
                  </span>
                </td>
              ))}
            </tr>

            {/* 8. R&D Strategy Recommendation */}
            <tr>
              <td className="metric-label-cell">
                <span className="m-title">AI R&D Recommendation</span>
                <span className="m-sub">Strategic Execution Plan</span>
              </td>
              {comparisonTargets.map(t => (
                <td key={t.symbol} className="metric-value-cell text-muted" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                  {t.recommendation}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        .comparison-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-bottom: 3rem;
        }

        .selector-bar {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .selector-label {
          font-size: 0.675rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: hsl(var(--accent-cyan));
        }

        .selector-pills {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .selector-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          padding: 0.4rem 0.85rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-family: var(--font-title);
          font-weight: 700;
          color: hsl(var(--text-secondary));
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .selector-pill:hover {
          border-color: hsl(var(--accent-cyan) / 0.4);
          color: hsl(var(--text-primary));
        }
        .selector-pill.active {
          background: hsl(var(--accent-cyan) / 0.1);
          border-color: hsl(var(--accent-cyan) / 0.5);
          color: hsl(var(--accent-cyan));
        }

        .matrix-wrapper {
          overflow-x: auto;
          padding: 0;
        }

        .comparison-matrix-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .comparison-matrix-table th, .comparison-matrix-table td {
          padding: 1.15rem 1.25rem;
          border-bottom: 1px solid hsl(var(--border-light));
          border-right: 1px solid hsl(var(--border-light));
        }

        .comparison-matrix-table th:last-child, .comparison-matrix-table td:last-child {
          border-right: none;
        }

        .metric-header-col {
          width: 220px;
          min-width: 200px;
          background: hsl(var(--bg-tertiary));
          font-size: 0.675rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: hsl(var(--text-muted));
        }

        .target-header-col {
          min-width: 260px;
          background: hsl(var(--bg-secondary));
        }

        .target-col-title-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .target-sym-title {
          font-family: var(--font-title);
          font-size: 1.25rem;
          font-weight: 800;
        }

        .target-full-name {
          font-size: 0.725rem;
          color: hsl(var(--text-muted));
          font-weight: 500;
        }

        .metric-label-cell {
          background: hsl(var(--bg-secondary) / 0.5);
          vertical-align: top;
        }

        .m-title {
          display: block;
          font-family: var(--font-title);
          font-size: 0.85rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .m-sub {
          display: block;
          font-size: 0.675rem;
          color: hsl(var(--text-muted));
          margin-top: 0.15rem;
        }

        .metric-value-cell {
          vertical-align: middle;
        }

        .score-flex {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
          margin-bottom: 0.35rem;
        }

        .score-val {
          font-family: var(--font-title);
          font-size: 1.5rem;
          font-weight: 800;
        }

        .score-max {
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
        }

        .progress-bar-container {
          width: 100%;
          height: 6px;
          background: hsl(var(--bg-tertiary));
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: hsl(var(--accent-cyan));
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
