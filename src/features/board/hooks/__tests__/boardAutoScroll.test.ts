import { getAutoScrollDirection } from '../useBoardDragAndDrop';

describe('getAutoScrollDirection', () => {
  const rects = {
    todo: { x: 14, y: 100, width: 280, height: 500 },
    in_progress: { x: 306, y: 100, width: 280, height: 500 },
    done: { x: 598, y: 100, width: 280, height: 500 },
  };

  it('scrolls left when pointer is near screen left edge', () => {
    expect(getAutoScrollDirection(rects, 30, 400)).toBe(-1);
  });

  it('scrolls right when pointer is near screen right edge', () => {
    expect(getAutoScrollDirection(rects, 370, 400)).toBe(1);
  });

  it('scrolls left when pointer is left of visible columns', () => {
    expect(getAutoScrollDirection(rects, 0, 400)).toBe(-1);
  });

  it('does not scroll when pointer is over a column', () => {
    expect(getAutoScrollDirection(rects, 200, 400)).toBe(0);
  });
});
