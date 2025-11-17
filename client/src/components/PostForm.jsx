import { useState } from 'react';
import Button from './Button';
import { usePostContext } from '../context/PostContext';

const defaultFormState = {
  title: '',
  content: '',
  category: '507f1f77bcf86cd799439011',
  status: 'draft'
};

export default function PostForm() {
  const { createPost, loading } = usePostContext();
  const [formState, setFormState] = useState(defaultFormState);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!formState.title || !formState.content || !formState.category) {
      setError('Title, content, and category are required.');
      return;
    }

    try {
      await createPost({
        ...formState,
        tags: ['testing']
      });
      setFormState(defaultFormState);
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Unexpected error';
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="post form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" value={formState.title} onChange={handleChange} placeholder="Add a compelling title" />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows="4"
          value={formState.content}
          onChange={handleChange}
          placeholder="Describe the feature, bug fix, or insight..."
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input id="category" name="category" value={formState.category} onChange={handleChange} placeholder="Mongo ObjectId e.g. 507f1f77bcf86cd799439011" />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={formState.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {error ? (
        <p role="alert" style={{ color: '#b42318' }}>
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Add Post'}
      </Button>
    </form>
  );
}

