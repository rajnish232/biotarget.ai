import { Dna, Sparkles, Database, ShieldAlert, FlaskConical, CheckCircle2, ChevronRight, Play } from "lucide-react";

interface LandingPageProps {
  onLaunch: () => void;
  onAuthClick?: () => void;
  isLoggedIn?: boolean;
}

export default function LandingPage({ onLaunch, onAuthClick, isLoggedIn }: LandingPageProps) {
  const features = [
    {
      icon: Database,
      title: "Consolidated Data Ingestion",
      desc: "Instant queries merging UniProt profiles, Ensembl transcripts, ChEMBL compound assay libraries, and PubMed indexing.",
    },
    {
      icon: Sparkles,
      title: "Grounded RAG Synthesizer",
      desc: "Validates targets using exact source-citation links (e.g., [UniProt:ID], [PMID:ID]) to guarantee zero factual hallucinations.",
    },
    {
      icon: ShieldAlert,
      title: "Safety & Toxicity Profiler",
      desc: "Instantly flags off-target localized tissue expression hazards and pathway titration boundary warnings.",
    },
  ];

  const pricingPlans = [
    {
      name: "Biotech Seed",
      price: "$149",
      desc: "For small teams validating early-stage drug candidates.",
      features: [
        "Up to 25 target validation scans / mo",
        "Local heuristic reporting tools",
        "Grounded source citation links",
        "ChEMBL compound range sliders"
      ]
    },
    {
      name: "Biotech Scale",
      price: "$499",
      desc: "For expanding drug-discovery labs requiring live AI.",
      features: [
        "Unlimited target validation scans",
        "Full-stack secure backend Gemini AI integration",
        "Advanced export (Structured PDF / JSON)",
        "Premium support channels"
      ],
      popular: true
    }
  ];

  return (
    <div className="landing-page-container fade-in">
      {/* 1. Header Navigation Bar */}
      <header className="landing-header">
        <div className="landing-logo">
          <Dna className="logo-icon" />
          <span>BioTarget <span className="logo-highlight">AI</span></span>
        </div>
        <nav className="header-nav">
          <a href="#features">Features</a>
          <a href="#technology">Technology</a>
          <a href="#pricing">Pricing</a>
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
            <span>Secure Full-Stack AI Drug Target Engine</span>
          </div>
          <h1 className="hero-title">
            Validate Drug Targets <br />
            <span className="gradient-text">In Seconds, Not Days</span>
          </h1>
          <p className="hero-subtitle">
            Aggregate data from UniProt, ChEMBL, and OpenTargets automatically. Generate clinically grounded validation summaries with full source-citation verification.
          </p>

          <div className="hero-ctas">
            <button onClick={onLaunch} className="btn btn-primary btn-hero-primary">
              {isLoggedIn ? "Launch Workbench Console" : "Start Free Beta Access"} <Play size={12} fill="currentColor" />
            </button>
            <a href="#features" className="btn btn-secondary btn-hero-secondary">
              Explore Features
            </a>
          </div>
        </div>

        {/* Animated SVG Data Connection Panel */}
        <div className="hero-graphic float-slow">
          <div className="svg-canvas-wrapper glass-card">
            <svg className="data-flow-svg" viewBox="0 0 400 300" width="100%" height="100%">
              {/* Connector lines with animated dashes */}
              <line className="flow-line line-uniprot" x1="80" y1="60" x2="200" y2="150" />
              <line className="flow-line line-chembl" x1="320" y1="60" x2="200" y2="150" />
              <line className="flow-line line-opentargets" x1="80" y1="240" x2="200" y2="150" />
              <line className="flow-line line-pubmed" x1="320" y1="240" x2="200" y2="150" />

              {/* Data stream dots */}
              <circle className="flow-dot dot-uniprot" cx="80" cy="60" r="3" />
              <circle className="flow-dot dot-chembl" cx="320" cy="60" r="3" />
              <circle className="flow-dot dot-opentargets" cx="80" cy="240" r="3" />
              <circle className="flow-dot dot-pubmed" cx="320" cy="240" r="3" />

              {/* Core Nodes */}
              {/* Central Node (BioTarget AI) */}
              <g className="node-group node-center">
                <circle cx="200" cy="150" r="32" className="node-bg" />
                <circle cx="200" cy="150" r="25" className="node-core center-core" />
                <text x="200" y="154" className="node-text center-text">AI</text>
              </g>

              {/* Database Nodes */}
              <g className="node-group node-db">
                <circle cx="80" cy="60" r="22" className="node-bg" />
                <circle cx="80" cy="60" r="16" className="node-core" />
                <text x="80" y="63" className="node-text">UniProt</text>
              </g>

              <g className="node-group node-db">
                <circle cx="320" cy="60" r="22" className="node-bg" />
                <circle cx="320" cy="60" r="16" className="node-core" />
                <text x="320" y="63" className="node-text">ChEMBL</text>
              </g>

              <g className="node-group node-db">
                <circle cx="80" cy="240" r="22" className="node-bg" />
                <circle cx="80" cy="240" r="16" className="node-core" />
                <text x="80" y="243" className="node-text">OpenT</text>
              </g>

              <g className="node-group node-db">
                <circle cx="320" cy="240" r="22" className="node-bg" />
                <circle cx="320" cy="240" r="16" className="node-core" />
                <text x="320" y="243" className="node-text">PubMed</text>
              </g>
            </svg>

            {/* Floating Badges */}
            <div className="floating-badge badge-egfr float-slow-delayed">EGFR</div>
            <div className="floating-badge badge-ace2 float-slow">ACE2</div>
            <div className="floating-badge badge-brca1 float-slow-delayed">BRCA1</div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Built for Precision Drug Discovery</h2>
        <p className="section-subtitle">A professional dashboard built to expedite wet-lab target validation protocols.</p>
        
        <div className="features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="feature-card glass-card interactive">
                <div className="feature-icon-wrapper">
                  <Icon size={20} />
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Cell Localization Preview Section */}
      <section id="technology" className="tech-section">
        <div className="tech-layout">
          <div className="tech-content">
            <div className="tech-badge">
              <FlaskConical size={12} />
              <span>Bio-Coordinate Mappings</span>
            </div>
            <h2 className="tech-title">Interactive Subcellular Mapping</h2>
            <p className="tech-desc">
              Visualizes protein coordinate listings across organelles automatically. The interface highlights targeting pathways on cell walls, nucleosomes, cytoplasm, and endoplasmic reticulum.
            </p>
            <div className="tech-checklist">
              <div className="check-item">
                <CheckCircle2 size={16} className="check-icon" />
                <span>UniProt subcellular location synchronization</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={16} className="check-icon" />
                <span>Extracellular vs Intracellular druggability flagging</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={16} className="check-icon" />
                <span>Responsive interactive SVG cell rendering</span>
              </div>
            </div>
          </div>

          <div className="tech-preview-container">
            {/* Pulsing Subcellular Visualizer Mockup */}
            <div className="glass-card tech-card float-slow-delayed">
              <div className="cell-mockup-wrapper">
                <svg className="cell-svg" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="70" className="membrane-pulsing" />
                  <circle cx="75" cy="75" r="30" className="nucleolus-pulsing" />
                  <circle cx="75" cy="75" r="10" fill="hsl(var(--accent-cyan) / 0.3)" stroke="hsl(var(--accent-cyan))" strokeWidth="1" />
                  <circle cx="35" cy="55" r="5" className="organelle-dot" />
                  <circle cx="115" cy="95" r="4" className="organelle-dot" />
                  <circle cx="60" cy="115" r="6" className="organelle-dot" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="pricing-section">
        <h2 className="section-title">Flexible Pricing Plans</h2>
        <p className="section-subtitle">Find a validation tier tailored to your biotechnology scale.</p>

        <div className="pricing-grid">
          {pricingPlans.map((plan, idx) => (
            <div key={idx} className={`pricing-card glass-card ${plan.popular ? "popular-card" : ""}`}>
              {plan.popular && <span className="popular-ribbon">RECOMMENDED</span>}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price-row">
                <span className="price-num">{plan.price}</span>
                <span className="price-period">/ month</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
              
              <ul className="plan-checklist">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="plan-feature-item">
                    <CheckCircle2 size={14} className="plan-check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button onClick={onLaunch} className={`btn w-100 ${plan.popular ? "btn-primary" : "btn-secondary"}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-logo">
            <Dna className="logo-icon" />
            <span>BioTarget AI</span>
          </div>
          <span className="footer-tagline">Clinical accuracy in target validation.</span>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} BioTarget AI Inc. All rights reserved.</span>
          <div className="footer-links">
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
        }

        .landing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2.5rem;
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

        .header-nav a {
          color: hsl(var(--text-secondary));
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: var(--transition-fast);
        }
        .header-nav a:hover {
          color: hsl(var(--accent-cyan));
        }

        .nav-cta {
          font-size: 0.8rem;
          padding: 0.4rem 0.85rem;
          border-radius: 4px;
        }

        /* Hero Section Styling */
        .hero-section {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          align-items: center;
          gap: 4rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 5rem 2.5rem;
        }
        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2.5rem;
            padding: 3rem 1.5rem;
          }
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        @media (max-width: 900px) {
          .hero-content {
            align-items: center;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: hsl(var(--bg-tertiary));
          border: 1px solid hsl(var(--border-light));
          padding: 0.35rem 0.75rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
          width: max-content;
        }

        .hero-badge-icon {
          color: hsl(var(--accent-cyan));
        }

        .hero-title {
          font-family: var(--font-title);
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.04em;
          color: hsl(var(--text-primary));
        }
        @media (max-width: 640px) {
          .hero-title {
            font-size: 2.25rem;
          }
        }

        .gradient-text {
          background: linear-gradient(90deg, hsl(var(--accent-cyan)), hsl(var(--accent-purple)));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.05rem;
          color: hsl(var(--text-secondary));
          line-height: 1.6;
          max-width: 540px;
        }

        .hero-ctas {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
        @media (max-width: 640px) {
          .hero-ctas {
            flex-direction: column;
            width: 100%;
          }
          .hero-ctas .btn {
            width: 100%;
          }
        }

        .btn-hero-primary {
          padding: 0.85rem 1.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 6px;
        }

        .btn-hero-secondary {
          padding: 0.85rem 1.75rem;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .hero-graphic {
          width: 100%;
          position: relative;
        }

        .svg-canvas-wrapper {
          padding: 1.5rem;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: hsl(var(--bg-secondary) / 0.3);
        }

        .data-flow-svg {
          overflow: visible;
        }

        /* SVG Connection Lines Flow */
        .flow-line {
          stroke: hsl(var(--border-light));
          stroke-width: 1.5;
          stroke-dasharray: 6 4;
          animation: flow 4s linear infinite;
        }

        .line-uniprot { animation-duration: 3s; }
        .line-chembl { animation-duration: 4.5s; }
        .line-opentargets { animation-duration: 3.5s; }
        .line-pubmed { animation-duration: 5s; }

        /* SVG Data Packet Dots */
        .flow-dot {
          fill: hsl(var(--accent-cyan));
          animation: flow-packet 4s linear infinite;
        }

        .dot-uniprot { animation: flow-packet-uniprot 3s linear infinite; }
        .dot-chembl { animation: flow-packet-chembl 4.5s linear infinite; }
        .dot-opentargets { animation: flow-packet-opentargets 3.5s linear infinite; }
        .dot-pubmed { animation: flow-packet-pubmed 5s linear infinite; }

        @keyframes flow-packet-uniprot {
          0% { cx: 80; cy: 60; opacity: 1; }
          90%, 100% { cx: 200; cy: 150; opacity: 0; }
        }
        @keyframes flow-packet-chembl {
          0% { cx: 320; cy: 60; opacity: 1; }
          90%, 100% { cx: 200; cy: 150; opacity: 0; }
        }
        @keyframes flow-packet-opentargets {
          0% { cx: 80; cy: 240; opacity: 1; }
          90%, 100% { cx: 200; cy: 150; opacity: 0; }
        }
        @keyframes flow-packet-pubmed {
          0% { cx: 320; cy: 240; opacity: 1; }
          90%, 100% { cx: 200; cy: 150; opacity: 0; }
        }

        /* Node Styling */
        .node-bg {
          fill: hsl(var(--bg-primary));
          stroke: hsl(var(--border-light));
          stroke-width: 1;
        }

        .node-core {
          fill: hsl(var(--bg-tertiary));
          stroke: hsl(var(--border-glass));
          stroke-width: 1;
          transition: var(--transition-fast);
        }

        .center-core {
          fill: hsl(var(--accent-cyan) / 0.1);
          stroke: hsl(var(--accent-cyan));
          stroke-width: 1.5;
        }

        .node-text {
          font-family: var(--font-title);
          font-size: 8px;
          fill: hsl(var(--text-secondary));
          text-anchor: middle;
          font-weight: 600;
        }

        .center-text {
          font-size: 11px;
          fill: hsl(var(--accent-cyan));
          font-weight: 700;
        }

        .node-group:hover .node-core {
          stroke: hsl(var(--accent-cyan));
          fill: hsl(var(--bg-tertiary) / 0.8);
        }

        /* Floating Badge tags */
        .floating-badge {
          position: absolute;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          border: 1px solid hsl(var(--border-light));
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          background: hsl(var(--bg-card));
          box-shadow: var(--shadow-glass);
        }

        .badge-egfr { top: -10px; left: 30px; color: hsl(var(--accent-cyan)); border-color: hsl(var(--accent-cyan) / 0.3); }
        .badge-ace2 { bottom: -12px; right: 40px; color: hsl(var(--accent-purple)); border-color: hsl(var(--accent-purple) / 0.3); }
        .badge-brca1 { top: 40%; right: -15px; color: hsl(var(--accent-gold)); border-color: hsl(var(--accent-gold) / 0.3); }

        /* Features Section */
        .features-section {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 5rem 2.5rem;
          border-top: 1px solid hsl(var(--border-light));
        }

        .section-title {
          font-family: var(--font-title);
          font-size: 2.25rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          color: hsl(var(--text-muted));
          font-size: 0.95rem;
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        .feature-card {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .feature-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          background: hsl(var(--accent-cyan) / 0.08);
          border: 1px solid hsl(var(--accent-cyan) / 0.2);
          color: hsl(var(--accent-cyan));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-title {
          font-family: var(--font-title);
          font-size: 1.15rem;
          font-weight: 600;
          color: hsl(var(--text-primary));
        }

        .feature-desc {
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          line-height: 1.5;
        }

        /* Tech Section Preview */
        .tech-section {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 5rem 2.5rem;
          border-top: 1px solid hsl(var(--border-light));
        }

        .tech-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 4rem;
        }
        @media (max-width: 768px) {
          .tech-layout {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }

        .tech-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: hsl(var(--bg-tertiary));
          border: 1px solid hsl(var(--border-light));
          padding: 0.3rem 0.65rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
          width: max-content;
        }

        .tech-badge svg {
          color: hsl(var(--accent-cyan));
        }

        .tech-title {
          font-family: var(--font-title);
          font-size: 2.25rem;
          font-weight: 700;
        }

        .tech-desc {
          font-size: 0.95rem;
          color: hsl(var(--text-secondary));
          line-height: 1.6;
        }

        .tech-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
        }

        .check-icon {
          color: hsl(var(--accent-cyan));
        }

        .tech-preview-container {
          display: flex;
          justify-content: center;
        }

        .tech-card {
          padding: 2rem;
          width: 100%;
          max-width: 320px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(var(--bg-secondary) / 0.3);
        }

        .cell-mockup-wrapper {
          width: 80%;
          height: 80%;
        }

        .cell-svg {
          overflow: visible;
        }

        /* Tech Cell Animations */
        .membrane-pulsing {
          fill: none;
          stroke: hsl(var(--border-glass));
          stroke-width: 1.5;
          animation: pulse-ring 3s ease-out infinite;
          transform-origin: 75px 75px;
        }

        .nucleolus-pulsing {
          fill: none;
          stroke: hsl(var(--accent-purple));
          stroke-width: 1.5;
          animation: pulse-ring-inner 3s ease-out infinite;
          transform-origin: 75px 75px;
        }

        .organelle-dot {
          fill: hsl(var(--accent-cyan));
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.3; stroke: hsl(var(--border-glass)); }
          50% { transform: scale(1.02); opacity: 0.8; stroke: hsl(var(--accent-cyan) / 0.5); }
          100% { transform: scale(0.95); opacity: 0.3; stroke: hsl(var(--border-glass)); }
        }

        @keyframes pulse-ring-inner {
          0% { transform: scale(0.92); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(0.92); opacity: 0.5; }
        }

        /* Pricing Section */
        .pricing-section {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 5rem 2.5rem;
          border-top: 1px solid hsl(var(--border-light));
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        @media (max-width: 640px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }

        .pricing-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 2.25rem 2rem;
          background: hsl(var(--bg-secondary) / 0.3);
        }

        .popular-card {
          border-color: hsl(var(--accent-cyan));
          background: linear-gradient(180deg, hsl(var(--accent-cyan) / 0.02) 0%, transparent 100%), hsl(var(--bg-secondary) / 0.3);
        }

        .popular-ribbon {
          position: absolute;
          top: 12px;
          right: 12px;
          background: hsl(var(--accent-cyan));
          color: hsl(var(--bg-primary));
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
        }

        .plan-name {
          font-family: var(--font-title);
          font-size: 1.25rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
        }

        .plan-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .price-num {
          font-family: var(--font-title);
          font-size: 2.75rem;
          font-weight: 800;
          color: hsl(var(--text-primary));
        }

        .price-period {
          font-size: 0.85rem;
          color: hsl(var(--text-muted));
        }

        .plan-desc {
          font-size: 0.825rem;
          color: hsl(var(--text-secondary));
          line-height: 1.4;
        }

        .plan-checklist {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 0.5rem;
        }

        .plan-feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: hsl(var(--text-secondary));
        }

        .plan-check-icon {
          color: hsl(var(--accent-cyan));
          flex-shrink: 0;
        }

        .w-100 {
          width: 100%;
        }

        /* Footer */
        .landing-footer {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          padding: 3rem 2.5rem;
          border-top: 1px solid hsl(var(--border-light));
          display: flex;
          flex-direction: column;
          gap: 2rem;
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
          font-size: 1.15rem;
        }

        .footer-tagline {
          font-size: 0.825rem;
          color: hsl(var(--text-muted));
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
          border-top: 1px dashed hsl(var(--border-light));
          padding-top: 1.5rem;
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
          color: hsl(var(--accent-cyan));
        }
      `}</style>
    </div>
  );
}
