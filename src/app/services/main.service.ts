import { Injectable }    from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Route } from '../models/route';
import { Client } from '../models/client';
import { Location } from '../models/location';
import { Heater } from '../models/heater';

import 'rxjs/add/operator/toPromise';

import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';
import { LocationCamp } from "app/models/location-camp";
import { RouteInstance } from '../models/route-instance';
import { RouteInstanceHeaterInteraction } from 'app/models/route-instance-heater-interaction';
import { and } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';


@Injectable()
export class MainService {
  theHeader = new HttpHeaders().set('Content-Type', 'application/json');
  online = true;
  private headers = new Headers({'Content-Type': 'application/json'});
  private baseUrl = 'api/';  // URL to web api
  // private apiUrl = 'https://hidden-springs-63744.herokuapp.com/';
  private apiUrl = 'https://joppa-api-test.herokuapp.com/';

  constructor(private http: HttpClient, private store: Store<IMainStore>, private router: Router) { }
  getRoutes() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.baseUrl + `routes`, {headers: this.theHeader})
        .map((response) => {
          return response;
        })
        .catch(this.handleError);
  }

  attemptLogin(thePassword) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `attemptLogin?passWrd=${thePassword}`,
                    {headers: this.theHeader}).map(response => { return response; });
  }

  getTheRoutes(): Observable<Route[]>{
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    if(this.online){
      return this.http.get(this.apiUrl + `routes`, {headers: this.theHeader})
        .map(res => res)
        .catch(err => this.handleError(err));
    } else {
      return this.http.get(this.baseUrl + `routes`, {headers: this.theHeader})
               .map(response => response)
               .catch(this.handleError);
    }
  }

  insertRoute(theRoute: Route) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.apiUrl + `routes`, {route: theRoute}, {headers: this.theHeader})
        .map(res => res);
  }

  insertLocation(theLocation: Location) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.apiUrl + `locations`, {location: theLocation}, {headers: this.theHeader})
      .map(res => res)
      .catch(this.handleError);
  }

  insertRouteInstance(routeInstance: RouteInstance): any {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.apiUrl + `route_instances`, {route_instance: routeInstance}, {headers: this.theHeader})
      .map(res => res)
      .catch(this.handleError);
  }

  insertLocationCamp(theLocationCamp: LocationCamp) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.apiUrl + `location_camps`, {location_camp: theLocationCamp}, {headers: this.theHeader})
      .map(res => res);
  }

  checkoutHeater(theRouteInstanceHeaterInteraction: RouteInstanceHeaterInteraction) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.apiUrl + `route_instance_heater_interactions`,
                {route_instance_heater_interaction: theRouteInstanceHeaterInteraction}, {headers: this.theHeader})
      .map(res => res);
  }

  updateLocationCamp(theLocationCamp: LocationCamp) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.put(this.apiUrl + `location_camps/${theLocationCamp.id}`, {location_camp: theLocationCamp}, {headers: this.theHeader})
        .map(res => res).subscribe(response => { }, error => {console.log('error updating camp')});
  }

  updateLocation(theLocation: Location) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.put(this.apiUrl + `locations/${theLocation.id}`, {location: theLocation}, {headers: this.theHeader})
        .map(res => res).subscribe(response => { }, error => {console.log('error updating location')});
  }

  updateRouteInstance(theRouteInstance: RouteInstance) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.patch(this.apiUrl + `route_instances/${theRouteInstance.id}`,
                    {route_instance: theRouteInstance}, {headers: this.theHeader})
        .map(res => res).subscribe(response => { }, error => {console.log(error)});;
  }

  updateRouteInstanceHeaterInteraction(theRouteInstanceHeaterInteraction: RouteInstanceHeaterInteraction) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.patch(this.apiUrl + `route_instance_heater_interactions/${theRouteInstanceHeaterInteraction.id}`,
            {route_instance_heater_interaction: theRouteInstanceHeaterInteraction}, {headers: this.theHeader})
      .map(res => res).subscribe(response => { }, error => console.log(error));
  }

  isHeaterCheckedOutOnOtherRoute(heaterId: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `isHeaterCheckedOutOnOtherRoute?heaterId=${heaterId}`, {headers: this.theHeader})
      .map(res => res);
  }

  insertHeater(theHeater: Heater) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.post(this.apiUrl + `heaters`, {heater: theHeater}, {headers: this.theHeader})
        .map(res => res);
  }

  getRoute(id) : Observable<Route>{
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    if(this.online){
      return this.http.get(this.apiUrl + `routes/${id}`, {headers: this.theHeader})
      .map(res => {return res; })
      .catch(err => this.handleError(err));
    }
    else{
      return Observable.of(new Route());
    }
  }

  getLocationCamps(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getCampsForLocation?locationId=${id}`, {headers: this.theHeader})
              .map(res => {return res;}).catch(err => this.handleError(err));
  }

  getRouteInstance(id:number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `route_instances/${id}`, {headers: this.theHeader})
      .map(res => {return res;})
      .catch(err => this.handleError(err));
  }

  getCheckedOutHeaters(id:number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getCheckedOutHeaters?routeInstanceId=${id}`, {headers: this.theHeader})
      .map(res => {return res;})
      .catch(err => this.handleError(err));
  }

  getClientsForLocationCamp(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    if (this.online) {
      return this.http.get(this.apiUrl + `getClientsForLocationCampC?locationCampId=${id}`, {headers: this.theHeader})
      .map(res => {return res; })
      .catch(err => this.handleError(err));
    } else {
      return Observable.of([]);
    }
  }

  getRouteLocations(id): Observable<Location[]> {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    //if(this.online){
      return this.http.get(this.apiUrl + `locationsForRoute?routeId=${id}`, {headers: this.theHeader})
      .map((res: any) => {
        console.log('returned route locations');
        console.log(res);
        if (res.message === 'invalid-token') {
          window.sessionStorage.removeItem('apiToken');
          this.router.navigate(['/application-login']);
        }
        return res;
      })
      .catch(err => this.handleError(err));
    //}
    //else{
    //  return Observable.of([]);
    //}
  }

  getRouteLocation(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `locations/${id}`, {headers: this.theHeader})
          .map(res => res).catch(error => this.handleError(error));
  }

  getLocationCamp(id) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `location_camps/${id}`, {headers: this.theHeader})
        .map(res => res).catch(error => this.handleError(error));
  }

  getAdminRouteNumberMeals() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getAdminRouteNumberMeals`, {headers: this.theHeader})
        .map(res => res).catch(error => this.handleError(error));
  }

  getAdminRouteUndeliveredItems() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getAdminRouteUndeliveredItems`, {headers: this.theHeader})
        .map(res => res).catch(error => this.handleError(error));
  }

  getAdminRouteUnfulfilledGoalsNextSteps() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getAdminRouteUnfulfilledGoalsNextSteps`, {headers: this.theHeader})
        .map(res => res).catch(error => this.handleError(error));
  }

  getAdminRouteUnfulfilledPrayerRequestsNeeds() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getAdminRouteUnfulfilledPrayerRequestsNeeds`, {headers: this.theHeader})
        .map(res => res).catch(error => this.handleError(error));
  }

  getHeaterListing() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getHeaterListing`, {headers: this.theHeader})
        .map(res => res).catch(error => this.handleError(error));
  }

  getHeaterTypes() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getHeaterTypes`, {headers: this.theHeader})
      .map(res => res).catch(error => this.handleError(error));
  }

  getHeaterStatuses() {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getHeaterStatuses`, {headers: this.theHeader})
      .map(res => res).catch(error => this.handleError(error));
  }

  getAvailableHeaters(routeInstanceId: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `getAvailableHeaters?routeInstanceId=${routeInstanceId}`, {headers: this.theHeader})
      .map(res => res).catch(error => this.handleError(error));
  }

  getRouteInstanceHeaterInteractions(): Observable<RouteInstanceHeaterInteraction[]> {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.get(this.apiUrl + `route_instance_heater_interactions`, {headers: this.theHeader})
      .map(res => res).catch(error => this.handleError(error));
  }

  removeRouteInstanceHeaterInteraction(id: number) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.delete(this.apiUrl + `route_instance_heater_interactions/${id}`, {headers: this.theHeader})
      .map(res => res).catch(error => this.handleError(error));
  }

  checkInHeater(theRouteInstanceHeaterInteraction: RouteInstanceHeaterInteraction) {
    this.theHeader.set('token', window.sessionStorage.getItem('apiToken'));
    return this.http.patch(this.apiUrl + `route_instance_heater_interactions/${theRouteInstanceHeaterInteraction.id}`,
                  {route_instance_heater_interaction: theRouteInstanceHeaterInteraction}, {headers: this.theHeader})
      .map(res => res).catch(error => this.handleError(error));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private mapLocations(data: Array<any>): Location[] {
    return data.map(item => 
      <Location>({
        id: item.id,
        route_id: item.route_id,
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
        notes: item.notes,
        position: item.position
      })
    );
  }
}



/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/