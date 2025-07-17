import clsxm from '@/lib/clsxm';

describe('clsxm', () => {
  it('merges simple class names', () => {
    expect(clsxm('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(clsxm('foo', false, 'baz')).toBe('foo baz');
    expect(clsxm('foo', 'bar')).toBe('foo bar');
  });

  it('removes duplicate tailwind classes', () => {
    expect(clsxm('p-2', 'p-4')).toBe('p-4');
    expect(clsxm('text-sm', 'text-lg', 'text-sm')).toBe('text-sm');
  });

  it('handles arrays and objects', () => {
    expect(clsxm(['foo', { bar: true, baz: false }])).toBe('foo bar');
    expect(clsxm({ foo: true, bar: false }, 'baz')).toBe('foo baz');
  });

  it('returns an empty string for no input', () => {
    expect(clsxm()).toBe('');
  });
});
