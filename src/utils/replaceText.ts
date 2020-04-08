/**
 * Replace every character in a text with given string
 */
export function replaceText(input: string, replacement: string) {
  return input.replace(/\w/gi, replacement);
}
