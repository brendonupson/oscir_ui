import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  private getApiUrlAndPath(path: string) {
    //if this file exists in docker container, use it (/custom_env.js)

    var x = eval('typeof window.custom_environment');
    //console.log('x='+x);
    if (x != 'undefined') {
      var url = eval('custom_environment.api_url');
      //console.log('url='+url);
      if (url != 'undefined' && url != '') {
        return url + `${path}`;
      }
    }

    return `${environment.api_url}${path}`;
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(this.getApiUrlAndPath(path), { params })
      .pipe(catchError(this.formatErrors));
    /*return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
      */
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      this.getApiUrlAndPath(path),
      //`${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      this.getApiUrlAndPath(path),
      //`${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  patch(path: string, body: Object = {}): Observable<any> {
    return this.http.patch(
      this.getApiUrlAndPath(path),
      //`${environment.api_url}${path}`,
      JSON.stringify(body)
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      this.getApiUrlAndPath(path),
      //`${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}
