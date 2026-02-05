import { CircularStd } from '@/lib/fonts';

describe('fonts', () => {
  describe('CircularStd', () => {
    it('should be defined', () => {
      expect(CircularStd).toBeDefined();
    });

    it('should have className property', () => {
      expect(CircularStd).toHaveProperty('className');
      expect(typeof CircularStd.className).toBe('string');
    });

    it('should have style property', () => {
      expect(CircularStd).toHaveProperty('style');
      expect(CircularStd.style).toBeDefined();
    });
  });
});
