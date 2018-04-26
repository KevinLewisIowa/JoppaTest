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
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { LocationClientsComponent } from './location-clients/location-clients.component';
import { ClientComponent } from './client/client.component';
import { ClientEditComponent } from './client/client-edit/client-edit.component';
import { LocationDetailEditComponent } from './location-detail-edit/location-detail-edit.component';
import { RouteEditComponent } from './routes/route-edit/route-edit.component';
import { CreateRouteComponent } from './create-route/create-route.component';

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
    CreateRouteComponent
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
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
