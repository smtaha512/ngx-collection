import { Injectable } from '@angular/core';
import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseUrlInterceptor implements HttpInterceptor {
  static baseUrl: string;

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.startsWith('/')) {
      req = req.clone({ url: BaseUrlInterceptor.baseUrl + req.url });
    }
    return next.handle(req);
  }
}
