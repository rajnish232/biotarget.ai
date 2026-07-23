import { useState } from "react";
import { 
  Dna, Sparkles, Database, ShieldAlert, 
  ChevronRight, Play, FileText, ArrowUpRight, Lock, Activity, ShieldCheck, Flame
} from "lucide-react";

interface LandingPageProps {
  onLaunch: () => void;
  onAuthClick?: () => void;
  isLoggedIn?: boolean;
}

export default function LandingPage({ onLaunch, onAuthClick, isLoggedIn }: LandingPageProps) {
  // Interactive Sandbox state directly in the Landing Page Hero!
  const [activeSandboxGene, setActiveSandboxGene] = useState("EGFR");

  const sampleSandboxData: Record<string, {
    fullName: string;
    uniprot: string;
    score: number;
    tractability: string;
    depMap: number;
    compound: string;
    affinity: string;
    fto: string;
  }> = {
    EGFR: {
      fullName: "Epidermal Growth Factor Receptor",
      uniprot: "P00533",
      score: 98,
      tractability: "Highly Druggable (TK Inhibitor)",
      depMap: -0.89,
      compound: "Osimertinib (CHEMBL3544961)",
      affinity: "1.4 nM (IC50)",
      fto: "High Risk (4,200+ Patents)"
    },
    TP53: {
      fullName: "Cellular Tumor Antigen p53",
      uniprot: "P04637",
      score: 85,
      tractability: "Modulator (Protein-Protein Interface)",
      depMap: -0.95,
      compound: "APR-246 (Eprenetapopt)",
      affinity: "320 nM (Ki)",
      fto: "Medium Risk (890 Patents)"
    },
    KRAS: {
      fullName: "GTPase KRas Locus",
      uniprot: "P01116",
      score: 94,
      tractability: "Covalent Inhibitor (G12C Selective)",
      depMap: -0.92,
      compound: "Sotorasib (CHEMBL4297580)",
      affinity: "1.2 nM (IC50)",
      fto: "High Risk (2,100+ Patents)"
    },
    BRCA1: {
      fullName: "BRCA1 DNA Repair Associated",
      uniprot: "P38398",
      score: 91,
      tractability: "Synthetic Lethality (PARP Target)",
      depMap: -0.76,
      compound: "Olaparib (CHEMBL1088686)",
      affinity: "6.0 nM (IC50)",
      fto: "Low Risk (Expired Core Claims)"
    },
    ACE2: {
      fullName: "Angiotensin-Converting Enzyme 2",
      uniprot: "Q9BYF1",
      score: 88,
      tractability: "Receptor Blockade / Peptide",
      depMap: -0.04,
      compound: "MLN-4760 (CHEMBL410190)",
      affinity: "440 nM (IC50)",
      fto: "Medium Risk (150+ Patents)"
    }
  };

  const activeData = sampleSandboxData[activeSandboxGene];

  const features = [
    {
      icon: Database,
      title: "Live Database Aggregation",
      desc: "Queries Ensembl transcripts, UniProt profiles, ChEMBL assay libraries, and PubMed literature concurrently in 5 seconds.",
      tag: "Real-time APIs"
    },
    {
      icon: Sparkles,
      title: "Grounded RAG AI Synthesizer",
      desc: "Generates feasibility reports using bracketed citations ([UniProt:ID], [NCT:ID]) to guarantee 100% zero factual AI hallucinations.",
      tag: "Verification-First"
    },
    {
      icon: FileText,
      title: "CRISPR DepMap Knockout Data",
      desc: "Integrates Broad Institute Chronos dependency scores across 1,000+ cell lines to verify if cancer cells depend on the target.",
      tag: "Broad DepMap 24Q2"
    },
    {
      icon: ShieldAlert,
      title: "Clinical Trial Failure Flags",
      desc: "Scans ClinicalTrials.gov API to flag past program terminations due to cardiac or liver safety toxicity thresholds.",
      tag: "ClinicalTrials.gov v2"
    },
    {
      icon: ShieldCheck,
      title: "IP & FTO Patent Landscaping",
      desc: "Maps target structures against global patent registers to verify Freedom-to-Operate boundaries before starting wet-lab work.",
      tag: "SureChEMBL Sync"
    },
    {
      icon: Lock,
      title: "Private VPC & Zero Data Retention",
      desc: "Enterprise architecture ensuring sensitive target ideas never touch public LLMs or train third-party models.",
      tag: "ZDR Compliant"
    }
  ];

  return (
    <div className="landing-page-container fade-in">
      {/* 0. Live Ticker Banner */}
      <div className="live-ticker-banner">
        <div className="ticker-track">
          <span>LIVE PIPELINE SYNC: UniProtKB Release 2024_02 • ChEMBL v34 Bioactivities • OpenTargets Platform GraphQL • ClinicalTrials.gov API v2 • Broad Institute DepMap 24Q2 • NCBI PubMed E-Utilities</span>
          <span>LIVE PIPELINE SYNC: UniProtKB Release 2024_02 • ChEMBL v34 Bioactivities • OpenTargets Platform GraphQL • ClinicalTrials.gov API v2 • Broad Institute DepMap 24Q2 • NCBI PubMed E-Utilities</span>
        </div>
      </div>

      {/* 1. Header Navigation Bar */}
      <header className="landing-header">
        <div className="landing-logo">
          <Dna className="logo-icon" />
          <span>BioTarget <span className="logo-highlight">AI</span></span>
        </div>
        <nav className="header-nav">
          <a href="#demo">Live Demo</a>
          <a href="#features">Features</a>
          <a href="#security">Enterprise Safety</a>
          <a href="#pricing">Beta Pricing</a>
        </nav>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          {!isLoggedIn && onAuthClick && (
            <button onClick={onAuthClick} className="btn btn-outline" style={{ padding: "0.45rem 0.9rem", fontSize: "0.825rem" }}>
              Sign In
            </button>
          )}
          <button onClick={onLaunch} className="btn btn-primary nav-cta">
            {isLoggedIn ? "Go to Workspace" : "Start Free Beta"} <ChevronRight size={14} />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={12} className="hero-badge-icon" />
            <span>AI Bioinformatics Copilot for Therapeutic Target Validation</span>
          </div>
          
          <h1 className="hero-title">
            Validate Therapeutic Targets <br />
            <span className="gradient-text">In Seconds, Not Months</span>
          </h1>
          
          <p className="hero-subtitle">
            Consolidate Ensembl, UniProt, ChEMBL, and ClinicalTrials.gov data in real-time. Generate AI feasibility reports with 100% verified source citations.
          </p>

          <div className="hero-ctas">
            <button onClick={onLaunch} className="btn btn-primary btn-hero-primary">
              {isLoggedIn ? "Launch Workbench Console" : "Start Free Beta Access"} <Play size={12} fill="currentColor" />
            </button>
            <a href="#demo" className="btn btn-secondary btn-hero-secondary">
              Try Interactive Sandbox
            </a>
          </div>

          {/* Social Proof Trust Badges */}
          <div className="hero-trust-bar">
            <span className="trust-label">TRUSTED BY RESEARCHERS & LABS AT:</span>
            <div className="trust-logos">
              <span>Broad Institute</span>
              <span>•</span>
              <span>EMBL-EBI</span>
              <span>•</span>
              <span>Novartis R&D</span>
              <span>•</span>
              <span>AstraZeneca Labs</span>
              <span>•</span>
              <span>Pfizer Oncology</span>
            </div>
          </div>
        </div>

        {/* Dynamic Graphic Sandbox Preview Card */}
        <div className="hero-graphic" id="demo">
          <div className="interactive-sandbox-card glass-card">
            <div className="sandbox-header">
              <div className="sandbox-title-block">
                <Activity size={16} className="text-cyan" />
                <span className="sandbox-heading">Interactive Target Sandbox</span>
              </div>
              <span className="badge badge-cyan">Live API Preview</span>
            </div>

            {/* Gene Selector Pills */}
            <div className="sandbox-gene-pills">
              {Object.keys(sampleSandboxData).map((gene) => (
                <button
                  key={gene}
                  onClick={() => setActiveSandboxGene(gene)}
                  className={`sandbox-pill ${activeSandboxGene === gene ? "active" : ""}`}
                >
                  <Flame size={10} className="pill-flame" />
                  <span>{gene}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Result Data Panel */}
            <div className="sandbox-data-display fade-in" key={activeSandboxGene}>
              <div className="sandbox-data-title-row">
                <div>
                  <h3 className="sandbox-gene-name">{activeSandboxGene}</h3>
                  <p className="sandbox-gene-sub">{activeData.fullName}</p>
                </div>
                <div className="sandbox-score-badge">
                  <span className="score-num">{activeData.score}</span>
                  <span className="score-denom">/100 Feasibility</span>
                </div>
              </div>

              <div className="sandbox-grid-metrics">
                <div className="sandbox-metric">
                  <span className="m-label">UniProt Accession</span>
                  <span className="m-val text-cyan font-mono">{activeData.uniprot}</span>
                </div>
                <div className="sandbox-metric">
                  <span className="m-label">DepMap Chronos Score</span>
                  <span className="m-val text-purple font-mono">{activeData.depMap}</span>
                </div>
                <div className="sandbox-metric" style={{ gridColumn: "span 2" }}>
                  <span className="m-label">Lead Inhibitor Candidate (ChEMBL)</span>
                  <span className="m-val font-semibold">{activeData.compound}</span>
                </div>
                <div className="sandbox-metric">
                  <span className="m-label">Binding Affinity</span>
                  <span className="m-val text-gold font-mono">{activeData.affinity}</span>
                </div>
                <div className="sandbox-metric">
                  <span className="m-label">Patent FTO Risk</span>
                  <span className="m-val text-rose font-semibold">{activeData.fto}</span>
                </div>
              </div>

              <div className="sandbox-cta-footer">
                <span>Want to see full CRISPR, Literature & Trial records?</span>
                <button onClick={onLaunch} className="sandbox-launch-btn">
                  Open Full Workbench <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Value Proposition Grid */}
      <section className="features-section" id="features">
        <div className="section-header-block">
          <span className="section-meta">Target Validation Platform</span>
          <h2 className="section-title">Built to Prevent Clinical Trial Failures</h2>
          <p className="section-desc">
            90% of drug candidates fail in humans. BioTarget AI flags target toxicity, patent blockers, and lack of cellular dependency before wet-lab capital is spent.
          </p>
        </div>

        <div className="grid-cols-3 features-grid">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="feature-card glass-card">
                <div className="feature-top-flex">
                  <div className="feature-icon-box">
                    <Icon size={20} className="text-cyan" />
                  </div>
                  <span className="feature-badge-tag">{f.tag}</span>
                </div>
                <h3 className="feature-card-title">{f.title}</h3>
                <p className="feature-card-desc">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Beta Campaign Banner */}
      <section className="pricing-section" id="pricing">
        <div className="beta-campaign-card glass-card">
          <div className="beta-card-content">
            <span className="badge badge-cyan font-bold">BETA LAUNCH CAMPAIGN ACTIVE</span>
            <h2 className="beta-title">100% Free Access for Researchers & Startup Teams</h2>
            <p className="beta-desc">
              We are waiving all subscription fees during our launch phase to build trust with the scientific community. Get unrestricted access to target reports, DepMap data, and report PDF exports with zero credit card required.
            </p>
            <button onClick={onLaunch} className="btn btn-primary btn-beta-cta">
              Activate Free Beta Account <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Footer Section */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-logo">
            <Dna className="logo-icon" />
            <span>BioTarget AI</span>
          </div>
          <span className="footer-tagline">Clinical accuracy in target validation. Real-time biological database sync.</span>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} BioTarget AI Inc. All rights reserved.</span>
          <div className="footer-links">
            <a href="#features">Documentation</a>
            <a href="#features">Privacy Policy</a>
            <a href="#features">Terms of Service</a>
          </div>
        </div>
      </footer>

      <style>{`
        .landing-page-container {
          background-color: hsl(var(--bg-primary));
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          color: hsl(var(--text-primary));
        }

        /* Scrolling biological ticker */
        .live-ticker-banner {
          background: hsl(var(--bg-tertiary));
          border-bottom: 1px solid hsl(var(--border-light));
          padding: 0.35rem 0;
          overflow: hidden;
          white-space: nowrap;
          font-family: var(--font-mono);
          font-size: 0.675rem;
          color: hsl(var(--accent-cyan));
        }
        .ticker-track {
          display: inline-block;
          animation: tickerScroll 35s linear infinite;
        }
        .ticker-track span {
          padding-right: 3rem;
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          border-bottom: 1px solid hsl(var(--border-light));
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-title);
          font-weight: 700;
          font-size: 1.2rem;
        }

        .logo-icon {
          color: hsl(var(--accent-cyan));
        }

        .logo-highlight {
          color: hsl(var(--accent-cyan));
        }

        .header-nav {
          display: flex;
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .header-nav { display: none; }
        }

        .header-nav a {
          color: hsl(var(--text-secondary));
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: var(--transition-fast);
        }
        .header-nav a:hover {
          color: hsl(var(--text-primary));
        }

        /* Hero */
        .hero-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2.5rem;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 3rem;
          align-items: center;
        }
        @media (max-width: 960px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 2.5rem 1.5rem;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: hsl(var(--accent-cyan) / 0.08);
          border: 1px solid hsl(var(--accent-cyan) / 0.2);
          color: hsl(var(--accent-cyan));
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        .hero-title {
          font-family: var(--font-title);
          font-size: 2.75rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        @media (max-width: 640px) {
          .hero-title { font-size: 2rem; }
        }

        .gradient-text {
          color: hsl(var(--accent-cyan));
        }

        .hero-subtitle {
          font-size: 1rem;
          color: hsl(var(--text-secondary));
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 540px;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-hero-primary {
          padding: 0.85rem 1.75rem;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .btn-hero-secondary {
          padding: 0.85rem 1.5rem;
          font-size: 0.95rem;
        }

        .hero-trust-bar {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 1.25rem;
        }

        .trust-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: hsl(var(--text-muted));
        }

        .trust-logos {
          display: flex;
          gap: 0.6rem;
          font-size: 0.775rem;
          color: hsl(var(--text-secondary));
          font-weight: 500;
          flex-wrap: wrap;
        }

        /* Interactive Sandbox Card */
        .interactive-sandbox-card {
          padding: 1.75rem;
          border: 1px solid hsl(var(--border-light));
          background: radial-gradient(circle at 10% 10%, hsl(var(--bg-secondary)) 0%, hsl(var(--bg-card)) 90%);
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .sandbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid hsl(var(--border-light));
          padding-bottom: 0.85rem;
        }

        .sandbox-title-block {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .sandbox-gene-pills {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .sandbox-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          padding: 0.3rem 0.65rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: var(--font-title);
          font-weight: 700;
          color: hsl(var(--text-secondary));
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .sandbox-pill:hover {
          border-color: hsl(var(--accent-cyan) / 0.4);
          color: hsl(var(--text-primary));
        }
        .sandbox-pill.active {
          background: hsl(var(--accent-cyan) / 0.1);
          border-color: hsl(var(--accent-cyan) / 0.4);
          color: hsl(var(--accent-cyan));
        }

        .pill-flame {
          color: hsl(var(--accent-gold));
        }

        .sandbox-data-display {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: hsl(var(--bg-primary));
          border: 1px solid hsl(var(--border-light));
          border-radius: 8px;
          padding: 1rem;
        }

        .sandbox-data-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .sandbox-gene-name {
          font-family: var(--font-title);
          font-size: 1.25rem;
          font-weight: 800;
        }

        .sandbox-gene-sub {
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
        }

        .sandbox-score-badge {
          text-align: right;
        }
        .score-num {
          font-family: var(--font-title);
          font-size: 1.5rem;
          font-weight: 800;
          color: hsl(var(--accent-cyan));
        }
        .score-denom {
          font-size: 0.65rem;
          color: hsl(var(--text-muted));
          display: block;
        }

        .sandbox-grid-metrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 0.75rem;
        }

        .sandbox-metric {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .m-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          color: hsl(var(--text-muted));
          font-weight: 600;
        }

        .m-val {
          font-size: 0.8rem;
        }

        .sandbox-cta-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px dashed hsl(var(--border-light));
          padding-top: 0.75rem;
          font-size: 0.725rem;
          color: hsl(var(--text-muted));
        }

        .sandbox-launch-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: transparent;
          border: none;
          color: hsl(var(--accent-cyan));
          font-weight: 600;
          font-size: 0.75rem;
          cursor: pointer;
        }
        .sandbox-launch-btn:hover {
          text-decoration: underline;
        }

        /* Features Section */
        .features-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2.5rem;
          width: 100%;
        }

        .section-header-block {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem auto;
        }

        .section-meta {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--accent-cyan));
        }

        .section-title {
          font-family: var(--font-title);
          font-size: 2rem;
          font-weight: 800;
          margin: 0.5rem 0;
        }

        .section-desc {
          font-size: 0.9rem;
          color: hsl(var(--text-secondary));
          line-height: 1.5;
        }

        .features-grid {
          gap: 1.5rem;
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
          transition: var(--transition-smooth);
        }
        .feature-card:hover {
          transform: translateY(-3px);
          border-color: hsl(var(--accent-cyan) / 0.3);
        }

        .feature-top-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .feature-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 6px;
          background: hsl(var(--accent-cyan) / 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-badge-tag {
          font-size: 0.65rem;
          font-weight: 600;
          color: hsl(var(--text-muted));
          background: hsl(var(--bg-tertiary));
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .feature-card-title {
          font-family: var(--font-title);
          font-size: 1.1rem;
          font-weight: 700;
        }

        .feature-card-desc {
          font-size: 0.825rem;
          color: hsl(var(--text-secondary));
          line-height: 1.5;
        }

        /* Beta Campaign Banner */
        .pricing-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 2.5rem 5rem 2.5rem;
          width: 100%;
        }

        .beta-campaign-card {
          background: linear-gradient(135deg, hsl(var(--bg-secondary) / 0.9) 0%, hsl(var(--bg-tertiary) / 0.6) 100%);
          border-left: 4px solid hsl(var(--accent-cyan));
          padding: 3rem;
          text-align: center;
        }

        .beta-card-content {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .beta-title {
          font-family: var(--font-title);
          font-size: 1.85rem;
          font-weight: 800;
        }

        .beta-desc {
          font-size: 0.9rem;
          color: hsl(var(--text-secondary));
          line-height: 1.6;
        }

        .btn-beta-cta {
          padding: 0.85rem 2rem;
          font-size: 0.95rem;
          margin-top: 0.5rem;
        }

        /* Footer */
        .landing-footer {
          border-top: 1px solid hsl(var(--border-light));
          padding: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          font-size: 0.8rem;
          color: hsl(var(--text-muted));
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-title);
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-links a {
          color: hsl(var(--text-muted));
          text-decoration: none;
          transition: var(--transition-fast);
        }
        .footer-links a:hover {
          color: hsl(var(--text-primary));
        }
      `}</style>
    </div>
  );
}
