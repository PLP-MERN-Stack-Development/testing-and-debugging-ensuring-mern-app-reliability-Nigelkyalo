import Button from './Button';
import { usePostContext } from '../context/PostContext';
import LoadingIndicator from './LoadingIndicator';

export default function PostList() {
  const { items, loading, error, updatePost, deletePost } = usePostContext();

  if (loading && !items.length) {
    return <LoadingIndicator message="Fetching posts..." />;
  }

  if (error && !items.length) {
    return (
      <div role="alert" className="panel">
        <p>We were unable to load posts.</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((post) => (
        <article key={post._id} className="post-card" aria-label={`post-${post._id}`}>
          <header>
            <div>
              <h3>{post.title}</h3>
              <small>{new Date(post.createdAt).toLocaleString()}</small>
            </div>
            <span className={`status-badge ${post.status}`}>{post.status}</span>
          </header>

          <p>{post.content}</p>

          <div className="btn-row">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                updatePost(post._id, {
                  status: post.status === 'published' ? 'draft' : 'published'
                })
              }
            >
              Toggle Status
            </Button>
            <Button size="sm" variant="danger" onClick={() => deletePost(post._id)}>
              Delete
            </Button>
          </div>
        </article>
      ))}
      {!items.length && !loading ? <p>No posts available yet.</p> : null}
    </div>
  );
}

