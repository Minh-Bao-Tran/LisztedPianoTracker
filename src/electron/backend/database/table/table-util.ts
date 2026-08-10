export function generateId(
  prefix: string,
  id: number,
  digits: number = 4,
): string {
  return `${prefix}${id.toString().padStart(digits, "0")}`;
}
