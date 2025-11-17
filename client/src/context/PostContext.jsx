import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { api } from '../services/api';
import { useNotifications } from '../store/useNotifications';

const PostContext = createContext(null);

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastRefreshed: null,
  metrics: {
    total: 0,
    published: 0,
    drafts: 0
  }
};

function calculateMetrics(posts) {
  const published = posts.filter((post) => post.status === 'published').length;
  const drafts = posts.filter((post) => post.status === 'draft').length;

  return {
    total: posts.length,
    published,
    drafts
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'REQUEST_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'REQUEST_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_POSTS': {
      const metrics = calculateMetrics(action.payload);
      return {
        ...state,
        loading: false,
        items: action.payload,
        lastRefreshed: new Date().toISOString(),
        metrics
      };
    }
    case 'ADD_POST': {
      const items = [action.payload, ...state.items];
      return {
        ...state,
        loading: false,
        items,
        metrics: calculateMetrics(items)
      };
    }
    case 'UPDATE_POST': {
      const items = state.items.map((post) => (post._id === action.payload._id ? action.payload : post));
      return {
        ...state,
        loading: false,
        items,
        metrics: calculateMetrics(items)
      };
    }
    case 'DELETE_POST': {
      const items = state.items.filter((post) => post._id !== action.payload);
      return {
        ...state,
        loading: false,
        items,
        metrics: calculateMetrics(items)
      };
    }
    default:
      return state;
  }
}

export function PostProvider({ children, apiService = api }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { pushNotification } = useNotifications();

  const fetchPosts = useCallback(
    async (params) => {
      dispatch({ type: 'REQUEST_START' });
      try {
        const posts = await apiService.fetchPosts(params);
        dispatch({ type: 'SET_POSTS', payload: posts });
        return posts;
      } catch (error) {
        dispatch({ type: 'REQUEST_ERROR', payload: error.message || 'Failed to load posts' });
        throw error;
      }
    },
    [apiService]
  );

  const createPost = useCallback(
    async (payload) => {
      dispatch({ type: 'REQUEST_START' });
      try {
        const post = await apiService.createPost(payload);
        dispatch({ type: 'ADD_POST', payload: post });
        pushNotification({
          type: 'success',
          title: 'Post created',
          message: `"${post.title}" is now ${post.status}.`
        });
        return post;
      } catch (error) {
        dispatch({ type: 'REQUEST_ERROR', payload: error.message || 'Failed to create post' });
        pushNotification({
          type: 'error',
          title: 'Creation failed',
          message: error.message || 'Unable to create post'
        });
        throw error;
      }
    },
    [apiService, pushNotification]
  );

  const updatePost = useCallback(
    async (id, updates) => {
      dispatch({ type: 'REQUEST_START' });
      try {
        const post = await apiService.updatePost(id, updates);
        dispatch({ type: 'UPDATE_POST', payload: post });
        pushNotification({
          type: 'info',
          title: 'Post updated',
          message: `"${post.title}" has been updated.`
        });
        return post;
      } catch (error) {
        dispatch({ type: 'REQUEST_ERROR', payload: error.message || 'Failed to update post' });
        throw error;
      }
    },
    [apiService, pushNotification]
  );

  const deletePost = useCallback(
    async (id) => {
      dispatch({ type: 'REQUEST_START' });
      try {
        await apiService.deletePost(id);
        dispatch({ type: 'DELETE_POST', payload: id });
        pushNotification({
          type: 'warning',
          title: 'Post deleted',
          message: 'Post removed from dashboard.'
        });
      } catch (error) {
        dispatch({ type: 'REQUEST_ERROR', payload: error.message || 'Failed to delete post' });
        throw error;
      }
    },
    [apiService, pushNotification]
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const value = useMemo(
    () => ({
      ...state,
      fetchPosts,
      createPost,
      updatePost,
      deletePost
    }),
    [state, fetchPosts, createPost, updatePost, deletePost]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
}

