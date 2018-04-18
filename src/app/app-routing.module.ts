import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoutesComponent }   from './routes/routes.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { RouteEditComponent } from './routes/route-edit/route-edit.component';
import { LocationDetailEditComponent } from './location-detail-edit/location-detail-edit.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';

const routes: Routes = [
   
   { path: 'routes', component: RoutesComponent },
  { path: 'route/:id', component: LocationsComponent },
  { path: 'location/:id', component: LocationDetailComponent },
  { path: 'routeNew', component: RouteEditComponent },
  { path: 'routeEdit/:id', component: RouteEditComponent },
  { path: 'locationNew/:id', component: LocationDetailEditComponent },
  { path: 'locationEdit/:id', component: LocationDetailEditComponent },
  { path: 'clientNew', component: ClientEditComponent },
  { path: 'clientEdit/:id', component: ClientEditComponent },
  { path: '', redirectTo: '/routes', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
