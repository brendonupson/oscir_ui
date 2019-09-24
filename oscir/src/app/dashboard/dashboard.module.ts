import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardAuthResolver } from './dashboard-auth-resolver.service';
import { SharedModule } from '../shared';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CustomMaterialModule } from '../custom-material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
    CustomMaterialModule,
    NgxChartsModule
  ],
  declarations: [ 
    DashboardComponent
  ],
  providers: [
    DashboardAuthResolver
  ]
})
export class DashboardModule {}
