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
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private http: HttpClient) {}

  /**
   * canActivate - Determines if the user is authenticated to access the current component.
   * If the user is not authenticated, the app will listen for a 401 response
   * and redirect the user to the logout URL.
   */
  public canActivate(): Observable<boolean> {
    return this.http.get('/api/v1/authenticate')
      .map((success: any) => true)
      .catch(this.handleError);
  }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    return Observable.of(false);
  }
}
