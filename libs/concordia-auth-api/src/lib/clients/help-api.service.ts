import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelpApiService {
  readonly API_URL = '/assets/md';

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  load(lang: string, page: string): Observable<string> {
    return this.http.get(`${this.API_URL}/${lang}/${page}.md`, { responseType: 'text' });
  }

}
