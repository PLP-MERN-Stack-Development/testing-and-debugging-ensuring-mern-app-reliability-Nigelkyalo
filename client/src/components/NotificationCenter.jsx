import Button from './Button';
import { useNotifications } from '../store/useNotifications';

export default function NotificationCenter() {
  const { notifications, dismissNotification, clearAll } = useNotifications();

  if (!notifications.length) {
    return null;
  }

  return (
    <aside className="panel" aria-live="polite">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Activity</h3>
        <Button size="sm" variant="secondary" onClick={clearAll}>
          Clear
        </Button>
      </header>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {notifications.map((notification) => (
          <li key={notification.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{notification.title}</p>
            <p style={{ margin: '0.25rem 0' }}>{notification.message}</p>
            <Button size="sm" variant="secondary" onClick={() => dismissNotification(notification.id)}>
              Dismiss
            </Button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

