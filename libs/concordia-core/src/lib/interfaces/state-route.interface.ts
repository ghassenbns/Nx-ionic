import { Params } from '@angular/router';

export interface StateRoute {
  url: string;
  params: Params;
  queryParams: Params;
}
