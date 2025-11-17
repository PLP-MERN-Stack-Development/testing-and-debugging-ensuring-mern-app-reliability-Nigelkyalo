export default function LoadingIndicator({ message = 'Loading...' }) {
  return (
    <div role="status" style={{ textAlign: 'center', padding: '1rem', color: '#2563eb' }}>
      <span className="spinner" aria-hidden="true">
        ⏳
      </span>
      <p>{message}</p>
    </div>
  );
}

