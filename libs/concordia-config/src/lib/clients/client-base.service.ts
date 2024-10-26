import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from '../services';
import { ClientOptions } from './interfaces';

@Injectable()
export class ClientBaseService {

  constructor(
    private readonly http: HttpClient,
    protected config: ConfigService,
  ) {
  }

  get(path: string, options: ClientOptions = { }): Observable<any> {
    return this.http.get(`${this.getUrl()}${path}`, options);
  }

  post(path: string, body: any, options: ClientOptions = { }): Observable<any> {
    return this.http.post(`${this.getUrl()}${path}`, body, options);
  }

  put(path: string, body: any, options: ClientOptions = { }): Observable<any> {
    return this.http.put(`${this.getUrl()}${path}`, body, options);
  }

  patch(path: string, body: any, options: ClientOptions = { }): Observable<any> {
    return this.http.patch(`${this.getUrl()}${path}`, body, options);
  }

  deleteHttp(path: string, options: ClientOptions = { }): Observable<any> {
    return this.http.delete(`${this.getUrl()}${path}`, options);
  }

  protected getUrl(): string {
    const url = this.config.getEnvironment().config.apiUrl ?? null;

    if (!url) {
      // Throw an error since the application can not proceed any further.
      throw new Error(`API url is not defined.`);
    }

    return `${url}`;
  }

}
