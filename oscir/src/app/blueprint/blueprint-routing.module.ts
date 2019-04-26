import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlueprintComponent } from './blueprint.component';
import { BlueprintEditComponent } from './blueprint-edit/blueprint-edit.component';
import { BlueprintAuthResolver } from './blueprint-auth-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: BlueprintComponent,
    resolve: {
      isAuthenticated: BlueprintAuthResolver
    },
    pathMatch: 'full'
  },
  {
    path: 'edit/:id',
    component: BlueprintEditComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BlueprintRoutingModule {}
