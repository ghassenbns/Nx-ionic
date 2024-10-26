import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface ClientOptions {
  body?: any;
  headers?: | HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: | HttpParams | {
    [param: string]: any | any[];
  };
  responseType?: any;
}
