import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerComponent } from './owner.component';
import { OwnerEditComponent } from './owner-edit/owner-edit.component';
import { OwnerAuthResolver } from './owner-auth-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: OwnerComponent,
    resolve: {
      isAuthenticated: OwnerAuthResolver
    },
    pathMatch: 'full'
  },
  {
    path: 'edit/:id',
    component: OwnerEditComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OwnerRoutingModule {}
