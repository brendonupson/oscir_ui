import { ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BlueprintComponent } from './blueprint.component';
import { BlueprintAuthResolver } from './blueprint-auth-resolver.service';
import { SharedModule } from '../shared';
import { BlueprintRoutingModule } from './blueprint-routing.module';
import { CustomMaterialModule } from '../custom-material.module';
import { BlueprintEditComponent } from './blueprint-edit/blueprint-edit.component';
import { BlueprintAddPropertyComponent } from './blueprint-add-property/blueprint-add-property.component';
import { BlueprintAddRelationshipComponent } from './blueprint-add-relationship/blueprint-add-relationship.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ColorSquareComponent } from './color-square-widget/color-square-widget.component';

@NgModule({
  imports: [
    SharedModule,
    BlueprintRoutingModule,
    CustomMaterialModule,
    NgxGraphModule,
    NgxChartsModule
  ],
  declarations: [ 
    BlueprintComponent, BlueprintEditComponent, BlueprintAddPropertyComponent, BlueprintAddRelationshipComponent,
    ColorSquareComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ BlueprintAddPropertyComponent, BlueprintAddRelationshipComponent],
  providers: [
    BlueprintAuthResolver
  ]
})
export class BlueprintModule {}
