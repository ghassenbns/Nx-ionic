export interface TableEventInterface {
  first?: number;
  rows?: number;
  sortField?: string;
  sortOrder?: number;
  filters: any;
}

export interface FiltersInterface {
  [s: string]: FilterInterface;
}

export interface FilterInterface {
  value: any;
  type: string;
  matchMode: string;
}
