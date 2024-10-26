import { FilterMetadata } from 'primeng/api';

export interface TableFiltersInterface {
  [s: string]: FilterMetadata | FilterMetadata[] | undefined;
}

export interface routeFiltersInterface {
  scope: string;
  operator: string;
  value: string;
  type: string;
}
