import PostForm from './PostForm';
import PostList from './PostList';
import InsightPanel from './InsightPanel';
import NotificationCenter from './NotificationCenter';

export default function PostDashboard() {
  return (
    <div className="grid two-columns">
      <section className="panel">
        <h2>Create New Post</h2>
        <PostForm />
      </section>

      <NotificationCenter />
      <InsightPanel />

      <section className="panel" style={{ gridColumn: '1 / -1' }}>
        <h2>Recent Posts</h2>
        <PostList />
      </section>
    </div>
  );
}

