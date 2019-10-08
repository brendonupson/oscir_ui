import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from './auth/auth-guard.service';


const routes: Routes = [  
  {
    path: '',
    pathMatch: 'full',
    //loadChildren: './configitem/configitem.module#ConfigItemModule',
    redirectTo: '/configitem',
    //canActivate: [AuthGuard]   
  },
  {
    path: 'login',
    loadChildren: './auth/auth.module#AuthModule'    
  },
 {
    path: 'help',
    loadChildren: './help/help.module#HelpModule',
    canActivate: [AuthGuard]
  },
 {
    path: 'configitem',
    loadChildren: './configitem/configitem.module#ConfigItemModule',
    canActivate: [AuthGuard]
  },
  {
     path: 'blueprint',
     loadChildren: './blueprint/blueprint.module#BlueprintModule',
     canActivate: [AuthGuard]
   },
   {
     path: 'user',
     loadChildren: './user/user.module#UserModule',
     canActivate: [AuthGuard]
   },
   {
     path: 'owner',
     loadChildren: './owner/owner.module#OwnerModule',
     canActivate: [AuthGuard]
   },
   {
     path: 'dashboard',
     loadChildren: './dashboard/dashboard.module#DashboardModule',
     canActivate: [AuthGuard]
   },
   {
     path: 'map',
     loadChildren: './map/map.module#MapModule',
     canActivate: [AuthGuard]
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preload all modules; optionally we could
    // implement a custom preloading strategy for just some
    // of the modules (PRs welcome 😉)
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
