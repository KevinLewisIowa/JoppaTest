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

const theHeader = new HttpHeaders().set('Content-Type', 'application/json');

@Injectable()
export class MainService {
  online = true;
  private headers = new Headers({'Content-Type': 'application/json'});
  private baseUrl = 'api/';  // URL to web api
  // private apiUrl = 'https://hidden-springs-63744.herokuapp.com/';
  private apiUrl = 'https://joppa-api-test.herokuapp.com/';

  constructor(private http: HttpClient, private store: Store<IMainStore>) { }
  getRoutes() {
    return this.http.get(this.baseUrl + `routes`)
        .map((response) => {
          return response;
        })
        .catch(this.handleError);
  }

  getTheRoutes(): Observable<Route[]>{
    if(this.online){
      return this.http.get(this.apiUrl + `routes`)
        .map(res => res)
        .catch(err => this.handleError(err));
    }
    else{
      return this.http.get(this.baseUrl + `routes`)
               .map(response => response)
               .catch(this.handleError);
    }
  }

  insertRoute(theRoute: Route) {
    return this.http.post(this.apiUrl + `routes`, {route: theRoute}, {headers: theHeader})
        .map(res => res);
  }

  insertLocation(theLocation: Location) {
    return this.http.post(this.apiUrl + `locations`, {location: theLocation}, {headers: theHeader})
        .map(res => res)
        .catch(this.handleError);
  }

  insertRouteInstance(routeInstance: RouteInstance): any {
    return this.http.post(this.apiUrl + `route_instances`, {route_instance: routeInstance}, {headers: theHeader})
        .map(res => res)
        .catch(this.handleError);
  }

  insertLocationCamp(theLocationCamp: LocationCamp) {
    return this.http.post(this.apiUrl + `location_camps`, {location_camp: theLocationCamp}, {headers: theHeader})
        .map(res => res);
  }

  updateLocationCamp(theLocationCamp: LocationCamp) {
    return this.http.put(this.apiUrl + `location_camps/${theLocationCamp.id}`, {location_camp: theLocationCamp}, {headers: theHeader})
        .map(res => res).subscribe(response => { }, error => {console.log('error updating camp')});
  }

  updateLocation(theLocation: Location) {
    return this.http.put(this.apiUrl + `locations/${theLocation.id}`, {location: theLocation}, {headers: theHeader})
        .map(res => res).subscribe(response => { }, error => {console.log('error updating location')});
  }

  updateRouteInstance(theRouteInstance: RouteInstance) {
    return this.http.put(this.apiUrl + `route_instances/${theRouteInstance.id}`, {route_instance: theRouteInstance}, {headers: theHeader})
        .map(res => res).subscribe(response => { }, error => {console.log('error updating route instance')});;
  }

  insertHeater(theHeater: Heater) {
    return this.http.post(this.apiUrl + `heaters`, {heater: theHeater}, {headers: theHeader})
        .map(res => res);
  }

  getRoute(id) : Observable<Route>{
    if(this.online){
      return this.http.get(this.apiUrl + `routes/${id}`)
      .map(res => {return res; })
      .catch(err => this.handleError(err));
    }
    else{
      return Observable.of(new Route());
    }
  }

  getLocationCamps(id) {
    return this.http.get(this.apiUrl + `getCampsForLocation?locationId=${id}`)
              .map(res => {return res;}).catch(err => this.handleError(err));
  }

  getRouteInstance(id:number) {
    return this.http.get(this.apiUrl + `route_instances/${id}`)
      .map(res => {return res; })
      .catch(err => this.handleError(err));
  }

  getClientsForLocationCamp(id){
    if(this.online){
      return this.http.get(this.apiUrl + `getClientsForLocationCampC?locationCampId=${id}`)
      .map(res => {return res; })
      .catch(err => this.handleError(err));
    }
    else{
      return Observable.of([]);
    }
  }

  getRouteLocations(id): Observable<Location[]>{
    //if(this.online){
      return this.http.get(this.apiUrl + `locationsForRoute?routeId=${id}`)
      .map(res => {return res; })
      .catch(err => this.handleError(err));
    //}
    //else{
    //  return Observable.of([]);
    //}
  }

  getRouteLocation(id) {
    return this.http.get(this.apiUrl + `locations/${id}`)
          .map(res => res).catch(error => this.handleError(error));
  }

  getLocationCamp(id) {
    return this.http.get(this.apiUrl + `location_camps/${id}`)
        .map(res => res).catch(error => this.handleError(error));
  }

  getAdminRouteNumberMeals() {
    return this.http.get(this.apiUrl + `getAdminRouteNumberMeals`)
        .map(res => res).catch(error => this.handleError(error));
  }

  getAdminRouteUndeliveredItems() {
    return this.http.get(this.apiUrl + `getAdminRouteUndeliveredItems`)
        .map(res => res).catch(error => this.handleError(error));
  }

  getAdminRouteUnfulfilledGoalsNextSteps() {
    return this.http.get(this.apiUrl + `getAdminRouteUnfulfilledGoalsNextSteps`)
        .map(res => res).catch(error => this.handleError(error));
  }

  getAdminRouteUnfulfilledPrayerRequestsNeeds() {
    return this.http.get(this.apiUrl + `getAdminRouteUnfulfilledPrayerRequestsNeeds`)
        .map(res => res).catch(error => this.handleError(error));
  }

  getHeaterListing() {
    return this.http.get(this.apiUrl + `getHeaterListing`)
        .map(res => res).catch(error => this.handleError(error));
  }

  getHeaterTypes() {
    return this.http.get(this.apiUrl + `getHeaterTypes`)
      .map(res => res).catch(error => this.handleError(error));
  }

  getHeaterStatuses() {
    return this.http.get(this.apiUrl + `getHeaterStatuses`)
      .map(res => res).catch(error => this.handleError(error));
  }

  getAvailableHeaters() {
    return this.http.get(this.apiUrl + `getAvailableHeaters`)
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