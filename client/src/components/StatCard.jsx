// one small card for one condition (waves, wind, tide...).
import { Waves, Timer, Wind, Gauge, ArrowUpDown, Droplets, Thermometer, Sun, Eye, CloudLightning, LifeBuoy, Sunset } from 'lucide-react';
import { scoreColor } from '../lib/scoreColor';

// which icon goes with which factor id (the ids come from server/safety.js)
const icons = {
  waves: Waves,
  period: Timer,
  wind: Wind,
  gusts: Gauge,
  tide: ArrowUpDown,
  water: Droplets,
  air: Thermometer,
  uv: Sun,
  visibility: Eye,
  sky: CloudLightning,
  rip: LifeBuoy,
  daylight: Sunset,
};

export default function StatCard({ factor }) {
  const Icon = icons[factor.id] || Waves; // waves icon if we forgot one
  const hasScore = factor.score != null;

  return (
    <article className="stat-card">
      <header>
        <Icon size={20} />
        <h3>{factor.title}</h3>
      </header>
      <p className="stat-value">{factor.value}</p>
      <p className="stat-detail">{factor.detail}</p>

      {/* a small bar showing how safe this one thing is */}
      {hasScore && (
        <div className="stat-bar" title={`${factor.score} out of 100`}>
          <div className="stat-bar-fill" style={{ width: `${factor.score}%`, background: scoreColor(factor.score, 45) }} />
        </div>
      )}
    </article>
  );
}
