export type CaseType =
  | 'uppercase'
  | 'lowercase'
  | 'titlecase'
  | 'sentencecase'
  | 'camelcase'
  | 'pascalcase'
  | 'snakecase'
  | 'kebabcase';

export function transformText(text: string, type: CaseType): string {
  if (!text) return '';

  const words = text
    .replace(/[-_]/g, ' ') // Replace separators with spaces
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  switch (type) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    case 'sentencecase':
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case 'camelcase':
      return words
        .map((word, index) => {
          const lower = word.toLowerCase();
          return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
    case 'pascalcase':
      return words
        .map((word) => {
          const lower = word.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
    case 'snakecase':
      return words.map((word) => word.toLowerCase()).join('_');
    case 'kebabcase':
      return words.map((word) => word.toLowerCase()).join('-');
    default:
      return text;
  }
}
