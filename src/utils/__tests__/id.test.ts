import { createTaskId, createTimestamp } from '../id';

describe('id utilities', () => {
  it('creates unique task ids', () => {
    const a = createTaskId();
    const b = createTaskId();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('creates valid ISO timestamps', () => {
    const ts = createTimestamp();
    expect(Number.isNaN(new Date(ts).getTime())).toBe(false);
  });
});
