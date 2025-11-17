import { renderHook, act } from '@testing-library/react';
import { useAsync } from '../../hooks/useAsync';

describe('useAsync', () => {
  it('handles success path', async () => {
    const asyncFn = jest.fn().mockResolvedValue('done');
    const { result } = renderHook(() => useAsync(asyncFn, { immediate: false }));

    await act(async () => {
      await result.current.execute('value');
    });

    expect(asyncFn).toHaveBeenCalledWith('value');
    expect(result.current.status).toBe('success');
    expect(result.current.value).toBe('done');
  });

  it('handles errors', async () => {
    const asyncFn = jest.fn().mockRejectedValue(new Error('failed'));
    const { result } = renderHook(() => useAsync(asyncFn, { immediate: false }));

    await expect(
      act(async () => {
        await result.current.execute();
      })
    ).rejects.toThrow('failed');

    expect(result.current.status).toBe('error');
  });
});

