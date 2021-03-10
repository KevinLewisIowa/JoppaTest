import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MainReducer } from './state-management/main.reducer';
import { APIReducer } from './state-management/error.reducer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InlineSVGModule} from 'ng-inline-svg';

import { MatPaginatorModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSortModule, MatDatepicker, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatDialogModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RoutesComponent } from './routes/routes.component';
import { LocationsComponent } from './locations/locations.component';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';

import { MainService } from './services/main.service';
import { ClientService } from './services/client.service';
import { LocationClientsComponent } from './location-clients/location-clients.component';
import { ClientComponent } from './client/client.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { RouteEditComponent } from './routes/route-edit/route-edit.component';
import { CreateRouteComponent } from './create-route/create-route.component';
import { ClientSearchComponent } from './client-search/client-search.component';
import { LocationCampComponent } from './location-camp/location-camp.component';
import { CreateLocationCampComponent } from './create-location-camp/create-location-camp.component';
import { ServicingClientComponent } from './client/servicing-client/servicing-client.component';
import { RequestedItemComponent } from './insert-modals/requested-item/requested-item.component';
import { HealthConcernComponent } from './insert-modals/health-concern/health-concern.component';
import { ClientLikeComponent } from './insert-modals/client-like/client-like.component';
import { ClientDislikeComponent } from './insert-modals/client-dislike/client-dislike.component';
import { GoalsStepsComponent } from './insert-modals/goals-steps/goals-steps.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRouteMealsComponent } from './admin-reports/admin-route-meals/admin-route-meals.component';
import { AdminRouteUndeliveredItemsComponent } from './admin-reports/admin-route-undelivered-items/admin-route-undelivered-items.component';
import { AdminRouteUnfulfilledGoalsNextStepsComponent } from './admin-reports/admin-route-unfulfilled-goals-next-steps/admin-route-unfulfilled-goals-next-steps.component';
import { AdminRouteUnfulfilledPrayerRequestsNeedsComponent } from './admin-reports/admin-route-unfulfilled-prayer-requests-needs/admin-route-unfulfilled-prayer-requests-needs.component';
import { ClientEditModalComponent } from './client/client-edit-modal/client-edit-modal.component';
import { CampEditModalComponent } from './location-camp/camp-edit-modal/camp-edit-modal.component';
import { CreateHeatingUnitComponent } from './create-heating-unit/create-heating-unit.component';
import { AdminHeaterListingComponent } from './admin-heater-listing/admin-heater-listing.component';
import { LoanHeaterModalComponent } from './insert-modals/loan-heater-modal/loan-heater-modal.component';
import { LeaderSignInComponent } from './leader-sign-in/leader-sign-in.component';
import { CheckoutHeatersComponent } from './checkout-heaters/checkout-heaters.component';
import { VolunteerInfoComponent } from './volunteer-info/volunteer-info.component';
import { AdminReportsComponent } from './admin-reports/admin-reports.component';
import { NewClientsReportComponent } from './admin-reports/new-clients-report/new-clients-report.component';
import { ClientLocationModalComponent } from './client-location-modal/client-location-modal.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { MainLoginComponent } from './main-login/main-login.component';
import { RouteMapComponent } from './route-map/route-map.component';
import { NotesComponent } from './insert-modals/notes/notes.component';
import { RouteSummaryReportComponent } from './admin-reports/route-summary-report/route-summary-report.component';
import { ChangeRegularPasswordComponent } from './change-regular-password/change-regular-password.component';
import { AdminCheckInComponent } from './admin-check-in/admin-check-in.component';
import { AdminSeenServicedReportComponent } from './admin-reports/admin-seen-serviced-report/admin-seen-serviced-report.component';
import { HeatEquipmentPerRouteReportComponent } from './heat-equipment-per-route-report/heat-equipment-per-route-report.component';
import { AdminClientListingComponent } from './admin-client-listing/admin-client-listing.component';
import { PetsComponent } from './insert-modals/pets/pets.component';
import { BirthdayMonthsReportComponent } from './admin-reports/birthday-months-report/birthday-months-report.component';
import { AdminOverallAttendanceComponent } from './admin-overall-attendance/admin-overall-attendance.component';
import { InventoryReportComponent } from './admin-reports/inventory-report/inventory-report.component';
import { PrayerRequestsAndNeedsComponent } from './insert-modals/prayer-requests-and-needs/prayer-requests-and-needs.component';
import { FirstTimeHomelessnessReportComponent } from './admin-reports/first-time-homelessness-report/first-time-homelessness-report.component';
import { CustomConfirmationDialogComponent } from './custom-confirmation-dialog/custom-confirmation-dialog.component';
import { AdminCampListingComponent } from './admin-camp-listing/admin-camp-listing.component';
import { AdminClientInactiveUpdaterComponent } from './admin-client-inactive-updater/admin-client-inactive-updater.component';

const reducers = {
  user: MainReducer,
  api: APIReducer
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RoutesComponent,
    LocationsComponent,
    LocationClientsComponent,
    ClientComponent,
    ClientEditComponent,
    RouteEditComponent,
    CreateRouteComponent,
    ClientSearchComponent,
    LocationCampComponent,
    CreateLocationCampComponent,
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
    AdminLoginComponent,
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
    BirthdayMonthsReportComponent,
    AdminOverallAttendanceComponent,
    InventoryReportComponent,
    PrayerRequestsAndNeedsComponent,
    FirstTimeHomelessnessReportComponent,
    CustomConfirmationDialogComponent,
    AdminCampListingComponent,
    AdminClientInactiveUpdaterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
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
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument(),
    AppRoutingModule,
    InlineSVGModule.forRoot({baseUrl:'https://dev.w3.org/SVG/tools/svgweb/samples/svg-files'})
  ],
  providers: [MainService, ClientService],
  bootstrap: [AppComponent],
  entryComponents: [CustomConfirmationDialogComponent]
})
export class AppModule {}
