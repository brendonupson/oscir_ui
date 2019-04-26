import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
//import { NoAuthGuard } from './no-auth-guard.service';
//import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
  /*{
    path: 'login',
    component: AuthComponent,
    //canActivate: [true] //[NoAuthGuard]
  }*/
  {
    path: '',
    component: AuthComponent,
    resolve: {
      //isAuthenticated: HomeAuthResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
