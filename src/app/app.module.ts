import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MainReducer } from './state-management/main.reducer';
import { APIReducer } from './state-management/error.reducer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RoutesComponent } from './routes/routes.component';
import { LocationsComponent } from './locations/locations.component';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';

import { MainService } from './services/main.service';
import { ClientService } from './services/client.service';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { LocationClientsComponent } from './location-clients/location-clients.component';
import { ClientComponent } from './client/client.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { LocationDetailEditComponent } from './location-detail-edit/location-detail-edit.component';
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
import { AdminRouteMealsComponent } from './admin-route-meals/admin-route-meals.component';
import { AdminRouteUndeliveredItemsComponent } from './admin-route-undelivered-items/admin-route-undelivered-items.component';
import { AdminRouteUnfulfilledGoalsNextStepsComponent } from './admin-route-unfulfilled-goals-next-steps/admin-route-unfulfilled-goals-next-steps.component';
import { AdminRouteUnfulfilledPrayerRequestsNeedsComponent } from './admin-route-unfulfilled-prayer-requests-needs/admin-route-unfulfilled-prayer-requests-needs.component';
import { ClientEditModalComponent } from './client/client-edit-modal/client-edit-modal.component';

const reducers = {
  user: MainReducer,
  api: APIReducer
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    RoutesComponent,
    LocationsComponent,
    LocationDetailComponent,
    LocationClientsComponent,
    ClientComponent,
    ClientEditComponent,
    LocationDetailEditComponent,
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
    ClientEditModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    HttpClientModule,
    //InMemoryWebApiModule.forRoot(InMemoryDataService),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument(),
    AppRoutingModule
  ],
  providers: [MainService, ClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
