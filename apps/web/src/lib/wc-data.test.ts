import { describe, expect, it } from 'vitest';
import { americanToImplied, getFallbackData } from './wc-data';

describe('americanToImplied', () => {
  it('converts Brazil +1300 to ~7.1%', () => {
    expect(americanToImplied(1300)).toBeCloseTo(0.0714, 3);
  });

  it('converts France +360 to ~21.7%', () => {
    expect(americanToImplied(360)).toBeCloseTo(0.2174, 3);
  });

  it('handles negative (favored) odds', () => {
    expect(americanToImplied(-200)).toBeCloseTo(0.6667, 3);
  });

  it('returns 0 for zero odds', () => {
    expect(americanToImplied(0)).toBe(0);
  });
});

describe('getFallbackData', () => {
  const data = getFallbackData();

  it('marks source as fallback', () => {
    expect(data.source).toBe('fallback');
  });

  it('exposes the full 6-phase knockout path ending in the Final', () => {
    expect(data.knockoutPath).toHaveLength(6);
    expect(data.knockoutPath.at(-1)?.phase_label).toBe('Final');
  });

  it('has reach probabilities that monotonically decrease across phases', () => {
    const probs = data.knockoutPath.map((p) => p.reach_prob);
    for (let i = 1; i < probs.length; i++) {
      expect(probs[i]).toBeLessThanOrEqual(probs[i - 1]);
    }
  });

  it('includes Brazil exactly once in the title odds, highlighted', () => {
    const brazil = data.titleOdds.filter((t) => t.is_brazil);
    expect(brazil).toHaveLength(1);
    expect(brazil[0].team).toBe('Brasil');
  });

  it('has Brazil topping Group C', () => {
    expect(data.standings[0].team).toBe('Brasil');
    expect(data.standings[0].position).toBe(1);
  });
});
