import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OwnerComponent } from './owner.component';
import { OwnerAuthResolver } from './owner-auth-resolver.service';
import { SharedModule } from '../shared';
import { OwnerRoutingModule } from './owner-routing.module';
import { CustomMaterialModule } from '../custom-material.module';
import { OwnerEditComponent } from './owner-edit/owner-edit.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    SharedModule,
    OwnerRoutingModule,
    CustomMaterialModule,
    NgxChartsModule
  ],
  declarations: [ 
    OwnerComponent, OwnerEditComponent
  ],
  providers: [
    OwnerAuthResolver
  ]
})
export class OwnerModule {}
