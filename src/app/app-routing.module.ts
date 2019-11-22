import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoutesComponent }   from './routes/routes.component';
import { LocationsComponent } from './locations/locations.component';
import { RouteEditComponent } from './routes/route-edit/route-edit.component';
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
import { IsLoggedInGuard, IsAdminGuard } from 'app/guards/login.guard';
import { RouteMapComponent } from './route-map/route-map.component';
import { RouteSummaryReportComponent } from './admin-reports/route-summary-report/route-summary-report.component';
import { ChangeRegularPasswordComponent } from 'app/change-regular-password/change-regular-password.component';
import { AdminCheckInComponent } from './admin-check-in/admin-check-in.component';
import { AdminSeenServicedReportComponent } from './admin-reports/admin-seen-serviced-report/admin-seen-serviced-report.component';
import { HeatEquipmentPerRouteReportComponent } from './heat-equipment-per-route-report/heat-equipment-per-route-report.component';
import { AdminClientListingComponent } from './admin-client-listing/admin-client-listing.component';
import { BirthdayMonthsReportComponent } from './admin-reports/birthday-months-report/birthday-months-report.component';
import { AdminOverallAttendanceComponent } from './admin-overall-attendance/admin-overall-attendance.component';

const routes: Routes = [
  { path: 'routes', canActivate: [IsLoggedInGuard], component: RoutesComponent },
  { path: 'login', canActivate: [IsLoggedInGuard], component: LeaderSignInComponent },
  { path: 'checkoutHeaters', canActivate: [IsLoggedInGuard], component: CheckoutHeatersComponent },
  { path: 'route/:id', canActivate: [IsLoggedInGuard], component: LocationsComponent },
  { path: 'routeMap/:id', canActivate: [IsLoggedInGuard], component: RouteMapComponent },
  { path: 'locationCamp/:id', canActivate: [IsLoggedInGuard], component: LocationCampComponent},
  { path: 'routeNew', canActivate: [IsLoggedInGuard], component: CreateRouteComponent },
  { path: 'routeEdit/:id', canActivate: [IsLoggedInGuard], component: RouteEditComponent },
  { path: 'createClient', canActivate: [IsLoggedInGuard], component: ClientEditComponent },
  { path: 'clientEdit/:id', canActivate: [IsLoggedInGuard], component: ClientEditComponent },
  { path: 'admin/reports', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminReportsComponent },
  { path: 'admin/reports/newClients', canActivate: [IsLoggedInGuard, IsAdminGuard], component: NewClientsReportComponent},
  { path: 'admin/reports/routeUndeliveredItems', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminRouteUndeliveredItemsComponent },
  { path: 'admin/reports/routeMeals', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminRouteMealsComponent },
  { path: 'admin/reports/routeUnfulfilledGoalsNextSteps', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminRouteUnfulfilledGoalsNextStepsComponent },
  { path: 'admin/reports/overallAttendance', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminOverallAttendanceComponent },
  { path: 'admin/reports/routeUnfulfilledPrayerRequestsNeeds', canActivate: [IsLoggedInGuard, IsAdminGuard],
          component: AdminRouteUnfulfilledPrayerRequestsNeedsComponent },
  { path: 'admin/reports/routeSummary', canActivate: [IsLoggedInGuard, IsAdminGuard], component: RouteSummaryReportComponent},
  { path: 'admin/reports/heatEquipmentPerRouteReport', canActivate: [IsLoggedInGuard, IsAdminGuard], component: HeatEquipmentPerRouteReportComponent},
  { path: 'admin/reports/seenServicedReport', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminSeenServicedReportComponent},
  { path: 'admin/reports/birthdayMonthsReport', canActivate: [IsLoggedInGuard, IsAdminGuard], component: BirthdayMonthsReportComponent},
  { path: 'admin/checkInAllHeaters', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminCheckInComponent},
  { path: 'admin/clientListing', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminClientListingComponent},
  { path: 'locationCampNew', canActivate: [IsLoggedInGuard], component: CreateLocationCampComponent },
  { path: 'serviceClient', canActivate: [IsLoggedInGuard], component: ServicingClientComponent },
  { path: 'adminHome', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminHomeComponent },
  { path: 'adminLogin', canActivate: [IsLoggedInGuard], component: AdminLoginComponent },
  { path: 'heaterNew', canActivate: [IsLoggedInGuard, IsAdminGuard], component: CreateHeatingUnitComponent },
  { path: 'admin/reports/heaterListing', canActivate: [IsLoggedInGuard, IsAdminGuard], component: AdminHeaterListingComponent },
  { path: 'volunteerInfo', canActivate: [IsLoggedInGuard], component: VolunteerInfoComponent },
  { path: 'application-login', component: MainLoginComponent},
  { path: 'changeRegularPassword', canActivate: [IsLoggedInGuard, IsAdminGuard], component: ChangeRegularPasswordComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [IsLoggedInGuard, IsAdminGuard]
})
export class AppRoutingModule {}
