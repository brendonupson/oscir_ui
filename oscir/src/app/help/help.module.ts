import { ModuleWithProviders, NgModule } from '@angular/core';

import { HelpComponent } from './help.component';
import { CustomMaterialModule } from '../custom-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CustomMaterialModule,
    RouterModule.forChild([
      { path: '', component: HelpComponent}
    ])
  ],
  declarations: [     
    HelpComponent
  ],
  providers: [    
  ]
})
export class HelpModule {}
