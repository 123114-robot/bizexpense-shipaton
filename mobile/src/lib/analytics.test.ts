import { describe, expect, it } from 'vitest';

import { trendBarHeight } from './analytics';

describe('mobile dashboard analytics', () => {
  it('scales values against the largest month', () => {
    expect(trendBarHeight(50, 100)).toBe(60);
    expect(trendBarHeight(100, 100)).toBe(120);
  });

  it('keeps zero-value months visible', () => {
    expect(trendBarHeight(0, 0)).toBe(2);
  });
});
