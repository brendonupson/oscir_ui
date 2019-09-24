import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardAuthResolver } from './dashboard-auth-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      isAuthenticated: DashboardAuthResolver
    },
    pathMatch: 'full'
  }/*,
  {
    path: 'edit/:id',
    component: DashboardEditComponent,
  }*/
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
