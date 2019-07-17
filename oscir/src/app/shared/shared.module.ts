import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { EditAuditComponent } from './edit-audit.component';
import { ListErrorsComponent } from './list-errors.component';
import { ShowAuthedDirective } from './show-authed.directive';
import { RackElevationComponent } from './rack-elevation/rack-elevation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  declarations: [    
    ListErrorsComponent,
    RackElevationComponent,
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
    EditAuditComponent,
    RouterModule,
    ShowAuthedDirective
  ]
})

export class SharedModule {}
