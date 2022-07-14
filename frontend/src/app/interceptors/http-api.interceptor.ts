import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { finalize, tap } from 'rxjs/operators';
  
  import { LoadingStore } from '../store/loading/loading.store';
  
  @Injectable()
  export class HttpApiInterceptor implements HttpInterceptor {
    public constructor(private store: LoadingStore) {}
  
    public intercept(
      req: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        tap(_ => this.store.set('loading', true)),
        finalize(() => this.store.set('loading', false))
      );
    }
  }