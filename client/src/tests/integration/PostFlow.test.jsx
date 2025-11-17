import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostDashboard from '../../components/PostDashboard';
import { PostProvider } from '../../context/PostContext';

const newPost = {
  _id: '42',
  title: 'Coverage improvements',
  content: 'Document how tests improve coverage and resilience.',
  category: '64b8e45aa1b2c4578899aa12',
  status: 'draft',
  createdAt: new Date().toISOString()
};

function setup(mockApiOverrides = {}) {
  const mockApi = {
    fetchPosts: jest.fn().mockResolvedValue([]),
    createPost: jest.fn().mockResolvedValue(newPost),
    updatePost: jest.fn().mockResolvedValue({ ...newPost, status: 'published' }),
    deletePost: jest.fn().mockResolvedValue({ message: 'deleted' }),
    ...mockApiOverrides
  };

  render(
    <PostProvider apiService={mockApi}>
      <PostDashboard />
    </PostProvider>
  );

  return mockApi;
}

describe('PostDashboard integration', () => {
  it('allows creating and updating posts', async () => {
    const mockApi = setup();
    const user = userEvent.setup();

    await waitFor(() => expect(mockApi.fetchPosts).toHaveBeenCalled());

    await user.type(screen.getByLabelText(/title/i), newPost.title);
    await user.type(screen.getByLabelText(/content/i), newPost.content);
    await user.type(screen.getByLabelText(/category/i), newPost.category);

    await user.click(screen.getByRole('button', { name: /add post/i }));

    expect(mockApi.createPost).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText(/coverage improvements/i)).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /toggle status/i }));
    expect(mockApi.updatePost).toHaveBeenCalledWith(newPost._id, { status: 'published' });
  });
});

