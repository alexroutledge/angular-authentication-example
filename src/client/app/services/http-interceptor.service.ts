/*
 * Copyright (c) 2018 Company Name.
 * All rights reserved.
 *
 * Company Name and the Company Name logo are trademarks
 * or registered trademarks of Company Name
 * or its affiliates in the U.S. and other countries.
 * Other names may be trademarks of their respective owners.
 *
 * WATERMARK
 */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { includes } from 'lodash';

@Injectable()
export class HttpInterceptorService {

  constructor(private router: Router) { }

  /**
   * request - Intercepts the current response object before it is returned to the browser.
   * @param {HttpRequest} request
   * @param {HttpHandler} next
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .catch((error: HttpErrorResponse) => {
        if (includes([401, 422], error.status)) {
          // The authentication session has expired or the user is not authorised.
          // Redirect the user to the session expired URL
          this.router.navigate(['/login']);
        }
        return Observable.throw(error);
      });
  }

}
