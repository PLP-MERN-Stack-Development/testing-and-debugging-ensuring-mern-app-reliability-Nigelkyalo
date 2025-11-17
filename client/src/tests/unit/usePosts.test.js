import { renderHook, waitFor } from '@testing-library/react';
import { PostProvider, usePostContext } from '../../context/PostContext';

const basePost = {
  _id: '1',
  title: 'Hello world',
  content: 'This is a test post with enough length',
  category: '507f1f77bcf86cd799439011',
  status: 'draft',
  createdAt: new Date().toISOString()
};

function createMockApi(overrides = {}) {
  return {
    fetchPosts: jest.fn().mockResolvedValue([basePost]),
    createPost: jest.fn().mockResolvedValue({ ...basePost, _id: '2', title: 'New', status: 'published' }),
    updatePost: jest.fn().mockResolvedValue({ ...basePost, status: 'published' }),
    deletePost: jest.fn().mockResolvedValue({ message: 'deleted' }),
    ...overrides
  };
}

describe('usePostContext', () => {
  it('loads posts on mount and exposes metrics', async () => {
    const mockApi = createMockApi();
    const wrapper = ({ children }) => <PostProvider apiService={mockApi}>{children}</PostProvider>;

    const { result } = renderHook(() => usePostContext(), { wrapper });

    await waitFor(() => expect(mockApi.fetchPosts).toHaveBeenCalled());
    expect(result.current.items).toHaveLength(1);
    expect(result.current.metrics.total).toBe(1);
  });

  it('creates a post and updates state optimistically', async () => {
    const mockApi = createMockApi();
    const wrapper = ({ children }) => <PostProvider apiService={mockApi}>{children}</PostProvider>;

    const { result } = renderHook(() => usePostContext(), { wrapper });
    await waitFor(() => expect(mockApi.fetchPosts).toHaveBeenCalled());

    await result.current.createPost({
      title: 'New',
      content: 'Another content block with enough length',
      category: '507f1f77bcf86cd799439011'
    });

    expect(mockApi.createPost).toHaveBeenCalled();
    expect(result.current.items).toHaveLength(2);
    expect(result.current.metrics.published).toBe(1);
  });
});

