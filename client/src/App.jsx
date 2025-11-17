import ErrorBoundary from './components/ErrorBoundary';
import PostDashboard from './components/PostDashboard';
import { PostProvider } from './context/PostContext';

function AppShell() {
  return (
    <div className="app-shell">
      <main className="layout">
        <header>
          <p>Week 6 • Reliability Lab</p>
          <h1>MERN Testing & Debugging Control Center</h1>
          <p>Track coverage, validate flows, and promote resilient releases.</p>
        </header>

        <PostDashboard />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PostProvider>
        <AppShell />
      </PostProvider>
    </ErrorBoundary>
  );
}

