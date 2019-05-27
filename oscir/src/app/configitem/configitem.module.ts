import { ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfigItemComponent } from './configitem.component';
import { ConfigItemAuthResolver } from './configitem-auth-resolver.service';
import { SharedModule } from '../shared';
import { ConfigItemRoutingModule } from './configitem-routing.module';
import { CustomMaterialModule } from '../custom-material.module';
import { ConfigItemEditComponent } from './configitem-edit/configitem-edit.component';
import { ConfigItemPropertyComponent } from './configitem-property/configitem-property.component';
import { ConfigItemAddRelationshipComponent } from './configitem-add-relationship/configitem-add-relationship.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ConfigItemEditBulkComponent } from './configitem-edit-bulk/configitem-edit-bulk.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    ConfigItemRoutingModule,
    CustomMaterialModule,
    NgxGraphModule,
    NgxChartsModule
  ],
  declarations: [ 
    ConfigItemComponent, ConfigItemEditComponent, ConfigItemAddRelationshipComponent, ConfigItemEditBulkComponent, ConfigItemPropertyComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ ConfigItemAddRelationshipComponent, ConfigItemEditBulkComponent],
  providers: [
    ConfigItemAuthResolver
  ]
})
export class ConfigItemModule {}
