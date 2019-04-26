import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigItemComponent } from './configitem.component';
import { ConfigItemEditComponent } from './configitem-edit/configitem-edit.component';
import { ConfigItemAuthResolver } from './configitem-auth-resolver.service';

const routes: Routes = [  
  {
    path: '',
    component: ConfigItemComponent,
    resolve: {
      isAuthenticated: ConfigItemAuthResolver
    },
    pathMatch: 'full'
  },
  {
    path: 'edit/:id',
    component: ConfigItemEditComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConfigItemRoutingModule {}
