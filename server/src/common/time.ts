export function epoch(date: Date) {
  return Math.floor(date.getTime() / 1000);
}