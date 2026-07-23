import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  progress?: number; // 0 to 100
  accentColor?: "cyan" | "purple" | "rose" | "gold";
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  subtext,
  trend,
  progress,
  accentColor = "cyan"
}: MetricCardProps) {
  const colorMap = {
    cyan: "hsl(var(--accent-cyan))",
    purple: "hsl(var(--accent-purple))",
    rose: "hsl(var(--accent-rose))",
    gold: "hsl(var(--accent-gold))"
  };

  const activeColor = colorMap[accentColor];

  return (
    <div className={`metric-card glass-card border-${accentColor}`}>
      <div className="card-header-flex">
        <div>
          <span className="card-title-muted">{title}</span>
          <h3 className="card-value-display">{value}</h3>
        </div>
        <div className={`icon-container bg-${accentColor}`}>
          <Icon size={20} style={{ color: activeColor }} />
        </div>
      </div>

      {progress !== undefined && (
        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div
              className={`progress-bar-fill fill-${accentColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-value">{progress}%</span>
        </div>
      )}

      {(trend || subtext) && (
        <div className="card-footer-flex">
          {trend && (
            <span className={`trend-indicator ${trend.isPositive ? "trend-up" : "trend-down"}`}>
              {trend.value}
            </span>
          )}
          {subtext && <span className="footer-subtext">{subtext}</span>}
        </div>
      )}

      <style>{`
        .metric-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .border-cyan { border-top: 3px solid hsl(var(--accent-cyan)); }
        .border-purple { border-top: 3px solid hsl(var(--accent-purple)); }
        .border-rose { border-top: 3px solid hsl(var(--accent-rose)); }
        .border-gold { border-top: 3px solid hsl(var(--accent-gold)); }

        .card-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .card-title-muted {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: hsl(var(--text-muted));
        }

        .card-value-display {
          font-family: var(--font-title);
          font-size: 1.75rem;
          font-weight: 700;
          color: hsl(var(--text-primary));
          margin-top: 0.25rem;
        }

        .icon-container {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-cyan { background: hsl(var(--accent-cyan) / 0.1); }
        .bg-purple { background: hsl(var(--accent-purple) / 0.1); }
        .bg-rose { background: hsl(var(--accent-rose) / 0.1); }
        .bg-gold { background: hsl(var(--accent-gold) / 0.1); }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .progress-bar-track {
          flex: 1;
          height: 4px;
          background: hsl(var(--bg-tertiary));
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fill-cyan { background: hsl(var(--accent-cyan)); }
        .fill-purple { background: hsl(var(--accent-purple)); }
        .fill-rose { background: hsl(var(--accent-rose)); }
        .fill-gold { background: hsl(var(--accent-gold)); }

        .progress-value {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: hsl(var(--text-secondary));
          font-weight: 500;
        }

        .card-footer-flex {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .trend-indicator {
          font-weight: 600;
          padding: 0.1rem 0.35rem;
          border-radius: 4px;
        }

        .trend-up {
          background: hsl(var(--accent-cyan) / 0.1);
          color: hsl(var(--accent-cyan));
        }

        .trend-down {
          background: hsl(var(--accent-rose) / 0.1);
          color: hsl(var(--accent-rose));
        }

        .footer-subtext {
          color: hsl(var(--text-muted));
        }
      `}</style>
    </div>
  );
}
