import { useState } from "react";
import { 
  Dna, Sparkles, ShieldAlert, 
  ChevronRight, Play, Lock, Activity, ShieldCheck, Flame,
  Box, Users, GitCompare, Download, Heart, CheckCircle2, ArrowRight
} from "lucide-react";

interface LandingPageProps {
  onLaunch: () => void;
  onAuthClick?: () => void;
  isLoggedIn?: boolean;
}

export default function LandingPage({ onLaunch, onAuthClick, isLoggedIn }: LandingPageProps) {
  // Interactive Sandbox state in Hero
  const [activeSandboxGene, setActiveSandboxGene] = useState("EGFR");

  const sampleSandboxData: Record<string, {
    fullName: string;
    uniprot: string;
    pdbId: string;
    score: number;
    tractability: string;
    depMap: number;
    compound: string;
    affinity: string;
    toxRisk: string;
    fto: string;
  }> = {
    EGFR: {
      fullName: "Epidermal Growth Factor Receptor",
      uniprot: "P00533",
      pdbId: "1M17 (2.60 Å)",
      score: 98,
      tractability: "Highly Druggable (TK Inhibitor)",
      depMap: -0.89,
      compound: "Osimertinib (CHEMBL3544961)",
      affinity: "1.4 nM (IC50)",
      toxRisk: "3.5% Pneumonitis Warning",
      fto: "High Risk (4,200+ Patents)"
    },
    TP53: {
      fullName: "Cellular Tumor Antigen p53",
      uniprot: "P04637",
      pdbId: "1TUP (2.20 Å)",
      score: 85,
      tractability: "Modulator (Protein-Protein Interface)",
      depMap: -0.95,
      compound: "APR-246 (Eprenetapopt)",
      affinity: "320 nM (Ki)",
      toxRisk: "Myocardial Apoptosis Alert",
      fto: "Medium Risk (890 Patents)"
    },
    KRAS: {
      fullName: "GTPase KRas Locus",
      uniprot: "P01116",
      pdbId: "6OIM (1.65 Å)",
      score: 94,
      tractability: "Covalent Inhibitor (G12C Selective)",
      depMap: -0.92,
      compound: "Sotorasib (CHEMBL4297580)",
      affinity: "1.2 nM (IC50)",
      toxRisk: "Grade 3/4 Hepatotoxicity",
      fto: "High Risk (2,100+ Patents)"
    },
    BRCA1: {
      fullName: "BRCA1 DNA Repair Associated",
      uniprot: "P38398",
      pdbId: "1JM7 (1.85 Å)",
      score: 91,
      tractability: "Synthetic Lethality (PARP Target)",
      depMap: -0.76,
      compound: "Olaparib (CHEMBL1088686)",
      affinity: "6.0 nM (IC50)",
      toxRisk: "Low Myelosuppression Risk",
      fto: "Low Risk (Expired Core Claims)"
    },
    ACE2: {
      fullName: "Angiotensin-Converting Enzyme 2",
      uniprot: "Q9BYF1",
      pdbId: "6M0J (2.45 Å)",
      score: 88,
      tractability: "Receptor Blockade / Peptide",
      depMap: -0.04,
      compound: "MLN-4760 (CHEMBL410190)",
      affinity: "440 nM (IC50)",
      toxRisk: "Low Cardiac Expression",
      fto: "Medium Risk (150+ Patents)"
    }
  };

  const activeData = sampleSandboxData[activeSandboxGene];

  const mainFeatures = [
    {
      icon: Box,
      title: "3D Interactive Protein Pocket Architecture Visualizer",
      subtitle: "RCSB PDB & AlphaFold 3D Engine",
      desc: "Renders real-time 3D protein structures with 360° mouse rotation, solvent surface toggles, and active catalytic site residue mapping (Lys745, Cys797).",
      tag: "Live PDB & AlphaFold",
      badgeColor: "badge-cyan"
    },
    {
      icon: ShieldAlert,
      title: "FDA Failure Post-Mortem & Organ Toxicity Heatmap",
      subtitle: "OpenFDA & GTEx Adverse Profiler",
      desc: "Displays organ risk gauges (Heart, Liver, Lung) and scans ClinicalTrials.gov archives to extract exact termination reasons for past failed competitor trials.",
      tag: "OpenFDA Adverse Logs",
      badgeColor: "badge-rose"
    },
    {
      icon: GitCompare,
      title: "Side-by-Side Multi-Target Evaluation Matrix",
      subtitle: "Comparative Bio-Pipeline Radar",
      desc: "Evaluate up to 4 targets side-by-side across Feasibility Scores, DepMap Chronos knockout scores, ChEMBL inhibitor potency, and FTO patent risk.",
      tag: "4-Target Matrix",
      badgeColor: "badge-purple"
    },
    {
      icon: Users,
      title: "Team Workspaces & Shared Target Links",
      subtitle: "Lab Member Roster & Collaboration",
      desc: "Invite lab colleagues by email, manage role permissions (Principal Scientist, Analyst), and share live target pipeline URLs instantly.",
      tag: "Multi-User Workspaces",
      badgeColor: "badge-gold"
    },
    {
      icon: Sparkles,
      title: "Grounded Gemini 2.5 AI Target Synthesis",
      subtitle: "Zero-Hallucination RAG Model",
      desc: "Generates custom target validation summaries with bracketed citations ([UniProt:P00533], [ChEMBL:3544961]) to guarantee 100% factual accuracy.",
      tag: "Citation-Grounded",
      badgeColor: "badge-cyan"
    },
    {
      icon: Download,
      title: "1-Click CSV & Publication-Ready PDF Reports",
      subtitle: "Instant Report & Data Exporter",
      desc: "Export complete target metrics into downloadable CSV spreadsheets or generate perfectly formatted executive PDF reports for grant applications.",
      tag: "CSV & PDF Export",
      badgeColor: "badge-gold"
    }
  ];

  return (
    <div className="landing-page-container fade-in">
      {/* 0. Live Ticker Banner */}
      <div className="live-ticker-banner">
        <div className="ticker-track">
          <span>LIVE PIPELINE SYNC: RCSB PDB 3D Coordinates • OpenFDA Adverse Event Stream • UniProtKB Release 2024_02 • ChEMBL v34 • OpenTargets GraphQL • ClinicalTrials.gov API v2 • Broad DepMap 24Q2 • NCBI PubMed</span>
          <span>LIVE PIPELINE SYNC: RCSB PDB 3D Coordinates • OpenFDA Adverse Event Stream • UniProtKB Release 2024_02 • ChEMBL v34 • OpenTargets GraphQL • ClinicalTrials.gov API v2 • Broad DepMap 24Q2 • NCBI PubMed</span>
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
          <a href="#visualizer">3D Visualizer</a>
          <a href="#toxicity">FDA Toxicity</a>
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
            <span>Enterprise AI Bioinformatics Platform for Therapeutic Target Discovery</span>
          </div>
          
          <h1 className="hero-title">
            Accelerate Target Discovery <br />
            <span className="gradient-text">From Months to Seconds</span>
          </h1>
          
          <p className="hero-subtitle">
            Integrate RCSB PDB 3D structures, OpenFDA toxicity logs, ChEMBL bioactivities, and DepMap knockouts into one unified AI workbench.
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
              <span className="badge badge-cyan">Live API Stream</span>
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
                  <span className="m-label">RCSB PDB Structure</span>
                  <span className="m-val text-purple font-mono">{activeData.pdbId}</span>
                </div>
                <div className="sandbox-metric" style={{ gridColumn: "span 2" }}>
                  <span className="m-label">Lead Inhibitor Candidate (ChEMBL)</span>
                  <span className="m-val font-semibold">{activeData.compound}</span>
                </div>
                <div className="sandbox-metric">
                  <span className="m-label">DepMap Chronos</span>
                  <span className="m-val text-gold font-mono">{activeData.depMap}</span>
                </div>
                <div className="sandbox-metric">
                  <span className="m-label">OpenFDA Toxicity Signal</span>
                  <span className="m-val text-rose font-semibold">{activeData.toxRisk}</span>
                </div>
              </div>

              <button onClick={onLaunch} className="btn btn-primary w-full sandbox-cta-btn">
                <span>Analyze Full Pipeline for {activeSandboxGene}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Comprehensive Feature Suite Section */}
      <section className="features-section" id="features">
        <div className="section-header-center">
          <span className="badge badge-purple">Complete Enterprise Suite</span>
          <h2 className="section-title">Everything You Need To Validate Targets</h2>
          <p className="section-subtitle">
            Combining 3D structural biology, FDA safety post-mortems, multi-target comparison, and collaborative lab workspaces.
          </p>
        </div>

        <div className="features-grid">
          {mainFeatures.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="feature-card glass-card">
                <div className="feature-card-header">
                  <div className="feature-icon-wrapper">
                    <Icon size={20} className="feature-icon" />
                  </div>
                  <span className={`badge ${f.badgeColor}`}>{f.tag}</span>
                </div>

                <h3 className="feature-card-title">{f.title}</h3>
                <p className="feature-card-sub">{f.subtitle}</p>
                <p className="feature-card-desc">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Deep Feature Highlight: 3D Protein Visualizer & FDA Toxicity */}
      <section className="deep-highlight-section" id="visualizer">
        <div className="deep-highlight-card glass-card">
          <div className="deep-left">
            <span className="badge badge-cyan">Scientific Precision</span>
            <h2 className="deep-title">Interactive 3D Protein Pocket Architecture</h2>
            <p className="deep-desc">
              Explore 3D protein structures with exact atomic residue mapping. Rotate 360°, inspect druggable pocket volumes, and toggle solvent surface views for any target in the human genome.
            </p>
            <ul className="deep-check-list">
              <li><CheckCircle2 size={14} className="text-cyan" /> <span>RCSB PDB & AlphaFold 3D Coordinates (`1M17`, `6OIM`, `1TUP`)</span></li>
              <li><CheckCircle2 size={14} className="text-cyan" /> <span>Druggable Active Pocket Volume Calculations (Å³)</span></li>
              <li><CheckCircle2 size={14} className="text-cyan" /> <span>360° Mouse Drag Rotation & High-Res PNG Snapshots</span></li>
            </ul>
          </div>

          <div className="deep-right-graphic">
            <div className="mock-3d-box">
              <Box className="brand-icon-spin text-cyan" size={48} />
              <span className="mock-3d-label">RCSB PDB ID: 1M17 (2.60 Å)</span>
              <span className="mock-3d-sub">EGFR Kinase Domain • Druggable Pocket Volume: 840 Å³</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Deep Feature Highlight: FDA Toxicity & Trial Post-Mortem */}
      <section className="deep-highlight-section" id="toxicity">
        <div className="deep-highlight-card glass-card" style={{ flexDirection: "row-reverse" }}>
          <div className="deep-left">
            <span className="badge badge-rose">Safety First</span>
            <h2 className="deep-title">FDA Failure Post-Mortem & Organ Toxicity Heatmap</h2>
            <p className="deep-desc">
              Uncover hidden off-target risks before starting costly wet-lab trials. Analyze GTEx organ expression levels alongside OpenFDA drug adverse logs.
            </p>
            <ul className="deep-check-list">
              <li><CheckCircle2 size={14} className="text-rose" /> <span>Cardiovascular, Hepatic, and Pulmonary Toxicity Risk Gauges</span></li>
              <li><CheckCircle2 size={14} className="text-rose" /> <span>ClinicalTrials.gov Historical Competitor Failure Logs</span></li>
              <li><CheckCircle2 size={14} className="text-rose" /> <span>Automated Safety Hold Alerts & Black-Box Warning Signals</span></li>
            </ul>
          </div>

          <div className="deep-right-graphic">
            <div className="mock-tox-box">
              <div className="tox-card-mini">
                <Heart size={16} className="text-rose" />
                <span>Cardiovascular: Low Risk</span>
              </div>
              <div className="tox-card-mini">
                <Activity size={16} className="text-gold" />
                <span>Hepatic: Medium Risk</span>
              </div>
              <div className="tox-card-mini">
                <ShieldAlert size={16} className="text-purple" />
                <span>Pulmonary: High Risk Alert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Security & Enterprise Compliance */}
      <section className="security-section" id="security">
        <div className="security-card glass-card">
          <div className="sec-header">
            <Lock className="text-cyan" size={24} />
            <div>
              <h3 className="sec-title">Enterprise VPC Security & Zero Data Retention</h3>
              <p className="sec-sub">Your target hypotheses remain 100% private and protected.</p>
            </div>
          </div>

          <div className="sec-grid">
            <div className="sec-item">
              <ShieldCheck className="text-cyan" size={16} />
              <span>Zero-Data Retention (ZDR) architecture prevents training public AI models on your target lists.</span>
            </div>
            <div className="sec-item">
              <ShieldCheck className="text-cyan" size={16} />
              <span>256-bit AES encryption at rest and TLS 1.3 in transit with dedicated VPC tunnels.</span>
            </div>
            <div className="sec-item">
              <ShieldCheck className="text-cyan" size={16} />
              <span>PBKDF2 SHA-512 salted password protection and OAuth 2.0 Single Sign-On.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="section-header-center">
          <span className="badge badge-cyan">Limited Launch Offer</span>
          <h2 className="section-title">Transparent Beta Access Plans</h2>
          <p className="section-subtitle">Waiving all subscription fees during our early researcher campaign.</p>
        </div>

        <div className="pricing-cards-grid">
          <div className="pricing-card glass-card">
            <h3 className="plan-name">Academic Beta</h3>
            <div className="plan-price"><span className="price-num">$0</span> <span className="price-sub">/ month</span></div>
            <p className="plan-desc">For university researchers and academic bioinformaticians.</p>
            <ul className="plan-features">
              <li>✓ 50 Live Target Searches / mo</li>
              <li>✓ Interactive 3D Protein Visualizer</li>
              <li>✓ FDA Organ Toxicity Heatmap</li>
              <li>✓ CSV Spreadsheet Exporter</li>
            </ul>
            <button onClick={onLaunch} className="btn btn-secondary w-full">Start Academic Beta</button>
          </div>

          <div className="pricing-card glass-card active-plan-card">
            <span className="popular-badge">Most Popular</span>
            <h3 className="plan-name">Biotech Scale</h3>
            <div className="plan-price"><span className="price-num">$0</span> <span className="price-sub">/ month (Beta Waiver)</span></div>
            <p className="plan-desc">For growing biotech startups and target validation teams.</p>
            <ul className="plan-features">
              <li>✓ Unlimited Target Searches</li>
              <li>✓ 3D Protein Visualizer & PDB Stream</li>
              <li>✓ FDA Failure Post-Mortem Table</li>
              <li>✓ 4-Target Side-by-Side Matrix</li>
              <li>✓ Team Workspace & Member Invites</li>
              <li>✓ 1-Click PDF Report Exporter</li>
            </ul>
            <button onClick={onLaunch} className="btn btn-primary w-full">Start Free Scale Beta</button>
          </div>

          <div className="pricing-card glass-card">
            <h3 className="plan-name">Enterprise Pharma</h3>
            <div className="plan-price"><span className="price-num">Custom</span></div>
            <p className="plan-desc">For global pharmaceutical R&D organizations requiring dedicated VPCs.</p>
            <ul className="plan-features">
              <li>✓ Unlimited Team Workspaces</li>
              <li>✓ Dedicated Private Cloud Tunnel</li>
              <li>✓ Custom Internal DB Integration</li>
              <li>✓ 24/7 Dedicated Bioinformatician Support</li>
            </ul>
            <button onClick={onLaunch} className="btn btn-secondary w-full">Contact Enterprise Team</button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="landing-logo">
              <Dna className="logo-icon" />
              <span>BioTarget <span className="logo-highlight">AI</span></span>
            </div>
            <p className="footer-tagline">Empowering drug discovery teams with live biological data aggregation and grounded AI validation.</p>
          </div>
          <div className="footer-links-col">
            <span className="footer-col-title">Platform</span>
            <a href="#demo">Live Demo</a>
            <a href="#features">3D Visualizer</a>
            <a href="#toxicity">FDA Toxicity</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-links-col">
            <span className="footer-col-title">Security & APIs</span>
            <span>RCSB PDB Stream</span>
            <span>OpenFDA Adverse Logs</span>
            <span>Zero Data Retention</span>
            <span>SOC2 Type II</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BioTarget AI, Inc. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#security">Security Policy</a>
            <a href="#privacy">Privacy Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
