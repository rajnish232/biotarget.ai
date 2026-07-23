import type { BioTargetData } from "../services/api";
import type { TargetAnalysis } from "../services/ai";
import { Dna, ShieldAlert, CheckCircle, FileText } from "lucide-react";

interface ReportPDFProps {
  data: BioTargetData;
  analysis: TargetAnalysis;
}

export default function ReportPDF({ data, analysis }: ReportPDFProps) {
  return (
    <div className="pdf-container">
      {/* Document Header */}
      <div className="pdf-header">
        <div className="pdf-brand">
          <Dna className="brand-logo" />
          <div>
            <h1 className="brand-name">BIOTARGET AI</h1>
            <p className="brand-slogan">Computational Drug Target Discovery Report</p>
          </div>
        </div>
        <div className="pdf-meta">
          <div><strong>Report ID:</strong> BT-{data.geneSymbol}-{data.uniprotId}</div>
          <div><strong>Generated:</strong> {new Date().toLocaleDateString()}</div>
          <div><strong>Classification:</strong> Confidential B2B Report</div>
        </div>
      </div>

      {/* Target Title */}
      <div className="pdf-title-block">
        <h2 className="target-title">{data.geneSymbol} Feasibility Analysis</h2>
        <p className="target-subtitle">{data.fullName} | Human Locus (Homo sapiens)</p>
      </div>

      {/* Grid: Stats */}
      <div className="pdf-grid-stats">
        <div className="pdf-stat-box">
          <span className="stat-label">Feasibility Score</span>
          <span className="stat-value text-cyan">{analysis.feasibilityScore}/100</span>
          <div className="pdf-score-bar-track">
            <div className="pdf-score-bar-fill fill-cyan" style={{ width: `${analysis.feasibilityScore}%` }} />
          </div>
        </div>
        <div className="pdf-stat-box">
          <span className="stat-label">Tractability Class</span>
          <span className="stat-value text-purple" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
            {analysis.tractabilityClass}
          </span>
          <span className="stat-subtext">Clinical Druggability</span>
        </div>
        <div className="pdf-stat-box">
          <span className="stat-label">Safety Risk Level</span>
          <span className={`stat-value ${analysis.safetyProfile.riskLevel === "High" ? "text-rose" : "text-gold"}`}>
            {analysis.safetyProfile.riskLevel}
          </span>
          <span className="stat-subtext">Preclinical Threshold</span>
        </div>
      </div>

      {/* Section: Clinical Summary */}
      <div className="pdf-section">
        <h3 className="pdf-section-title">1. Executive Summary & Clinical Intent</h3>
        <p className="pdf-body-text">{analysis.clinicalSummary}</p>
        
        <h4 className="pdf-subsection-title">Functional Profile (UniProt)</h4>
        <p className="pdf-body-text font-italic">{data.functionSummary}</p>
      </div>

      {/* Section: CRISPR DepMap */}
      <div className="pdf-section">
        <h3 className="pdf-section-title">2. CRISPR DepMap Target Vulnerability</h3>
        <p className="pdf-body-text">
          Target validation is grounded by Broad Institute DepMap public CRISPR knockout screens. 
          The Chronos dependency score scales to **{data.depMap.dependencyScore.toFixed(2)}** across **{data.depMap.cellLinesTested}** tested cell lines. 
          Strong dependency was flagged in **{data.depMap.stronglyDependentLines}** lines, with the highest cellular vulnerability observed in **{data.depMap.topDependentTissue}** lineages.
        </p>
      </div>

      {/* Section: Pathways & Location */}
      <div className="pdf-section">
        <h3 className="pdf-section-title">3. Subcellular Distribution & Signaling</h3>
        <div className="pdf-two-col">
          <div>
            <h4 className="pdf-subsection-title">Subcellular Localization</h4>
            <ul className="pdf-list">
              {data.subcellularLocation.map((loc, idx) => (
                <li key={idx}>{loc}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="pdf-subsection-title">Signal Cascades Involved</h4>
            <ul className="pdf-list">
              {data.pathways.map((path, idx) => (
                <li key={idx}>{path}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section: Target-Disease Linkage */}
      <div className="pdf-section">
        <h3 className="pdf-section-title">4. Target-Disease Correlation (OpenTargets)</h3>
        <table className="pdf-table">
          <thead>
            <tr>
              <th>Disease Name</th>
              <th>EFO Ontology ID</th>
              <th className="align-right">Association Score</th>
            </tr>
          </thead>
          <tbody>
            {data.diseases.map((d) => (
              <tr key={d.diseaseId}>
                <td className="font-bold">{d.name}</td>
                <td className="font-mono">{d.diseaseId}</td>
                <td className="align-right font-mono font-bold text-cyan">{d.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section: Compound Summary */}
      <div className="pdf-section page-break-before">
        <h3 className="pdf-section-title">5. Active Inhibitor Candidates (ChEMBL)</h3>
        <table className="pdf-table">
          <thead>
            <tr>
              <th>Compound ID</th>
              <th>Candidate Name</th>
              <th>Class</th>
              <th>Metric</th>
              <th className="align-right">Affinity</th>
            </tr>
          </thead>
          <tbody>
            {data.compounds.map((c) => (
              <tr key={c.chemblId}>
                <td className="font-mono">{c.chemblId}</td>
                <td className="font-bold">{c.name}</td>
                <td>{c.type}</td>
                <td>{c.relation}</td>
                <td className="align-right font-mono text-cyan font-bold">{c.value} {c.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section: Clinical Trials */}
      <div className="pdf-section">
        <h3 className="pdf-section-title">6. Clinical Trials Register (ClinicalTrials.gov)</h3>
        <table className="pdf-table">
          <thead>
            <tr>
              <th>Trial ID</th>
              <th>Phase</th>
              <th>Status</th>
              <th>Indications / Conditions</th>
              <th>Safety Outcomes / Termination Details</th>
            </tr>
          </thead>
          <tbody>
            {data.clinicalTrials.map((t) => (
              <tr key={t.nctId}>
                <td className="font-mono font-bold">{t.nctId}</td>
                <td>{t.phase}</td>
                <td>
                  <span className={t.status === "Terminated" ? "text-rose font-bold" : "text-cyan font-bold"}>
                    {t.status.toUpperCase()}
                  </span>
                </td>
                <td>{t.conditions.join(", ")}</td>
                <td>
                  {t.terminationReason ? (
                    <strong className="text-rose font-italic">{t.terminationReason}</strong>
                  ) : (
                    <span className="text-muted">No safety triggers flagged</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section: Intellectual Property */}
      <div className="pdf-section">
        <h3 className="pdf-section-title">7. Intellectual Property & Freedom-to-Operate</h3>
        <p className="pdf-body-text">
          IP Landscapes flag **{data.patents.patentCount}** patent families associated with target inhibition. 
          Earliest priority date registers on **{data.patents.earliestPriorityDate}**. 
          Primary Assignees include: **{data.patents.primaryAssignees.join(", ")}**.
          Freedom-to-Operate rating: **{data.patents.ftoStatus.toUpperCase()}**.
        </p>
      </div>

      {/* Section: Safety Risk Profile */}
      <div className="pdf-section page-break-before">
        <h3 className="pdf-section-title">8. Safety & Toxicity Risk Assessment</h3>
        <div className="pdf-alert-box">
          <ShieldAlert className="pdf-alert-icon" />
          <div>
            <strong className="text-rose">Toxicity Alert Warnings:</strong>
            <ul className="pdf-list margin-top-sm">
              {analysis.safetyProfile.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="pdf-body-text margin-top-md">
          <strong>Key Off-Target Tissues:</strong> {analysis.safetyProfile.offTargetTissues.join(", ")}
        </p>
      </div>

      {/* Section: Recommendations */}
      <div className="pdf-section">
        <h3 className="pdf-section-title">9. Proposed Next Wet-Lab Steps</h3>
        <ol className="pdf-ordered-list">
          {analysis.recommendedNextSteps.map((step, idx) => (
            <li key={idx} className="pdf-ordered-item">
              <CheckCircle className="pdf-step-icon" size={14} />
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Sync Log Metadata Table */}
      <div className="pdf-section" style={{ borderTop: "1px solid #ddd", paddingTop: "1rem", marginTop: "2rem" }}>
        <h4 className="pdf-subsection-title" style={{ marginTop: 0 }}>Active Database Version Sync Registry</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.7rem", color: "#666" }}>
          {data.dbVersions.map((db, idx) => (
            <div key={idx}>
              <strong>{db.name}:</strong> {db.version}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pdf-footer">
        <FileText size={12} />
        <span>Generated by BioTarget AI SaaS. Secure VPC Proxy Validation Active. All rights reserved.</span>
      </div>

      <style>{`
        .pdf-container {
          padding: 2.5rem;
          color: #222;
          background: #fff;
          font-family: 'Inter', sans-serif;
          max-width: 850px;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }

        .pdf-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #222;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }

        .pdf-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-logo {
          color: #00bcd4;
          width: 32px;
          height: 32px;
        }

        .brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 800;
          color: #111;
        }

        .brand-slogan {
          font-size: 0.7rem;
          color: #555;
        }

        .pdf-meta {
          font-size: 0.75rem;
          text-align: right;
          color: #555;
          line-height: 1.5;
        }

        .pdf-title-block {
          margin-bottom: 1.5rem;
        }

        .target-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #111;
        }

        .target-subtitle {
          font-size: 0.85rem;
          color: #555;
          margin-top: 0.25rem;
        }

        .pdf-grid-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .pdf-stat-box {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 0.75rem;
          text-align: center;
          background: #fafafa;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 80px;
        }

        .stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: #666;
          font-weight: 600;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .stat-subtext {
          font-size: 0.65rem;
          color: #777;
          margin-top: 0.2rem;
        }

        .pdf-score-bar-track {
          width: 80px;
          height: 4px;
          background: #eee;
          border-radius: 99px;
          overflow: hidden;
          margin-top: 0.35rem;
        }

        .pdf-score-bar-fill {
          height: 100%;
          border-radius: 99px;
        }

        .fill-cyan { background: #009688; }
        .text-cyan { color: #009688; }
        .text-purple { color: #673ab7; }
        .text-rose { color: #e91e63; }
        .text-gold { color: #ff9800; }
        .text-muted { color: #777; }

        .pdf-section {
          margin-bottom: 2rem;
        }

        .pdf-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.35rem;
          margin-bottom: 0.75rem;
          color: #222;
        }

        .pdf-subsection-title {
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.35rem;
          color: #444;
        }

        .pdf-body-text {
          font-size: 0.825rem;
          line-height: 1.5;
          color: #444;
        }

        .font-italic { font-style: italic; }
        .font-bold { font-weight: 600; }
        .font-mono { font-family: monospace; }
        .margin-top-sm { margin-top: 0.25rem; }
        .margin-top-md { margin-top: 0.75rem; }

        .pdf-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .pdf-list {
          list-style-type: square;
          padding-left: 1.25rem;
          font-size: 0.8rem;
          color: #444;
          line-height: 1.5;
        }

        .pdf-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        .pdf-table th {
          background: #f5f5f5;
          color: #333;
          font-weight: 600;
          text-align: left;
          padding: 0.5rem;
          border: 1px solid #ddd;
        }

        .pdf-table td {
          padding: 0.5rem;
          border: 1px solid #ddd;
          color: #444;
        }

        .pdf-alert-box {
          border: 1px solid #ffd54f;
          background: #fffde7;
          border-radius: 4px;
          padding: 0.75rem;
          display: flex;
          gap: 0.75rem;
          font-size: 0.8rem;
        }

        .pdf-alert-icon {
          color: #f57f17;
          flex-shrink: 0;
        }

        .pdf-ordered-list {
          padding-left: 0;
          list-style: none;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .pdf-ordered-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #444;
        }

        .pdf-step-icon {
          color: #4caf50;
          margin-top: 0.15rem;
          flex-shrink: 0;
        }

        .pdf-footer {
          margin-top: 3rem;
          border-top: 1px solid #eee;
          padding-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.65rem;
          color: #888;
        }

        .align-right { text-align: right; }

        @media print {
          /* Safely hide workspace elements without hiding the report container */
          .sidebar,
          aside,
          .canvas-header-row,
          .action-buttons-group,
          .back-arrow-btn,
          .discovery-header-actions,
          button {
            display: none !important;
          }

          .app-container {
            display: block !important;
          }

          .main-content {
            margin-left: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          .pdf-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 2rem !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
          }

          .pdf-grid-stats {
            display: flex !important;
            gap: 1rem !important;
          }

          .pdf-stat-box {
            flex: 1 !important;
          }

          .pdf-section {
            page-break-inside: avoid !important;
          }

          .page-break-before {
            page-break-before: always !important;
          }
        }
      `}</style>
    </div>
  );
}
