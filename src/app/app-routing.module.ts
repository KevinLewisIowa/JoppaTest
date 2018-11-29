import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoutesComponent }   from './routes/routes.component';
import { LocationsComponent } from './locations/locations.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { RouteEditComponent } from './routes/route-edit/route-edit.component';
import { LocationDetailEditComponent } from './location-detail-edit/location-detail-edit.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { CreateRouteComponent } from "app/create-route/create-route.component";
import { CreateLocationCampComponent } from './create-location-camp/create-location-camp.component';
import { LocationCampComponent } from "app/location-camp/location-camp.component";
import { ServicingClientComponent } from "app/client/servicing-client/servicing-client.component";
import { AdminHomeComponent } from 'app/admin-home/admin-home.component';
import { AdminRouteMealsComponent } from './admin-route-meals/admin-route-meals.component';
import { AdminRouteUndeliveredItemsComponent } from './admin-route-undelivered-items/admin-route-undelivered-items.component';
import { AdminRouteUnfulfilledGoalsNextStepsComponent } from './admin-route-unfulfilled-goals-next-steps/admin-route-unfulfilled-goals-next-steps.component';
import { AdminRouteUnfulfilledPrayerRequestsNeedsComponent } from './admin-route-unfulfilled-prayer-requests-needs/admin-route-unfulfilled-prayer-requests-needs.component';
import { CreateHeatingUnitComponent } from './create-heating-unit/create-heating-unit.component';
import { AdminHeaterListingComponent } from './admin-heater-listing/admin-heater-listing.component';
import { LeaderSignInComponent } from './leader-sign-in/leader-sign-in.component';
import { CheckoutHeatersComponent } from './checkout-heaters/checkout-heaters.component';
import { VolunteerInfoComponent } from './volunteer-info/volunteer-info.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { NewClientsReportComponent } from './admin-reports/new-clients-report/new-clients-report.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { MainLoginComponent } from './main-login/main-login.component';
import { IsLoggedInGuard } from 'app/guards/login.guard';
import { RouteMapComponent } from './route-map/route-map.component';
import { RouteSummaryReportComponent } from './admin-reports/route-summary-report/route-summary-report.component';

const routes: Routes = [
  { path: 'routes', canActivate: [IsLoggedInGuard], component: RoutesComponent },
  { path: 'login', canActivate: [IsLoggedInGuard], component: LeaderSignInComponent },
  { path: 'checkoutHeaters', canActivate: [IsLoggedInGuard], component: CheckoutHeatersComponent },
  { path: 'route/:id', canActivate: [IsLoggedInGuard], component: LocationsComponent },
  { path: 'location/:id', canActivate: [IsLoggedInGuard], component: LocationDetailComponent },
  { path: 'routeMap/:id', canActivate: [IsLoggedInGuard], component: RouteMapComponent },
  { path: 'locationCamp/:id', canActivate: [IsLoggedInGuard], component: LocationCampComponent},
  { path: 'routeNew', canActivate: [IsLoggedInGuard], component: CreateRouteComponent },
  { path: 'routeEdit/:id', canActivate: [IsLoggedInGuard], component: RouteEditComponent },
  { path: 'locationNew', canActivate: [IsLoggedInGuard], component: LocationDetailEditComponent },
  { path: 'locationEdit/:id', canActivate: [IsLoggedInGuard], component: LocationDetailEditComponent },
  { path: 'createClient', canActivate: [IsLoggedInGuard], component: ClientEditComponent },
  { path: 'clientEdit/:id', canActivate: [IsLoggedInGuard], component: ClientEditComponent },
  { path: 'admin/reports', canActivate: [IsLoggedInGuard], component: AdminReportsComponent },
  { path: 'admin/reports/newClients', canActivate: [IsLoggedInGuard], component: NewClientsReportComponent},
  { path: 'admin/reports/routeUndeliveredItems', canActivate: [IsLoggedInGuard], component: AdminRouteUndeliveredItemsComponent },
  { path: 'admin/reports/routeMeals', canActivate: [IsLoggedInGuard], component: AdminRouteMealsComponent },
  { path: 'admin/reports/routeUnfulfilledGoalsNextSteps', canActivate: [IsLoggedInGuard], component: AdminRouteUnfulfilledGoalsNextStepsComponent },
  { path: 'admin/reports/routeUnfulfilledPrayerRequestsNeeds', canActivate: [IsLoggedInGuard],
          component: AdminRouteUnfulfilledPrayerRequestsNeedsComponent },
  { path: 'admin/reports/routeSummary', canActivate: [IsLoggedInGuard], component: RouteSummaryReportComponent},
  { path: 'locationCampNew', canActivate: [IsLoggedInGuard], component: CreateLocationCampComponent },
  { path: 'serviceClient', canActivate: [IsLoggedInGuard], component: ServicingClientComponent },
  { path: 'adminHome', canActivate: [IsLoggedInGuard], component: AdminHomeComponent },
  { path: 'adminLogin', canActivate: [IsLoggedInGuard], component: AdminLoginComponent },
  { path: 'heaterNew', canActivate: [IsLoggedInGuard], component: CreateHeatingUnitComponent },
  { path: 'admin/reports/heaterListing', canActivate: [IsLoggedInGuard], component: AdminHeaterListingComponent },
  { path: 'volunteerInfo', canActivate: [IsLoggedInGuard], component: VolunteerInfoComponent },
  { path: 'application-login', component: MainLoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [IsLoggedInGuard]
})
export class AppRoutingModule {}
