import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { UserAuthResolver } from './user-auth-resolver.service';
import { SharedModule } from '../shared';
import { UserRoutingModule } from './user-routing.module';
import { CustomMaterialModule } from '../custom-material.module';
import { UserEditComponent } from './user-edit/user-edit.component';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule,
    CustomMaterialModule
  ],
  declarations: [ 
    UserComponent, UserEditComponent
  ],
  providers: [
    UserAuthResolver
  ]
})
export class UserModule {}
