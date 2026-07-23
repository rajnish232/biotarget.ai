import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, FlaskConical, ExternalLink, SlidersHorizontal } from "lucide-react";

interface Compound {
  chemblId: string;
  name: string;
  type: string;
  relation: string;
  value: number;
  unit: string;
  pChemblValue?: number;
  assayType?: string;
  journalReference?: string;
}

interface CompoundTableProps {
  compounds: Compound[];
}

// Sleek Custom Dropdown Option interface
interface DropdownOption {
  value: string;
  label: string;
}

// Styled Custom React Dropdown Component (replaces old browser native select)
function CustomDropdown({
  options,
  value,
  onChange,
  className = ""
}: {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`custom-dropdown-container ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="custom-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selected.label}</span>
        <ChevronDown size={14} className={`dropdown-chevron ${isOpen ? "open" : ""}`} />
      </button>

      {isOpen && (
        <ul className="custom-dropdown-list fade-in" role="listbox">
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              className={`custom-dropdown-item ${opt.value === value ? "selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CompoundTable({ compounds }: CompoundTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterAssay, setFilterAssay] = useState("all");
  const [affinityLimit, setAffinityLimit] = useState(10000); // Default up to 10,000 nM
  const [sortBy, setSortBy] = useState<"affinity" | "pchembl" | "id">("affinity");

  const filtered = compounds.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.chemblId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || c.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesAssay = filterAssay === "all" || (c.assayType && c.assayType.toUpperCase() === filterAssay.toUpperCase());
    const matchesAffinity = c.value <= affinityLimit;
    return matchesSearch && matchesType && matchesAssay && matchesAffinity;
  });

  // Sort compounds based on user selection
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "affinity") {
      return a.value - b.value;
    } else if (sortBy === "pchembl") {
      return (b.pChemblValue || 0) - (a.pChemblValue || 0);
    } else {
      return a.chemblId.localeCompare(b.chemblId);
    }
  });

  // Unique list of assay types present in the dataset
  const availableAssays = Array.from(
    new Set(compounds.map((c) => c.assayType).filter(Boolean))
  ) as string[];

  // Options configuration lists for our custom select dropdowns
  const modalityOptions = [
    { value: "all", label: "All Modalities" },
    { value: "small molecule", label: "Small Molecules" },
    { value: "peptide", label: "Peptides" },
    { value: "antibody", label: "Antibodies" }
  ];

  const assayOptions = [
    { value: "all", label: "All Assay Types" },
    ...availableAssays.map((a) => ({ value: a, label: `${a.toUpperCase()} Constant` }))
  ];

  const sortOptions = [
    { value: "affinity", label: "Sort: High Affinity (nM)" },
    { value: "pchembl", label: "Sort: High pChEMBL (-log)" },
    { value: "id", label: "Sort: ChEMBL ID" }
  ];

  // Generates a nice mock chemical structure drawing as SVG based on ChEMBL ID hash
  const renderMockStructureSvg = (chemblId: string) => {
    const numPart = parseInt(chemblId.replace(/\D/g, "")) || 123;
    const lines = [];
    let curX = 25;
    let curY = 25;
    
    // Hexagonal structural node drawing
    const sides = 6;
    const radius = 10;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const nextAngle = ((i + 1) * 2 * Math.PI) / sides;
      const x1 = curX + radius * Math.cos(angle);
      const y1 = curY + radius * Math.sin(angle);
      const x2 = curX + radius * Math.cos(nextAngle);
      const y2 = curY + radius * Math.sin(nextAngle);
      lines.push(<line key={`hex-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--accent-purple))" strokeWidth="1.2" />);
    }

    const seed = numPart % 10;
    if (seed > 2) {
      lines.push(<line key="side-1a" x1={25} y1={15} x2={25} y2={5} stroke="hsl(var(--accent-rose) / 0.8)" strokeWidth="1.2" />);
      lines.push(<line key="side-1b" x1={22} y1={15} x2={22} y2={5} stroke="hsl(var(--accent-rose) / 0.8)" strokeWidth="1.2" />);
    }
    if (seed > 5) {
      lines.push(<line key="side-2" x1={33} y1={30} x2={43} y2={35} stroke="hsl(var(--accent-cyan))" strokeWidth="1.2" />);
    }
    if (seed > 7) {
      lines.push(<line key="side-3" x1={15} y1={25} x2={5} y2={25} stroke="hsl(var(--accent-purple))" strokeWidth="1.2" />);
    }

    return (
      <svg className="molecule-svg" width="50" height="50" viewBox="0 0 50 50">
        {lines}
        {seed > 2 && <text x="21" y="4" fill="hsl(var(--accent-rose))" fontSize="6" fontWeight="bold">O</text>}
        {seed > 5 && <text x="44" y="38" fill="hsl(var(--accent-cyan))" fontSize="6" fontWeight="bold">OH</text>}
        {seed > 7 && <text x="0" y="27" fill="hsl(var(--accent-purple))" fontSize="6" fontWeight="bold">N</text>}
      </svg>
    );
  };

  return (
    <div className="compound-table-card glass-card">
      <div className="section-header">
        <FlaskConical size={16} />
        <span>Bioactive Compounds (ChEMBL Library)</span>
      </div>

      {/* Advanced Precision Filter Controls */}
      <div className="table-controls-layout">
        <div className="table-controls-row">
          <div className="search-box flex-2">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              className="input-field search-input"
              placeholder="Search compounds by Name or ChEMBL ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Custom styled select boxes */}
          <CustomDropdown
            options={modalityOptions}
            value={filterType}
            onChange={(val) => setFilterType(val)}
          />

          <CustomDropdown
            options={assayOptions}
            value={filterAssay}
            onChange={(val) => setFilterAssay(val)}
          />

          <CustomDropdown
            options={sortOptions}
            value={sortBy}
            onChange={(val) => setSortBy(val as any)}
          />
        </div>

        {/* Dynamic Affinity Slider */}
        <div className="affinity-slider-wrapper">
          <div className="slider-label-flex">
            <span className="slider-label">
              <SlidersHorizontal size={12} /> Binding Concentration Limit (IC50 / Ki / EC50):
            </span>
            <span className="slider-value-glowing">
              &le; {affinityLimit === 10000 ? "10,000 nM (10 µM)" : `${affinityLimit} nM`}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10000"
            step="10"
            className="neon-range-slider"
            value={affinityLimit}
            onChange={(e) => setAffinityLimit(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>Structure</th>
              <th>ChEMBL ID</th>
              <th>Compound Name</th>
              <th>Type</th>
              <th>Assay Type</th>
              <th className="align-right">pChEMBL (-log M)</th>
              <th className="align-right">Affinity value (nM)</th>
              <th className="align-right" style={{ width: "200px" }}>Reference Context</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length > 0 ? (
              sorted.map((c) => (
                <tr key={c.chemblId} className="compound-row">
                  <td>
                    <div className="structure-wrapper">
                      {renderMockStructureSvg(c.chemblId)}
                    </div>
                  </td>
                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/chembl/compound_report_card/${c.chemblId}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chembl-link"
                    >
                      {c.chemblId} <ExternalLink size={10} />
                    </a>
                  </td>
                  <td className="compound-name-cell">{c.name}</td>
                  <td>
                    <span className={`badge ${c.type.includes("Small") ? "badge-cyan" : "badge-purple"}`}>
                      {c.type}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-gold">{c.assayType || "IC50"}</span>
                  </td>
                  <td className="align-right font-mono text-purple font-semibold">
                    {c.pChemblValue !== undefined ? c.pChemblValue.toFixed(2) : "N/A"}
                  </td>
                  <td className="align-right font-mono highlight-affinity">
                    {c.relation} {c.value} {c.unit}
                  </td>
                  <td className="align-right reference-text-cell">
                    {c.journalReference || "Preclinical screening"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="empty-row">
                  No compounds match your affinity slider and filters ({filtered.length} total compounds).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        /* Custom styled select boxes markup details */
        .custom-dropdown-container {
          position: relative;
          min-width: 160px;
          flex: 1;
        }

        .custom-dropdown-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          color: hsl(var(--text-secondary));
          padding: 0.6rem 0.85rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-family: var(--font-sans);
          cursor: pointer;
          width: 100%;
          transition: var(--transition-fast);
          text-align: left;
        }
        .custom-dropdown-trigger:hover {
          color: hsl(var(--text-primary));
          border-color: hsl(var(--border-glass));
        }
        .custom-dropdown-trigger:focus {
          border-color: hsl(var(--accent-cyan) / 0.5);
          outline: none;
        }

        .dropdown-chevron {
          color: hsl(var(--text-muted));
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }
        .dropdown-chevron.open {
          transform: rotate(180deg);
        }

        .custom-dropdown-list {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 100%;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          border-radius: 6px;
          list-style: none;
          z-index: 50;
          padding: 0.25rem 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
          max-height: 220px;
          overflow-y: auto;
        }

        .custom-dropdown-item {
          padding: 0.55rem 0.85rem;
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .custom-dropdown-item:hover {
          background: hsl(var(--bg-tertiary) / 0.5);
          color: hsl(var(--text-primary));
        }
        .custom-dropdown-item.selected {
          background: hsl(var(--accent-cyan) / 0.08);
          color: hsl(var(--accent-cyan));
          font-weight: 600;
        }

        .compound-table-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .table-controls-layout {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          background: hsl(var(--bg-secondary) / 0.5);
          border: 1px solid hsl(var(--border-light));
          padding: 0.85rem;
          border-radius: 6px;
        }

        .table-controls-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .flex-2 {
          flex: 2;
          min-width: 250px;
        }

        .search-box {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: hsl(var(--text-muted));
        }

        .search-input {
          padding-left: 2.25rem;
        }

        /* Affinity Range Slider Styling - Refined */
        .affinity-slider-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          border-top: 1px solid hsl(var(--border-light));
          padding-top: 0.65rem;
          margin-top: 0.15rem;
        }

        .slider-label-flex {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: hsl(var(--text-secondary));
        }

        .slider-label {
          display: flex;
          align-items: center;
          gap: 0.3;
          font-weight: 500;
        }

        .slider-value-glowing {
          font-family: var(--font-mono);
          font-weight: 600;
          color: hsl(var(--accent-cyan));
        }

        .neon-range-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 9999px;
          background: hsl(var(--bg-primary));
          border: 1px solid hsl(var(--border-light));
          outline: none;
          cursor: pointer;
        }

        .neon-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 4px;
          background: hsl(var(--accent-cyan));
          border: 1px solid hsl(var(--border-light));
          transition: var(--transition-fast);
        }
        .neon-range-slider::-webkit-slider-thumb:hover {
          background: hsl(var(--text-primary));
        }

        .structure-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          background: hsl(var(--bg-secondary));
          border: 1px solid hsl(var(--border-light));
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: var(--transition-fast);
        }

        .compound-row:hover .structure-wrapper {
          border-color: hsl(var(--border-glass));
        }

        .molecule-svg {
          transform: scale(0.9);
          transition: var(--transition-fast);
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

        .compound-name-cell {
          font-weight: 500;
          color: hsl(var(--text-primary));
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .align-right {
          text-align: right;
        }

        .font-mono {
          font-family: var(--font-mono);
        }

        .highlight-affinity {
          color: hsl(var(--accent-cyan));
          font-weight: 600;
        }

        .reference-text-cell {
          font-size: 0.725rem;
          color: hsl(var(--text-muted));
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .empty-row {
          text-align: center;
          padding: 2.5rem !important;
          color: hsl(var(--text-muted));
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
