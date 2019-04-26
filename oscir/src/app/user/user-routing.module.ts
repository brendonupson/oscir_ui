import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { UserAuthResolver } from './user-auth-resolver.service';
import { UserEditComponent } from './user-edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    resolve: {
      isAuthenticated: UserAuthResolver
    },
    pathMatch: 'full'
  },
  {
    path: 'edit/:id',
    component: UserEditComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule {}
