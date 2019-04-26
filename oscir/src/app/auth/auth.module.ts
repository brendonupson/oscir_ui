import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { SharedModule } from '../shared';
import { AuthRoutingModule } from './auth-routing.module';

import { CustomMaterialModule } from '../custom-material.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CustomMaterialModule,
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    AuthComponent
  ],
  providers: [
    AuthGuard
  ]
})
export class AuthModule {}
