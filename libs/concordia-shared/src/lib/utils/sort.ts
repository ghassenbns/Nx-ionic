export function sortFn(key: 'asc' | 'desc'): number {
  switch (key) {
    case 'desc':
      return -1;
    default:
      return 1;
  }
}
