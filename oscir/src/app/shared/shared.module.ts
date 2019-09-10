import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { EditAuditComponent } from './edit-audit.component';
import { ListErrorsComponent } from './list-errors.component';
import { ShowAuthedDirective } from './show-authed.directive';
import { RackElevationComponent } from './rack-elevation/rack-elevation.component';
import { MapViewComponent } from './map-view/map-view.component';

import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    NgxGraphModule,
    NgxChartsModule
  ],
  declarations: [    
    ListErrorsComponent,
    RackElevationComponent,
    MapViewComponent, 
    EditAuditComponent,
    ShowAuthedDirective
  ],
  exports: [    
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ListErrorsComponent,
    RackElevationComponent, 
    MapViewComponent,
    EditAuditComponent,
    RouterModule,
    ShowAuthedDirective
  ]
})

export class SharedModule {}
