import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RoutesComponent } from "./routes/routes.component";
import { LocationsComponent } from "./locations/locations.component";
import { RouteEditModalComponent } from "./routes/route-edit-modal/route-edit-modal.component";
import { ClientEditComponent } from "./client/client-edit/client-edit.component";
import { CreateRouteComponent } from "app/create-route/create-route.component";
import { CreateLocationCampComponent } from "./create-location-camp/create-location-camp.component";
import { LocationCampComponent } from "app/location-camp/location-camp.component";
import { ServicingClientComponent } from "app/client/servicing-client/servicing-client.component";
import { AdminHomeComponent } from "app/admin-home/admin-home.component";
import { AdminRouteMealsComponent } from "./admin-reports/admin-route-meals/admin-route-meals.component";
import { AdminRouteUndeliveredItemsComponent } from "./admin-reports/admin-route-undelivered-items/admin-route-undelivered-items.component";
import { AdminRouteUnfulfilledGoalsNextStepsComponent } from "./admin-reports/admin-route-unfulfilled-goals-next-steps/admin-route-unfulfilled-goals-next-steps.component";
import { AdminRouteUnfulfilledPrayerRequestsNeedsComponent } from "./admin-reports/admin-route-unfulfilled-prayer-requests-needs/admin-route-unfulfilled-prayer-requests-needs.component";
import { CreateHeatingUnitComponent } from "./create-heating-unit/create-heating-unit.component";
import { AdminHeaterListingComponent } from "./admin-heater-listing/admin-heater-listing.component";
import { LeaderSignInComponent } from "./leader-sign-in/leader-sign-in.component";
import { CheckoutHeatersComponent } from "./checkout-heaters/checkout-heaters.component";
import { VolunteerInfoComponent } from "./volunteer-info/volunteer-info.component";
import { AdminReportsComponent } from "./admin-reports/admin-reports.component";
import { NewClientsReportComponent } from "./admin-reports/new-clients-report/new-clients-report.component";
import { MainLoginComponent } from "./main-login/main-login.component";
import { IsLoggedInGuard, IsAdminGuard } from "app/guards/login.guard";
import { RouteMapComponent } from "./route-map/route-map.component";
import { RouteSummaryReportComponent } from "./admin-reports/route-summary-report/route-summary-report.component";
import { ChangeRegularPasswordComponent } from "app/change-regular-password/change-regular-password.component";
import { AdminCheckInComponent } from "./admin-check-in/admin-check-in.component";
import { AdminSeenServicedReportComponent } from "./admin-reports/admin-seen-serviced-report/admin-seen-serviced-report.component";
import { HeatEquipmentPerRouteReportComponent } from "./heat-equipment-per-route-report/heat-equipment-per-route-report.component";
import { AdminClientListingComponent } from "./admin-client-listing/admin-client-listing.component";
import { BirthdayMonthsReportComponent } from "./admin-reports/birthday-months-report/birthday-months-report.component";
import { AdminOverallAttendanceComponent } from "./admin-overall-attendance/admin-overall-attendance.component";
import { InventoryReportComponent } from "./admin-reports/inventory-report/inventory-report.component";
import { FirstTimeHomelessnessReportComponent } from "./admin-reports/first-time-homelessness-report/first-time-homelessness-report.component";
import { AdminCampListingComponent } from "./admin-camp-listing/admin-camp-listing.component";
import { AdminClientInactiveUpdaterComponent } from "./admin-client-inactive-updater/admin-client-inactive-updater.component";
import { AdminAddPetFoodUtilityComponent } from "./admin-add-pet-food-utility/admin-add-pet-food-utility.component";

const routes: Routes = [
  {
    path: "routes",
    canActivate: [IsLoggedInGuard],
    component: RoutesComponent,
  },
  {
    path: "login",
    canActivate: [IsLoggedInGuard],
    component: LeaderSignInComponent,
  },
  {
    path: "checkoutHeaters",
    canActivate: [IsLoggedInGuard],
    component: CheckoutHeatersComponent,
  },
  {
    path: "route/:id",
    canActivate: [IsLoggedInGuard],
    component: LocationsComponent,
  },
  {
    path: "routeMap/:id",
    canActivate: [IsLoggedInGuard],
    component: RouteMapComponent,
  },
  {
    path: "locationCamp/:id",
    canActivate: [IsLoggedInGuard],
    component: LocationCampComponent,
  },
  {
    path: "routeNew",
    canActivate: [IsLoggedInGuard],
    component: CreateRouteComponent,
  },
  {
    path: "createClient",
    canActivate: [IsLoggedInGuard],
    component: ClientEditComponent,
  },
  {
    path: "clientEdit/:id",
    canActivate: [IsLoggedInGuard],
    component: ClientEditComponent,
  },
  {
    path: "admin/reports",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminReportsComponent,
  },
  {
    path: "admin/reports/newClients",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: NewClientsReportComponent,
  },
  {
    path: "admin/reports/routeUndeliveredItems",
    canActivate: [IsLoggedInGuard],
    component: AdminRouteUndeliveredItemsComponent,
  },
  {
    path: "admin/reports/inventoryReport",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: InventoryReportComponent,
  },
  {
    path: "admin/reports/routeMeals",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminRouteMealsComponent,
  },
  {
    path: "admin/reports/routeUnfulfilledGoalsNextSteps",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminRouteUnfulfilledGoalsNextStepsComponent,
  },
  {
    path: "admin/reports/overallAttendance",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminOverallAttendanceComponent,
  },
  {
    path: "admin/reports/routeUnfulfilledPrayerRequestsNeeds",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminRouteUnfulfilledPrayerRequestsNeedsComponent,
  },
  {
    path: "admin/reports/routeSummary",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: RouteSummaryReportComponent,
  },
  {
    path: "admin/reports/heatEquipmentPerRouteReport",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: HeatEquipmentPerRouteReportComponent,
  },
  {
    path: "admin/reports/seenServicedReport",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminSeenServicedReportComponent,
  },
  {
    path: "admin/reports/birthdayMonthsReport",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: BirthdayMonthsReportComponent,
  },
  {
    path: "admin/reports/firstTimeHomelessnessReport",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: FirstTimeHomelessnessReportComponent,
  },
  {
    path: "admin/checkInAllHeaters",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminCheckInComponent,
  },
  {
    path: "admin/clientListing",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminClientListingComponent,
  },
  {
    path: "admin/inactiveUpdater",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminClientInactiveUpdaterComponent,
  },
  {
    path: "admin/petFoodAdder",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminAddPetFoodUtilityComponent,
  },
  {
    path: "admin/campListing",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminCampListingComponent,
  },
  {
    path: "locationCampNew",
    canActivate: [IsLoggedInGuard],
    component: CreateLocationCampComponent,
  },
  {
    path: "serviceClient",
    canActivate: [IsLoggedInGuard],
    component: ServicingClientComponent,
  },
  {
    path: "adminHome",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminHomeComponent,
  },
  {
    path: "heaterNew",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: CreateHeatingUnitComponent,
  },
  {
    path: "admin/reports/heaterListing",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: AdminHeaterListingComponent,
  },
  {
    path: "volunteerInfo",
    canActivate: [IsLoggedInGuard],
    component: VolunteerInfoComponent,
  },
  { path: "application-login", component: MainLoginComponent },
  {
    path: "changeRegularPassword",
    canActivate: [IsLoggedInGuard, IsAdminGuard],
    component: ChangeRegularPasswordComponent,
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [IsLoggedInGuard, IsAdminGuard],
})
export class AppRoutingModule {}
