import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpInterceptor,
  HttpResponse,
  HttpProgressEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { WindowService } from '@services/window.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private inj: Injector, private windowService: WindowService) {}

  getBaseHeader(): HttpHeaders {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return header;
  }

  getBlobHeader(): HttpHeaders {
    const header = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    });
    return header;
  }

  /* TODO: implement OAUTH/JWT */
  // getAuthHeaders(): HttpHeaders {
  //   let as = this.inj.get(AuthService);
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer '+as.getToken(),
  //     'Access-Control-Allow-Origin': '*'
  //   });
  //   return headers;
  // }

  intercept(req: HttpRequest<any>, next: any): Observable<any> {
    /* Change content/response types for posting/updating/retrieving files */
    if (
      req.method === 'GET' &&
      (req.url.indexOf('img') > 0 || req.url.indexOf('file') > 0)
    ) {
      const headers = this.getBlobHeader();
      const newReq = req.clone({ headers: headers, responseType: 'blob' });
      return next.handle(newReq);
    } else if (
      req.method === 'POST' ||
      (req.method === 'PUT' &&
        (req.url.indexOf('img') > 0 || req.url.indexOf('file') > 0))
    ) {
      const headers = this.getBlobHeader();
      const newReq = req.clone({ headers: headers });
      return next.handle(newReq);
    } else {
      return next.handle(req);
    }
  }
}
