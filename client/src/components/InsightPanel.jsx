import { useMemo } from 'react';
import { usePostContext } from '../context/PostContext';

export default function InsightPanel() {
  const { metrics, lastRefreshed } = usePostContext();

  const insights = useMemo(
    () => [
      { label: 'Total posts', value: metrics.total },
      { label: 'Published', value: metrics.published },
      { label: 'Drafts', value: metrics.drafts },
      { label: 'Last sync', value: lastRefreshed ? new Date(lastRefreshed).toLocaleTimeString() : 'Pending' }
    ],
    [metrics, lastRefreshed]
  );

  return (
    <section className="panel">
      <h2>Quality Insights</h2>
      <div className="metrics">
        {insights.map((insight) => (
          <div key={insight.label} className="metric">
            <p style={{ margin: 0, color: '#7b8794' }}>{insight.label}</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1.35rem', fontWeight: 700 }}>{insight.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

