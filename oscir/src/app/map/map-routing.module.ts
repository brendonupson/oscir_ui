import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map.component';
import { MapAuthResolver } from './map-auth-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    resolve: {
      isAuthenticated: MapAuthResolver
    },
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MapRoutingModule {}
