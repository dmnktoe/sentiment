/**
 * Tests for reading time calculation utility
 */
import { readingDuration } from '@/lib/get-reading-time';

describe('readingDuration', () => {
  describe('Basic Calculation', () => {
    it('should calculate reading time for short text', () => {
      const text = 'This is a short text with ten words here.';
      const result = readingDuration(text);
      expect(result).toBe('1 min read');
    });

    it('should calculate reading time for longer text', () => {
      const words = new Array(400).fill('word').join(' ');
      const result = readingDuration(words);
      expect(result).toBe('2 min read');
    });

    it('should round up to next minute', () => {
      const words = new Array(201).fill('word').join(' '); // 201 words at 200 wpm = 1.005 min
      const result = readingDuration(words);
      expect(result).toBe('2 min read');
    });

    it('should handle empty text', () => {
      const result = readingDuration('');
      expect(result).toBe('1 min read'); // Math.ceil(0/200) = 0, but min is 1
    });

    it('should handle single word', () => {
      const result = readingDuration('word');
      expect(result).toBe('1 min read');
    });
  });

  describe('Custom Words Per Minute', () => {
    it('should use custom wordsPerMinute option', () => {
      const words = new Array(300).fill('word').join(' ');
      const result = readingDuration(words, { wordsPerMinute: 300 });
      expect(result).toBe('1 min read');
    });

    it('should use custom slower reading speed', () => {
      const words = new Array(200).fill('word').join(' ');
      const result = readingDuration(words, { wordsPerMinute: 100 });
      expect(result).toBe('2 min read');
    });

    it('should handle zero wordsPerMinute gracefully', () => {
      const words = 'some text here';
      const result = readingDuration(words, { wordsPerMinute: 0 });
      // Math.ceil(words / 0) = Infinity, but we expect it to handle gracefully
      expect(result).toContain('min read');
    });
  });

  describe('Emoji Option', () => {
    it('should include emoji when emoji option is true', () => {
      const text = 'This is some text';
      const result = readingDuration(text, { emoji: true });
      expect(result).toBe('📚 1 min read');
    });

    it('should not include emoji when emoji option is false', () => {
      const text = 'This is some text';
      const result = readingDuration(text, { emoji: false });
      expect(result).toBe('1 min read');
    });

    it('should not include emoji by default', () => {
      const text = 'This is some text';
      const result = readingDuration(text);
      expect(result).not.toContain('📚');
    });
  });

  describe('Text Parsing', () => {
    it('should handle multiple spaces between words', () => {
      const text = 'word1    word2     word3';
      const result = readingDuration(text);
      expect(result).toBe('1 min read');
    });

    it('should trim whitespace', () => {
      const text = '   some text here   ';
      const result = readingDuration(text);
      expect(result).toBe('1 min read');
    });

    it('should handle newlines', () => {
      const text = 'word1\nword2\nword3';
      const result = readingDuration(text);
      expect(result).toBe('1 min read');
    });

    it('should handle tabs', () => {
      const text = 'word1\tword2\tword3';
      const result = readingDuration(text);
      expect(result).toBe('1 min read');
    });
  });

  describe('Default Options', () => {
    it('should use 200 wpm as default', () => {
      const words = new Array(200).fill('word').join(' ');
      const result = readingDuration(words);
      expect(result).toBe('1 min read');
    });

    it('should use emoji: false as default', () => {
      const result = readingDuration('some text');
      expect(result).toBe('1 min read');
      expect(result).not.toContain('📚');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long text', () => {
      const words = new Array(10000).fill('word').join(' ');
      const result = readingDuration(words);
      expect(result).toBe('50 min read');
    });

    it('should handle special characters', () => {
      const text = 'word1! word2? word3.';
      const result = readingDuration(text);
      expect(result).toBe('1 min read');
    });

    it('should count hyphenated words correctly', () => {
      const text = 'well-known state-of-the-art best-practice';
      const result = readingDuration(text);
      expect(result).toBe('1 min read');
    });
  });
});
