export function resetValue(field: any): any {
  switch (field) {
    case 'string':
      return '';
    case 'enum':
    case 'hidden':
      return null;
    case 'switch':
      return false;
    default:
      throw null;
  }
}
