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

import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';

import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ROUTES } from './app.routes';
import { RouterModule } from '@angular/router';
import 'hammerjs';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RoleGuardService } from './services/role-guard.service';
import { LoginComponent } from './login/login.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { HasPermissionDirective } from './has-permission.directive';
import { AdminComponent } from './admin/admin.component';

const HttpInterceptorServiceProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpInterceptorService,
  deps: [Router],
  multi: true
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HasPermissionDirective,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(ROUTES),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    },
    AuthGuardService,
    RoleGuardService,
    HttpInterceptorServiceProvider,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve) => {
    injector.get(LOCATION_INITIALIZED, Promise.resolve()).then(() => {
      translate.addLangs(['en-US', 'it']);
      translate.setDefaultLang('en-US');
      translate.use('en-US').subscribe(() => { resolve(); });
    });
  });
}
