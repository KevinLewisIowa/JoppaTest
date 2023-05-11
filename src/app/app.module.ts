import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { MainReducer } from "./state-management/main.reducer";
import { APIReducer } from "./state-management/error.reducer";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MatButtonModule } from "@angular/material/button";
import { MatNativeDateModule } from "@angular/material/core";
import {
  MatDatepicker,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { FooterComponent } from "./footer/footer.component";
import { RoutesComponent } from "./routes/routes.component";
import { LocationsComponent } from "./locations/locations.component";

import { AppRoutingModule } from "./app-routing.module";

import { MainService } from "./services/main.service";
import { ClientService } from "./services/client.service";
import { LocationClientsComponent } from "./location-clients/location-clients.component";
import { ClientComponent } from "./client/client.component";
import { ClientEditComponent } from "./client/client-edit/client-edit.component";
import { RouteEditModalComponent } from "./routes/route-edit-modal/route-edit-modal.component";
import { CreateRouteComponent } from "./create-route/create-route.component";
import { ClientSearchComponent } from "./client-search/client-search.component";
import { LocationCampComponent } from "./location-camp/location-camp.component";
import { CreateLocationCampComponent } from "./create-location-camp/create-location-camp.component";
import { ServicingClientComponent } from "./client/servicing-client/servicing-client.component";
import { RequestedItemComponent } from "./insert-modals/requested-item/requested-item.component";
import { HealthConcernComponent } from "./insert-modals/health-concern/health-concern.component";
import { ClientLikeComponent } from "./insert-modals/client-like/client-like.component";
import { ClientDislikeComponent } from "./insert-modals/client-dislike/client-dislike.component";
import { GoalsStepsComponent } from "./insert-modals/goals-steps/goals-steps.component";
import { AdminHomeComponent } from "./admin-home/admin-home.component";
import { AdminRouteMealsComponent } from "./admin-reports/admin-route-meals/admin-route-meals.component";
import { AdminRouteUndeliveredItemsComponent } from "./admin-reports/admin-route-undelivered-items/admin-route-undelivered-items.component";
import { AdminRouteUnfulfilledGoalsNextStepsComponent } from "./admin-reports/admin-route-unfulfilled-goals-next-steps/admin-route-unfulfilled-goals-next-steps.component";
import { AdminRouteUnfulfilledPrayerRequestsNeedsComponent } from "./admin-reports/admin-route-unfulfilled-prayer-requests-needs/admin-route-unfulfilled-prayer-requests-needs.component";
import { ClientEditModalComponent } from "./client/client-edit-modal/client-edit-modal.component";
import { CampEditModalComponent } from "./location-camp/camp-edit-modal/camp-edit-modal.component";
import { CreateHeatingUnitComponent } from "./create-heating-unit/create-heating-unit.component";
import { AdminHeaterListingComponent } from "./admin-heater-listing/admin-heater-listing.component";
import { LoanHeaterModalComponent } from "./insert-modals/loan-heater-modal/loan-heater-modal.component";
import { LeaderSignInComponent } from "./leader-sign-in/leader-sign-in.component";
import { CheckoutHeatersComponent } from "./checkout-heaters/checkout-heaters.component";
import { VolunteerInfoComponent } from "./volunteer-info/volunteer-info.component";
import { AdminReportsComponent } from "./admin-reports/admin-reports.component";
import { NewClientsReportComponent } from "./admin-reports/new-clients-report/new-clients-report.component";
import { ClientLocationModalComponent } from "./client-location-modal/client-location-modal.component";
import { MainLoginComponent } from "./main-login/main-login.component";
import { RouteMapComponent } from "./route-map/route-map.component";
import { NotesComponent } from "./insert-modals/notes/notes.component";
import { RouteSummaryReportComponent } from "./admin-reports/route-summary-report/route-summary-report.component";
import { ChangeRegularPasswordComponent } from "./change-regular-password/change-regular-password.component";
import { AdminCheckInComponent } from "./admin-check-in/admin-check-in.component";
import { AdminSeenServicedReportComponent } from "./admin-reports/admin-seen-serviced-report/admin-seen-serviced-report.component";
import { HeatEquipmentPerRouteReportComponent } from "./heat-equipment-per-route-report/heat-equipment-per-route-report.component";
import { AdminClientListingComponent } from "./admin-client-listing/admin-client-listing.component";
import { PetsComponent } from "./insert-modals/pets/pets.component";
import { TentComponent } from "./insert-modals/tents/tent.component";
import { CampNotesComponent } from "./insert-modals/camp-notes/camp-notes.component";
import { ReferralsResourcesComponent } from "./insert-modals/referrals-resources/referrals-resources.component";
import { BirthdayMonthsReportComponent } from "./admin-reports/birthday-months-report/birthday-months-report.component";
import { AdminOverallAttendanceComponent } from "./admin-overall-attendance/admin-overall-attendance.component";
import { InventoryReportComponent } from "./admin-reports/inventory-report/inventory-report.component";
import { PrayerRequestsAndNeedsComponent } from "./insert-modals/prayer-requests-and-needs/prayer-requests-and-needs.component";
import { FirstTimeHomelessnessReportComponent } from "./admin-reports/first-time-homelessness-report/first-time-homelessness-report.component";
import { CustomConfirmationDialogComponent } from "./custom-confirmation-dialog/custom-confirmation-dialog.component";
import { AdminCampListingComponent } from "./admin-camp-listing/admin-camp-listing.component";
import { AdminClientInactiveUpdaterComponent } from "./admin-client-inactive-updater/admin-client-inactive-updater.component";
import { DateSelectorComponent } from "./insert-modals/date-selector/date-selector.component";
import { ClientDwellingComponent } from "./insert-modals/client-dwelling/client-dwelling.component";
import { AdminAddPetFoodUtilityComponent } from './admin-add-pet-food-utility/admin-add-pet-food-utility.component';

const reducers = {
  user: MainReducer,
  api: APIReducer,
};

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    RoutesComponent,
    LocationsComponent,
    LocationClientsComponent,
    ClientComponent,
    ClientEditComponent,
    RouteEditModalComponent,
    CreateRouteComponent,
    ClientSearchComponent,
    LocationCampComponent,
    CreateLocationCampComponent,
    CampNotesComponent,
    ClientDwellingComponent,
    ServicingClientComponent,
    RequestedItemComponent,
    HealthConcernComponent,
    ClientLikeComponent,
    ClientDislikeComponent,
    GoalsStepsComponent,
    AdminHomeComponent,
    AdminRouteMealsComponent,
    AdminRouteUndeliveredItemsComponent,
    AdminRouteUnfulfilledGoalsNextStepsComponent,
    AdminRouteUnfulfilledPrayerRequestsNeedsComponent,
    ClientEditModalComponent,
    CampEditModalComponent,
    CreateHeatingUnitComponent,
    AdminHeaterListingComponent,
    LoanHeaterModalComponent,
    LeaderSignInComponent,
    CheckoutHeatersComponent,
    VolunteerInfoComponent,
    AdminReportsComponent,
    NewClientsReportComponent,
    ClientLocationModalComponent,
    MainLoginComponent,
    RouteMapComponent,
    NotesComponent,
    RouteSummaryReportComponent,
    ChangeRegularPasswordComponent,
    AdminCheckInComponent,
    AdminSeenServicedReportComponent,
    HeatEquipmentPerRouteReportComponent,
    AdminClientListingComponent,
    PetsComponent,
    ReferralsResourcesComponent,
    BirthdayMonthsReportComponent,
    AdminOverallAttendanceComponent,
    InventoryReportComponent,
    PrayerRequestsAndNeedsComponent,
    FirstTimeHomelessnessReportComponent,
    CustomConfirmationDialogComponent,
    AdminCampListingComponent,
    AdminClientInactiveUpdaterComponent,
    TentComponent,
    DateSelectorComponent,
    AdminAddPetFoodUtilityComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FontAwesomeModule,
    AppRoutingModule,
  ],
  providers: [MainService, ClientService],
  bootstrap: [AppComponent],
  entryComponents: [CustomConfirmationDialogComponent, DateSelectorComponent],
})
export class AppModule {}
