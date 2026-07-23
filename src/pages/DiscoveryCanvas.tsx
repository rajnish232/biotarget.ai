import { useState, useEffect } from "react";
import { 
  ArrowLeft, ShieldAlert, Sparkles, BookOpen, 
  MapPin, CheckCircle, HelpCircle, Save, Printer,
  ShieldCheck, Shield, FileText, AlertCircle, Download
} from "lucide-react";
import type { BioTargetData } from "../services/api";
import type { TargetAnalysis } from "../services/ai";
import MetricCard from "../components/MetricCard";
import SubcellularVisualizer from "../components/SubcellularVisualizer";
import CompoundTable from "../components/CompoundTable";
import ReportPDF from "../components/ReportPDF";
import { exportTargetToCSV } from "../utils/csvExport";

interface DiscoveryCanvasProps {
  data: BioTargetData | null;
  analysis: TargetAnalysis | null;
  isLoading: boolean;
  onBack: () => void;
  onSave: () => void;
  isSaved: boolean;
}

export default function DiscoveryCanvas({
  data,
  analysis,
  isLoading,
  onBack,
  onSave,
  isSaved
}: DiscoveryCanvasProps) {
  const [printMode, setPrintMode] = useState(false);
  const [vpcTunnelActive, setVpcTunnelActive] = useState(true);
  const [zdrTunnelActive, setZdrTunnelActive] = useState(true);

  // Poll for simulated secure settings on mount
  useEffect(() => {
    const vpc = localStorage.getItem("biotarget_vpc_tunnel") !== "false";
    setVpcTunnelActive(vpc);
    const zdr = localStorage.getItem("biotarget_zdr_tunnel") !== "false";
    setZdrTunnelActive(zdr);

    // Watch for local storage adjustments
    const handleStorageChange = () => {
      const updatedVpc = localStorage.getItem("biotarget_vpc_tunnel") !== "false";
      setVpcTunnelActive(updatedVpc);
      const updatedZdr = localStorage.getItem("biotarget_zdr_tunnel") !== "false";
      setZdrTunnelActive(updatedZdr);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Helper function to dynamically parse grounded source citations into styled interactive badges
  const renderGroundedText = (text: string) => {
    if (!text) return "";

    // Pre-clean spacing around punctuation and brackets
    const cleanedText = text
      .replace(/\s+([.,;:!])/g, "$1") // Remove space before periods, commas, colons
      .replace(/\[\s*(UniProt|ChEMBL|OpenTargets|PMID|NCT):\s*/g, "[$1:") // Clean internal bracket starts
      .replace(/\s*\]/g, "]"); // Clean internal bracket ends
    
    const regex = /\[(UniProt|ChEMBL|OpenTargets|PMID|NCT):\s*([a-zA-Z0-9_#-]+)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(cleanedText)) !== null) {
      const matchIndex = match.index;
      
      if (matchIndex > lastIndex) {
        parts.push(cleanedText.substring(lastIndex, matchIndex));
      }

      const type = match[1];
      const id = match[2];
      
      let url = "";
      let colorClass = "";
      let labelPrefix = "";
      if (type === "UniProt") {
        url = `https://www.uniprot.org/uniprotkb/${id}`;
        colorClass = "badge-cyan";
        labelPrefix = "U";
      } else if (type === "ChEMBL") {
        url = id.startsWith("CHEMBL") 
          ? `https://www.ebi.ac.uk/chembl/compound_report_card/${id}/`
          : `https://www.ebi.ac.uk/chembl/target_report_card/${id}/`;
        colorClass = "badge-purple";
        labelPrefix = "C";
      } else if (type === "OpenTargets") {
        url = `https://platform.opentargets.org/disease/${id}`;
        colorClass = "badge-gold";
        labelPrefix = "O";
      } else if (type === "PMID") {
        url = `https://pubmed.ncbi.nlm.nih.gov/${id}/`;
        colorClass = "badge-rose";
        labelPrefix = "P";
      } else if (type === "NCT") {
        url = `https://clinicaltrials.gov/study/${id}`;
        colorClass = "badge-purple";
        labelPrefix = "N";
      }

      parts.push(
        <a
          key={`cite-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`citation-badge badge ${colorClass}`}
          title={`Open source record for ${type}: ${id}`}
        >
          {labelPrefix} • {id}
        </a>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < cleanedText.length) {
      parts.push(cleanedText.substring(lastIndex));
    }

    return parts;
  };

  if (isLoading) {
    return (
      <div className="canvas-skeleton-container fade-in">
        <div className="skeleton-header">
          <div className="skeleton title-skeleton" />
          <div className="skeleton subtitle-skeleton" />
        </div>
        <div className="grid-cols-3">
          <div className="skeleton stat-card-skeleton" />
          <div className="skeleton stat-card-skeleton" />
          <div className="skeleton stat-card-skeleton" />
        </div>
        <div className="grid-cols-2">
          <div className="skeleton body-panel-skeleton" />
          <div className="skeleton body-panel-skeleton" />
        </div>
        <div className="skeleton table-skeleton" />
        <style>{`
          .canvas-skeleton-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          .skeleton-header {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .title-skeleton { width: 300px; height: 32px; }
          .subtitle-skeleton { width: 450px; height: 18px; }
          .stat-card-skeleton { height: 120px; border-radius: 12px; }
          .body-panel-skeleton { height: 380px; border-radius: 16px; }
          .table-skeleton { height: 260px; border-radius: 16px; }
        `}</style>
      </div>
    );
  }

  if (!data || !analysis) {
    return (
      <div className="canvas-error-container glass-card">
        <HelpCircle size={48} className="error-icon" />
        <h3>Data Fetch Interrupted</h3>
        <p>We could not pull the requested biological details. Please verify your internet connection or try another gene symbol.</p>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
        <style>{`
          .canvas-error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            gap: 1rem;
            padding: 4rem 2rem;
            max-width: 600px;
            margin: 4rem auto;
          }
          .error-icon { color: hsl(var(--accent-rose)); }
        `}</style>
      </div>
    );
  }

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 100);
  };

  if (printMode) {
    return <ReportPDF data={data} analysis={analysis} />;
  }

  // Calculate dependency percent for visual bar
  // Chronos score ranges from 0 (non-essential) to -1 (essential)
  const dependencyPercent = Math.min(100, Math.max(0, Math.round(Math.abs(data.depMap.dependencyScore) * 100)));

  return (
    <div className="canvas-container fade-in">
      {/* Canvas Top Bar */}
      <div className="canvas-header-row">
        <div className="target-badge-block">
          <button onClick={onBack} className="back-arrow-btn" aria-label="Back to Dashboard">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="gene-title-flex">
              <h2 className="canvas-gene-title">{data.geneSymbol}</h2>
              <span className="badge badge-cyan">Homo sapiens</span>
              {vpcTunnelActive && (
                <span className="badge badge-vpc-status">
                  <ShieldCheck size={10} className="shield-icon" /> VPC Secure Tunnel Active
                </span>
              )}
              {zdrTunnelActive && (
                <span className="badge badge-vpc-status border-rose">
                  <Shield size={10} className="shield-icon text-rose" /> ZDR Enabled
                </span>
              )}
            </div>
            <p className="canvas-gene-subtitle">{data.fullName}</p>
          </div>
        </div>

        <div className="action-buttons-group">
          <button onClick={onSave} className={`btn btn-secondary ${isSaved ? "saved-active" : ""}`}>
            <Save size={16} />
            <span>{isSaved ? "Saved to Target Pipeline" : "Save Target"}</span>
          </button>

          <button onClick={() => exportTargetToCSV(data, analysis)} className="btn btn-secondary">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} />
            <span>Generate PDF Report</span>
          </button>
        </div>
      </div>

      {/* Target Identifiers Glass Row */}
      <div className="identifiers-row glass-card">
        <div className="id-col">
          <span className="id-label">UniProt Accession</span>
          <a href={`https://www.uniprot.org/uniprotkb/${data.uniprotId}`} target="_blank" rel="noreferrer" className="id-val link">
            {data.uniprotId}
          </a>
        </div>
        <div className="id-col border-left">
          <span className="id-label">Ensembl Gene ID</span>
          <a href={`https://www.ensembl.org/id/${data.ensemblId}`} target="_blank" rel="noreferrer" className="id-val link">
            {data.ensemblId}
          </a>
        </div>
        <div className="id-col border-left">
          <span className="id-label">ChEMBL Target ID</span>
          <a href={`https://www.ebi.ac.uk/chembl/target_report_card/${data.chemblId}`} target="_blank" rel="noreferrer" className="id-val link">
            {data.chemblId}
          </a>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid-cols-3">
        <MetricCard
          title="Clinical Feasibility Score"
          value={`${analysis.feasibilityScore}/100`}
          icon={Sparkles}
          subtext="Target validation confidence index"
          progress={analysis.feasibilityScore}
          accentColor="cyan"
        />
        <MetricCard
          title="Associated Conditions"
          value={data.diseases.length}
          icon={BookOpen}
          subtext={`Highest association: ${data.diseases[0]?.name || "N/A"}`}
          accentColor="purple"
        />
        <MetricCard
          title="Pre-Clinical Compounds"
          value={data.compounds[0].chemblId === "CHEMBL-GEN" || data.compounds[0].chemblId === "CHEMBL0000" ? 0 : data.compounds.length}
          icon={CheckCircle}
          subtext="Lead molecules registered in ChEMBL"
          accentColor="gold"
        />
      </div>

      {/* Primary Double Column Canvas */}
      <div className="grid-cols-2">
        {/* Left Column: Biology Profile */}
        <div className="biology-profile-flex-col">
          {/* Functional Text */}
          <div className="functional-card glass-card">
            <div className="section-header">
              <MapPin size={16} />
              <span>Target Bio-Profile</span>
            </div>
            <p className="bio-summary-text">{renderGroundedText(data.functionSummary)}</p>
          </div>

          {/* CRISPR Dependency Card (Broad Institute DepMap) */}
          <div className="depmap-card glass-card">
            <div className="section-header">
              <FileText size={16} />
              <span>CRISPR DepMap Gene Knockout</span>
            </div>
            
            <div className="depmap-layout">
              <div className="depmap-gauge-section">
                <span className="depmap-metric-title">Chronos Dependency Score</span>
                <div className="depmap-score-row">
                  <span className="depmap-score-value font-mono">{data.depMap.dependencyScore.toFixed(2)}</span>
                  <span className={`badge ${data.depMap.dependencyScore < -0.5 ? "badge-rose" : "badge-purple"}`}>
                    {data.depMap.dependencyScore < -0.7 ? "Highly Essential" : data.depMap.dependencyScore < -0.4 ? "Moderately Essential" : "Non-Essential"}
                  </span>
                </div>
                
                {/* Horizontal Meter */}
                <div className="depmap-meter-track">
                  <div 
                    className={`depmap-meter-fill ${data.depMap.dependencyScore < -0.5 ? "fill-essential" : "fill-neutral"}`} 
                    style={{ width: `${dependencyPercent}%` }} 
                  />
                </div>
              </div>

              <div className="depmap-stats-grid">
                <div className="depmap-stat-item">
                  <span className="stat-meta-label">Tested Cell Lines</span>
                  <span className="stat-meta-val font-mono">{data.depMap.cellLinesTested}</span>
                </div>
                <div className="depmap-stat-item">
                  <span className="stat-meta-label">Strongly Dependent</span>
                  <span className="stat-meta-val font-mono text-cyan">{data.depMap.stronglyDependentLines}</span>
                </div>
                <div className="depmap-stat-item" style={{ gridColumn: "span 2" }}>
                  <span className="stat-meta-label">Top Vulnerable Tissue</span>
                  <span className="stat-meta-val font-semibold text-purple">{data.depMap.topDependentTissue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subcellular Localization Diagram */}
          <SubcellularVisualizer locations={data.subcellularLocation} />

          {/* Literature references */}
          <div className="literature-card glass-card">
            <div className="section-header">
              <BookOpen size={16} />
              <span>Core Medical Literature</span>
            </div>
            <div className="literature-list">
              {data.articles.map((art) => (
                <div key={art.pmid} className="literature-item">
                  <h4 className="article-title">{art.title}</h4>
                  <div className="article-meta">
                    <span>{art.authors}</span>
                    <span>•</span>
                    <span className="font-italic">{art.source}</span>
                    <span>•</span>
                    <span>{art.pubDate}</span>
                  </div>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${art.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-pubmed-link"
                  >
                    PubMed {art.pmid}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Validation Insights */}
        <div className="ai-insights-flex-col">
          {/* Executive Summary Card */}
          <div className="ai-executive-card glass-card ai-executive-panel">
            <div className="section-header">
              <Sparkles size={16} style={{ color: "hsl(var(--accent-cyan))" }} />
              <span>AI Validation Analysis</span>
            </div>
            <p className="ai-summary-text">{renderGroundedText(analysis.clinicalSummary)}</p>
          </div>

          {/* Intellectual Property (IP) Landscaping */}
          <div className="patents-card glass-card">
            <div className="section-header">
              <ShieldCheck size={16} />
              <span>Intellectual Property (IP) & FTO</span>
            </div>

            <div className="patents-layout-row">
              <div className="patent-stat">
                <span className="id-label">Registered Patent Families</span>
                <span className="patent-count font-mono">{data.patents.patentCount}</span>
              </div>
              <div className="patent-fto">
                <span className="id-label">Freedom-to-Operate (FTO)</span>
                <span className={`badge ${
                  data.patents.ftoStatus === "High Risk" ? "badge-rose" : data.patents.ftoStatus === "Medium Risk" ? "badge-gold" : "badge-cyan"
                } font-bold`}>
                  {data.patents.ftoStatus}
                </span>
              </div>
            </div>

            <div className="patents-assignees-box">
              <span className="id-label">Primary Patent Assignees</span>
              <div className="off-target-pills">
                {data.patents.primaryAssignees.map((a, idx) => (
                  <span key={idx} className="off-target-pill">{a}</span>
                ))}
              </div>
              <span className="patent-priority-date">Earliest Priority Registration Date: <strong>{data.patents.earliestPriorityDate}</strong></span>
            </div>
          </div>

          {/* Modalities Table */}
          <div className="modalities-card glass-card">
            <h3 className="card-sub-header">Therapeutic Modality Feasibility</h3>
            <div className="modalities-list">
              {analysis.therapeuticModalities.map((m, idx) => (
                <div key={idx} className="modality-row">
                  <div className="modality-title-flex">
                    <span className="modality-name">{m.modality}</span>
                    <span className={`badge ${
                      m.feasibility === "High" ? "badge-cyan" : m.feasibility === "Medium" ? "badge-gold" : "badge-rose"
                    }`}>
                      {m.feasibility} Feasibility
                    </span>
                  </div>
                  <p className="modality-description">{renderGroundedText(m.description)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Toxicity Card */}
          <div className="safety-card glass-card safety-risk-panel">
            <div className="section-header">
              <ShieldAlert size={16} style={{ color: "hsl(var(--accent-rose))" }} />
              <span className="text-rose-glow">Safety & Off-Target Risks</span>
            </div>

            <div className="safety-risk-level">
              <span className="risk-label">Overall Toxicity Risk Profile:</span>
              <span className={`badge ${
                analysis.safetyProfile.riskLevel === "High" ? "badge-rose" : "badge-gold"
              }`}>
                {analysis.safetyProfile.riskLevel} Risk
              </span>
            </div>

            <ul className="safety-warnings-list">
              {analysis.safetyProfile.warnings.map((w, idx) => (
                <li key={idx} className="safety-warning-item">
                  <span className="bullet-rose" />
                  <span>{renderGroundedText(w)}</span>
                </li>
              ))}
            </ul>

            <div className="off-target-panel">
              <span className="off-target-label">Flagged High-Risk Organs/Tissues:</span>
              <div className="off-target-pills">
                {analysis.safetyProfile.offTargetTissues.map((t, idx) => (
                  <span key={idx} className="off-target-pill">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="recommendations-card glass-card">
            <h3 className="card-sub-header">Proposed Wet-Lab Target Validation Roadmap</h3>
            <div className="steps-list">
              {analysis.recommendedNextSteps.map((step, idx) => (
                <div key={idx} className="step-item">
                  <div className="step-number">{idx + 1}</div>
                  <p className="step-text">{renderGroundedText(step)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Trials Registry Grid */}
      <div className="clinical-trials-card glass-card">
        <div className="section-header">
          <AlertCircle size={16} />
          <span>Clinical Trials Registry (ClinicalTrials.gov)</span>
        </div>
        
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "130px" }}>Trial NCT ID</th>
                <th>Trial Title</th>
                <th style={{ width: "100px" }}>Phase</th>
                <th style={{ width: "120px" }}>Clinical Status</th>
                <th>Target Conditions Scanned</th>
                <th>Efficacy / Safety Termination Reasons</th>
              </tr>
            </thead>
            <tbody>
              {data.clinicalTrials.map((t) => (
                <tr key={t.nctId} className="trend-row">
                  <td>
                    <a 
                      href={`https://clinicaltrials.gov/study/${t.nctId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="chembl-link font-semibold"
                    >
                      {t.nctId}
                    </a>
                  </td>
                  <td className="compound-name-cell" style={{ maxWidth: "220px" }}>{t.title}</td>
                  <td>
                    <span className="badge badge-purple">{t.phase}</span>
                  </td>
                  <td>
                    <span className={`badge ${
                      t.status === "Terminated" ? "badge-rose" : t.status === "Completed" ? "badge-cyan" : "badge-gold"
                    } font-bold`}>
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="font-semibold text-secondary">{t.conditions.join(", ")}</span>
                  </td>
                  <td className="reference-text-cell" style={{ maxWidth: "250px" }}>
                    {t.terminationReason ? (
                      <span className="text-rose font-semibold">{t.terminationReason}</span>
                    ) : (
                      <span className="text-muted">No safety terminations flagged</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bioactive Compounds Block */}
      <CompoundTable compounds={data.compounds} />

      {/* Database Releases Version Panel */}
      <div className="db-releases-panel glass-card">
        <span className="db-releases-title">Active Database Sync Release Timestamps:</span>
        <div className="db-releases-grid">
          {data.dbVersions.map((db, idx) => (
            <div key={idx} className="db-release-item">
              <span className="db-release-name">{db.name}:</span>
              <span className="db-release-version font-mono">{db.version}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .canvas-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .canvas-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        @media (max-width: 768px) {
          .canvas-header-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .target-badge-block {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-arrow-btn {
          width: 38px;
          height: 38px;
          border-radius: 4px;
          border: 1px solid hsl(var(--border-light));
          background: hsl(var(--bg-secondary));
          color: hsl(var(--text-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .back-arrow-btn:hover {
          color: hsl(var(--accent-cyan));
          border-color: hsl(var(--accent-cyan));
          background: hsl(var(--bg-tertiary));
        }

        .gene-title-flex {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .canvas-gene-title {
          font-family: var(--font-title);
          font-size: 1.75rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .badge-vpc-status {
          background: hsl(var(--accent-cyan) / 0.05);
          border: 1px solid hsl(var(--accent-cyan) / 0.25);
          color: hsl(var(--accent-cyan));
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
          font-size: 0.65rem;
        }

        .badge-vpc-status.border-rose {
          border-color: hsl(var(--accent-rose) / 0.25);
          background: hsl(var(--accent-rose) / 0.03);
          color: hsl(var(--accent-rose));
        }

        .shield-icon {
          flex-shrink: 0;
        }

        .canvas-gene-subtitle {
          color: hsl(var(--text-muted));
          font-size: 0.85rem;
          margin-top: 0.1rem;
        }

        .action-buttons-group {
          display: flex;
          gap: 0.5rem;
        }

        .saved-active {
          border-color: hsl(var(--accent-cyan) / 0.3);
          color: hsl(var(--accent-cyan));
          background: hsl(var(--accent-cyan) / 0.05);
        }

        .identifiers-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 0.85rem;
          background: hsl(var(--bg-secondary) / 0.4);
          gap: 1rem;
          border-radius: 6px;
        }
        @media (max-width: 640px) {
          .identifiers-row {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .identifiers-row .id-col.border-left {
            border-left: none;
            padding-left: 0;
          }
        }

        .id-col {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .id-col.border-left {
          border-left: 1px solid hsl(var(--border-light));
          padding-left: 1.25rem;
        }

        .id-label {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          color: hsl(var(--text-muted));
          letter-spacing: 0.05em;
        }

        .id-val {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 500;
        }
        .id-val.link {
          color: hsl(var(--accent-purple));
          text-decoration: none;
        }
        .id-val.link:hover {
          text-decoration: underline;
        }

        .biology-profile-flex-col, .ai-insights-flex-col {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .bio-summary-text, .ai-summary-text {
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          line-height: 1.5;
        }

        .ai-executive-panel {
          border: 1px solid hsl(var(--accent-cyan) / 0.2);
          background: hsl(var(--bg-secondary) / 0.3);
        }

        /* CRISPR DepMap Card Styling */
        .depmap-layout {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .depmap-gauge-section {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .depmap-metric-title {
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
          font-weight: 600;
          text-transform: uppercase;
        }

        .depmap-score-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .depmap-score-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .depmap-meter-track {
          height: 6px;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          border-radius: 9999px;
          overflow: hidden;
          width: 100%;
          margin-top: 0.15rem;
        }

        .depmap-meter-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.8s ease;
        }
        .fill-essential { background: hsl(var(--accent-rose)); }
        .fill-neutral { background: hsl(var(--accent-purple)); }

        .depmap-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          background: hsl(var(--bg-secondary) / 0.4);
          border: 1px solid hsl(var(--border-light));
          padding: 0.65rem 0.85rem;
          border-radius: 6px;
        }

        .depmap-stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .stat-meta-label {
          font-size: 0.65rem;
          color: hsl(var(--text-muted));
          text-transform: uppercase;
          font-weight: 500;
        }

        .stat-meta-val {
          font-size: 0.825rem;
          color: hsl(var(--text-primary));
        }

        /* IP Landscaping Card Styling */
        .patents-layout-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          border-bottom: 1px solid hsl(var(--border-light));
          padding-bottom: 0.65rem;
        }

        .patent-stat {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .patent-count {
          font-size: 1.25rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .patent-fto {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .patents-assignees-box {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.65rem;
        }

        .patent-priority-date {
          font-size: 0.7rem;
          color: hsl(var(--text-muted));
        }

        .card-sub-header {
          font-family: var(--font-title);
          font-size: 1rem;
          margin-bottom: 0.85rem;
          color: hsl(var(--text-primary));
          border-bottom: 1px solid hsl(var(--border-light));
          padding-bottom: 0.35rem;
        }

        .modalities-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .modality-row {
          background: hsl(var(--bg-secondary) / 0.2);
          border: 1px solid hsl(var(--border-light));
          padding: 0.75rem;
          border-radius: 6px;
        }

        .modality-title-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .modality-name {
          font-weight: 600;
          color: hsl(var(--text-primary));
          font-size: 0.825rem;
        }

        .modality-description {
          font-size: 0.775rem;
          color: hsl(var(--text-secondary));
          line-height: 1.4;
        }

        .safety-risk-panel {
          border: 1px solid hsl(var(--accent-rose) / 0.2);
          background: hsl(var(--bg-secondary) / 0.3);
        }

        .text-rose-glow {
          color: hsl(var(--text-primary));
        }

        .safety-risk-level {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
          font-size: 0.8rem;
        }

        .risk-label {
          color: hsl(var(--text-secondary));
          font-weight: 500;
        }

        .safety-warnings-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          list-style: none;
          margin-bottom: 1rem;
        }

        .safety-warning-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: hsl(var(--text-secondary));
          line-height: 1.45;
        }

        .bullet-rose {
          width: 5px;
          height: 5px;
          border-radius: 1px;
          background: hsl(var(--accent-rose));
          margin-top: 0.4rem;
          flex-shrink: 0;
        }

        .off-target-panel {
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .off-target-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: hsl(var(--text-muted));
        }

        .off-target-pills {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .off-target-pill {
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          font-size: 0.7rem;
          color: hsl(var(--text-secondary));
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .step-item {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
        }

        .step-number {
          width: 20px;
          height: 20px;
          border-radius: 3px;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          color: hsl(var(--accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          font-family: var(--font-mono);
          flex-shrink: 0;
        }

        .step-text {
          font-size: 0.775rem;
          color: hsl(var(--text-secondary));
          line-height: 1.4;
        }

        .literature-card {
          max-height: 380px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .literature-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .literature-item {
          padding-bottom: 0.65rem;
          border-bottom: 1px dashed hsl(var(--border-light));
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .literature-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .article-title {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 600;
          line-height: 1.35;
          color: hsl(var(--text-primary));
        }

        .article-meta {
          display: flex;
          gap: 0.3rem;
          font-size: 0.65rem;
          color: hsl(var(--text-muted));
          flex-wrap: wrap;
        }

        .article-pubmed-link {
          font-size: 0.65rem;
          font-family: var(--font-mono);
          color: hsl(var(--accent-purple));
          text-decoration: none;
          display: inline-block;
          margin-top: 0.1rem;
        }
        .article-pubmed-link:hover {
          text-decoration: underline;
        }

        /* Clinical Trials Card Styling */
        .clinical-trials-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chembl-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: hsl(var(--accent-purple));
          text-decoration: none;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
        }
        .chembl-link:hover {
          color: hsl(var(--text-primary));
          text-decoration: underline;
        }

        .text-rose {
          color: hsl(var(--accent-rose));
        }

        /* Database releases logs */
        .db-releases-panel {
          background: hsl(var(--bg-secondary) / 0.3);
          border: 1px solid hsl(var(--border-light));
          border-radius: 6px;
          padding: 0.75rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .db-releases-title {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-muted));
        }

        .db-releases-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        @media (max-width: 768px) {
          .db-releases-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .db-releases-grid {
            grid-template-columns: 1fr;
          }
        }

        .db-release-item {
          display: flex;
          gap: 0.35rem;
          font-size: 0.725rem;
        }

        .db-release-name {
          color: hsl(var(--text-secondary));
          font-weight: 500;
        }

        .db-release-version {
          color: hsl(var(--accent-cyan));
        }

        /* Clean Matte Citation Badges */
        .citation-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.08rem 0.3;
          font-family: var(--font-mono);
          font-size: 0.675rem;
          margin: 0 0.15rem;
          text-decoration: none;
          font-weight: 600;
          vertical-align: middle;
          border-radius: 3px;
          transition: var(--transition-fast);
          line-height: 1.1;
        }
        .citation-badge:hover {
          background: hsl(var(--bg-tertiary));
          color: hsl(var(--text-primary)) !important;
        }
      `}</style>
    </div>
  );
}
