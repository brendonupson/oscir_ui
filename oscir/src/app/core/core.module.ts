import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';

import {
  ApiService,  
  ClassService,
  JwtService,
  OwnerService,
  UserService,
  ConfigItemService,
  ReportService
} from './services';

import { AuthGuard } from '../auth/auth-guard.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    AuthGuard,
    ClassService,
    JwtService,
    OwnerService,    
    UserService,
    ConfigItemService,
    ReportService
  ],
  declarations: []
})
export class CoreModule { }
