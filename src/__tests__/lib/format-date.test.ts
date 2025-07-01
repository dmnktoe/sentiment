import { formatDate } from '../../lib/format-date';

describe('formatDate', () => {
  it('formats a valid date correctly', () => {
    expect(formatDate(new Date('2023-06-15'))).toBe('June 15, 2023');
    expect(formatDate(new Date('2000-01-01'))).toBe('January 1, 2000');
  });

  it('handles leap years', () => {
    expect(formatDate(new Date('2020-02-29'))).toBe('February 29, 2020');
  });

  it('handles different months', () => {
    expect(formatDate(new Date('2023-12-25'))).toBe('December 25, 2023');
    expect(formatDate(new Date('2023-04-01'))).toBe('April 1, 2023');
  });

  it('returns "Invalid Date" for invalid input', () => {
    // @ts-expect-error: Testing function with invalid input type to ensure error handling
    expect(formatDate('invalid-date')).toBe('Invalid Date');
  });
});
