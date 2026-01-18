import { transformText } from '@/utils/textTransforms';

describe('transformText', () => {
  const input = 'Hello World';

  it('converts to uppercase', () => {
    expect(transformText(input, 'uppercase')).toBe('HELLO WORLD');
  });

  it('converts to lowercase', () => {
    expect(transformText(input, 'lowercase')).toBe('hello world');
  });

  it('converts to titlecase', () => {
    expect(transformText('hello world', 'titlecase')).toBe('Hello World');
  });

  it('converts to sentencecase', () => {
    expect(transformText('hello world. how are you?', 'sentencecase')).toBe(
      'Hello world. How are you?'
    );
  });

  it('converts to camelcase', () => {
    expect(transformText(input, 'camelcase')).toBe('helloWorld');
    expect(transformText('hello_world', 'camelcase')).toBe('helloWorld');
    expect(transformText('Hello-World', 'camelcase')).toBe('helloWorld');
  });

  it('converts to pascalcase', () => {
    expect(transformText(input, 'pascalcase')).toBe('HelloWorld');
  });

  it('converts to snakecase', () => {
    expect(transformText(input, 'snakecase')).toBe('hello_world');
  });

  it('converts to kebabcase', () => {
    expect(transformText(input, 'kebabcase')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(transformText('', 'uppercase')).toBe('');
  });
});
