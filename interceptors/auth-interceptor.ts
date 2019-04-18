import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, filter, first, switchMap } from 'rxjs/operators';
import { BehaviorSubject, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress: boolean;
  private refreshTokenSubject = new BehaviorSubject(null);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req = this.setContentType(req);

    const modifiedRequest = this.appendTokenInHeaders(req);
    return next.handle(modifiedRequest).pipe(catchError(error => this.handleExpiredToken(req, next)(error)));
  }

  // TODO: Should be in separate interceptor
  setContentType(req: HttpRequest<any>) {
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json; charset=utf-8')
      });
    }
    return req;
  }

  appendTokenInHeaders(req: HttpRequest<any>) {
    const { url } = req;

    // These endpoints do not need auth token.
    const exemptedUrls = ['/forgot-pwd', '/login', '/refresh-token', '/signup'];
    if (exemptedUrls.some(exemptedUrl => exemptedUrl === url)) {
      return req;
    }

    req = this.addAuthenticationToken(req);

    return req;
  }

  handleExpiredToken(req: HttpRequest<any>, next: HttpHandler) {
    return (error: HttpErrorResponse) => {
      if (error && error.status === 401) {
        // Most likely due to expired token
        if (this.refreshTokenInProgress) {
          // Wait for the new token before making any requests.
          return this.refreshTokenSubject.pipe(
            filter(result => !!result),
            first(),
            switchMap(() => next.handle(this.addAuthenticationToken(req)))
          );
        } else {
          this.refreshTokenInProgress = true;
          // Set the refreshTokenSubject to null to make subsequent API calls to wait until the new token has been retrieved
          this.refreshTokenSubject.next(null);

          return this.mockAuthService().pipe(
            switchMap(token => {
              localStorage.setItem('token', token);
              this.refreshTokenInProgress = false;
              this.refreshTokenSubject.next(token);
              return next.handle(this.addAuthenticationToken(req));
            }),
            catchError(err => {
              this.refreshTokenInProgress = false;
              return throwError(err);
            })
          );
        }
      } else {
        return next.handle(req);
      }
    };
  }

  // Return request with token appended in headers
  addAuthenticationToken(req: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('token');

    req = req.clone({
      headers: req.headers.set('x-access-token', token)
    });

    return req;
  }

  private mockAuthService() {
    return of('Mock Auth Token');
  }
}
