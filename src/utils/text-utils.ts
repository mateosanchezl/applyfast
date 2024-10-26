export const countWords = (text: string): number => {
  const words = text.match(/\b\w+\b/g);
  return words ? words.length : 0;
};
