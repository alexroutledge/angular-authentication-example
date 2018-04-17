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

@Injectable()
export class RoleGuardService implements CanActivate {

  constructor(private http: HttpClient) {}

  /**
   * canActivate - Determines if the user is authenticated to access the current component.
   * If the user is not authenticated, the app will listen for a 401 response
   * and redirect the user to the logout URL.
   */
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.http.get(`/api/v1/roles/${route.data.permissions}`)
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
