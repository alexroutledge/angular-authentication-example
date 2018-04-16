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

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'angular-authentication-example-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private http: HttpClient, private router: Router) {}

  public logIn() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.http.post('/api/v1/token', '', { headers }).pipe(
      mergeMap((res: any) => this.http.post(`/api/v1/login`, `accessToken=${res.accessToken}`, { headers })
    ))
    .subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

}
