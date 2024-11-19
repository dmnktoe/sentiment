interface ReadingOptions {
  emoji?: boolean;
  wordsPerMinute?: number;
}

export function readingDuration(text: string, options: ReadingOptions = { emoji: false, wordsPerMinute: 200 }): string {
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = options.wordsPerMinute ?? 200;
  const readingTime = Math.ceil(words / wordsPerMinute);

  const emojiDisplay = options.emoji ? '📚 ' : '';
  return `${emojiDisplay}${readingTime} min read`;
}
