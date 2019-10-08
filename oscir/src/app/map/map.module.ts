import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MapComponent } from './map.component';
import { MapAuthResolver } from './map-auth-resolver.service';
import { SharedModule } from '../shared';
import { MapRoutingModule } from './map-routing.module';
import { CustomMaterialModule } from '../custom-material.module';


@NgModule({
  imports: [
    SharedModule,
    MapRoutingModule,
    CustomMaterialModule    
  ],
  declarations: [ 
    MapComponent
  ],
  providers: [
    MapAuthResolver
  ]
})
export class MapModule {}
