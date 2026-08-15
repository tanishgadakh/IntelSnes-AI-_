import './LoadingSkeleton.css';

export function SkeletonCard({ width = '100%', height = '150px' }) {
  return (
    <div className="skeleton-card" style={{ width, height }}>
      <div className="skeleton-line skeleton-line-1"></div>
      <div className="skeleton-line skeleton-line-2"></div>
      <div className="skeleton-line skeleton-line-3"></div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="skeleton-row">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="skeleton-cell">
              <div className="skeleton-line"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="skeleton-chart">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-line-1"></div>
      <div className="skeleton-line skeleton-line-2"></div>
      <div className="skeleton-line skeleton-line-3"></div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="skeleton-profile">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-line-short"></div>
      <div className="skeleton-line skeleton-line-long"></div>
    </div>
  );
}
