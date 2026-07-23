import { useState } from "react";
import { Info } from "lucide-react";

interface SubcellularVisualizerProps {
  locations: string[];
}

export default function SubcellularVisualizer({ locations }: SubcellularVisualizerProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  // Normalize locations to match zones
  const isNucleus = locations.some(loc => loc.toLowerCase().includes("nucleus") || loc.toLowerCase().includes("nucleoplasm"));
  const isMembrane = locations.some(loc => loc.toLowerCase().includes("membrane") || loc.toLowerCase().includes("surface") || loc.toLowerCase().includes("receptor"));
  const isCytosol = locations.some(loc => loc.toLowerCase().includes("cytoplasm") || loc.toLowerCase().includes("cytosol"));
  const isSecreted = locations.some(loc => loc.toLowerCase().includes("secreted") || loc.toLowerCase().includes("extracellular"));

  const getZoneText = (zone: string) => {
    switch(zone) {
      case "membrane":
        return "Cell Membrane: Proteins embedded here are highly druggable by monoclonal antibodies and small molecules due to extracellular exposure.";
      case "nucleus":
        return "Nucleus: Nuclear proteins (like transcription factors) are historically challenging to target; they require cell-permeable small molecules.";
      case "cytoplasm":
        return "Cytoplasm: Intracellular enzymes, kinases, and scaffolding proteins. Targets are accessible to lipophilic small molecules.";
      case "secreted":
        return "Extracellular Matrix / Secreted: Proteins released from the cell. Readily targeted by neutralizing antibodies or trap molecules.";
      default:
        return "";
    }
  };

  return (
    <div className="subcellular-container glass-card">
      <div className="section-header">
        <Info size={16} />
        <span>Subcellular Localization Map</span>
      </div>
      <p className="vis-description">
        Visual breakdown of protein compartments in a human host cell based on UniProt records.
      </p>

      <div className="cell-sandbox">
        {/* Extracellular / Secreted space */}
        <div 
          className={`extracellular-zone ${isSecreted ? "highlighted" : ""} ${activeZone === "secreted" ? "focused" : ""}`}
          onMouseEnter={() => setActiveZone("secreted")}
          onMouseLeave={() => setActiveZone(null)}
        >
          {isSecreted && <span className="protein-dot pulse-slow pos-secreted" title="Secreted Target Dot" />}
          <span className="zone-label extracellular">Extracellular / Secreted</span>
        </div>

        {/* Outer membrane */}
        <div 
          className={`cell-membrane-zone ${isMembrane ? "highlighted" : ""} ${activeZone === "membrane" ? "focused" : ""}`}
          onMouseEnter={() => setActiveZone("membrane")}
          onMouseLeave={() => setActiveZone(null)}
        >
          {isMembrane && <span className="protein-dot pulse-fast pos-membrane" title="Membrane Receptor Target Dot" />}
          
          {/* Cytosol */}
          <div 
            className={`cytoplasm-zone ${isCytosol ? "highlighted" : ""} ${activeZone === "cytoplasm" ? "focused" : ""}`}
            onMouseEnter={() => setActiveZone("cytoplasm")}
            onMouseLeave={() => setActiveZone(null)}
          >
            {isCytosol && <span className="protein-dot pulse-slow pos-cytosol" title="Intracellular Target Dot" />}
            
            {/* Nucleus */}
            <div 
              className={`nucleus-zone ${isNucleus ? "highlighted" : ""} ${activeZone === "nucleus" ? "focused" : ""}`}
              onMouseEnter={() => setActiveZone("nucleus")}
              onMouseLeave={() => setActiveZone(null)}
            >
              {isNucleus && <span className="protein-dot pulse-medium pos-nucleus" title="Nuclear Target Dot" />}
              <span className="zone-label nucleus">Nucleus</span>
            </div>

            <span className="zone-label cytoplasm">Cytosol</span>
          </div>
          <span className="zone-label membrane">Cell Membrane</span>
        </div>
      </div>

      <div className="vis-legend">
        <div className="legend-items">
          <div className="legend-item"><span className="legend-dot status-active" /> Target Present</div>
          <div className="legend-item"><span className="legend-dot status-inactive" /> Unmapped Region</div>
        </div>
        
        <div className="info-display-panel">
          {activeZone ? (
            <p className="zone-info-text fade-in">{getZoneText(activeZone)}</p>
          ) : (
            <p className="zone-info-placeholder">Hover over cellular compartments to see drug accessibility details.</p>
          )}
        </div>
      </div>

      <style>{`
        .subcellular-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 400px;
        }

        .vis-description {
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          margin-bottom: 0.5rem;
        }

        .cell-sandbox {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 250px;
          border-radius: 12px;
          background: hsl(var(--bg-secondary) / 0.3);
          border: 1px solid hsl(var(--border-light));
          position: relative;
          overflow: hidden;
        }

        .extracellular-zone {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          cursor: pointer;
          z-index: 1;
        }
        .extracellular-zone.highlighted {
          background: radial-gradient(circle, transparent 60%, hsl(var(--accent-purple) / 0.02) 100%);
        }
        .extracellular-zone.focused {
          background: radial-gradient(circle, transparent 65%, hsl(var(--accent-purple) / 0.05) 100%);
        }

        .cell-membrane-zone {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          border: 1.5px dashed hsl(var(--text-muted) / 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          cursor: pointer;
          background: hsl(var(--bg-secondary) / 0.4);
          transition: var(--transition-smooth);
        }
        .cell-membrane-zone.highlighted {
          border: 1.5px solid hsl(var(--accent-cyan));
        }
        .cell-membrane-zone.focused {
          border-color: hsl(var(--accent-cyan));
          background: hsl(var(--accent-cyan) / 0.01);
        }

        .cytoplasm-zone {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 1px solid hsl(var(--text-muted) / 0.15);
          background: hsl(var(--bg-primary) / 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: var(--transition-smooth);
          cursor: pointer;
        }
        .cytoplasm-zone.highlighted {
          background: radial-gradient(circle, transparent 30%, hsl(var(--accent-purple) / 0.05) 100%);
          border-color: hsl(var(--accent-purple) / 0.4);
        }
        .cytoplasm-zone.focused {
          background: radial-gradient(circle, transparent 20%, hsl(var(--accent-purple) / 0.08) 100%);
          border-color: hsl(var(--accent-purple));
        }

        .nucleus-zone {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1px double hsl(var(--text-muted) / 0.4);
          background: hsl(var(--bg-secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: var(--transition-smooth);
          cursor: pointer;
        }
        .nucleus-zone.highlighted {
          border: 1px solid hsl(var(--accent-gold));
        }
        .nucleus-zone.focused {
          border-color: hsl(var(--accent-gold));
          background: hsl(var(--accent-gold) / 0.03);
        }

        /* Protein Markers - Flat pulse scaling without shadows */
        .protein-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          z-index: 5;
        }

        .pulse-fast {
          background: hsl(var(--accent-cyan));
          animation: pulse-flat 1.2s infinite ease-in-out;
        }
        .pulse-medium {
          background: hsl(var(--accent-gold));
          animation: pulse-flat 1.8s infinite ease-in-out;
        }
        .pulse-slow {
          background: hsl(var(--accent-purple));
          animation: pulse-flat 2.5s infinite ease-in-out;
        }

        .pos-membrane {
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
        }
        .pos-cytosol {
          top: 25px;
          left: 20px;
        }
        .pos-nucleus {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .pos-secreted {
          top: 30px;
          right: 40px;
        }

        @keyframes pulse-flat {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        /* Zone Labels */
        .zone-label {
          position: absolute;
          font-family: var(--font-title);
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-muted));
          pointer-events: none;
          font-weight: 600;
        }

        .extracellular {
          top: 10px;
          left: 15px;
        }
        .membrane {
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
        }
        .cytoplasm {
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
        }
        .nucleus {
          font-size: 0.6rem;
          text-align: center;
        }

        .vis-legend {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 0.75rem;
        }

        .legend-items {
          display: flex;
          gap: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: hsl(var(--text-secondary));
        }

        .legend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .status-active { background: hsl(var(--accent-cyan)); }
        .status-inactive { background: hsl(var(--text-muted) / 0.5); }

        .info-display-panel {
          min-height: 54px;
          background: hsl(var(--bg-secondary));
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          border: 1px solid hsl(var(--border-light));
          display: flex;
          align-items: center;
        }

        .zone-info-text {
          font-size: 0.75rem;
          color: hsl(var(--text-secondary));
          line-height: 1.5;
        }

        .zone-info-placeholder {
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
