import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Route } from '../models/route';
import { Client } from '../models/client';
import { Location } from '../models/location';

import 'rxjs/add/operator/toPromise';

import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';

@Injectable()
export class MainService {
  online = true;
  private headers = new Headers({'Content-Type': 'application/json'});
  private baseUrl = 'api/';  // URL to web api
  private apiUrl = 'https://kevinlewisiowa.com/JoppaTest/';

  constructor(private http: Http, private store: Store<IMainStore>) { }
  getRoutes() {
    return this.http.get(this.baseUrl + `routes`)
        .map((response) => {
          console.log('results:');
          console.log(response);
          response.json();
        })
        .catch(this.handleError);
  }
  getTheRoutes(): Observable<Route[]>{
    if(this.online){
      return this.http.get(this.apiUrl + `GetRoutes.php`)
        .map(res => res.json())
        .catch(err => this.handleError(err));
    }
    else{
      return this.http.get(this.baseUrl + `routes`)
               .map(response => response.json().data as Route[])
               .catch(this.handleError);
    }
  }

  getRoute(id) : Observable<Route>{
    if(this.online){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.apiUrl + `GetRoute.php?routeId=${id}`)
      .map(res => {return res.json()[0]; })
      .catch(err => this.handleError(err));
    }
    else{
      return Observable.of(new Route());
    }
  }

  getClientsForRoute(id): Observable<Client[]>{
    if(this.online){
      console.log('getting clients for: ' + id);
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.apiUrl + `GetClientsForLocation.php?locationId=${id}`)
      .map(res => {return res.json(); })
      .catch(err => this.handleError(err));
    }
    else{
      return Observable.of([]);
    }
  }

  getRouteLocations(id): Observable<Location[]>{
    if(this.online){
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.get(this.apiUrl + `GetRouteLocations.php?routeId=${id}`)
      .map(res => {return res.json(); })
      .catch(err => this.handleError(err));
    }
    else{
      return Observable.of([]);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private mapLocations(data: Array<any>): Location[] {
    return data.map(item => 
      <Location>({
        RouteLocationId: item.RouteLocationId,
        RouteId: item.RouteId,
        Name: item.Name,
        Address: item.Address,
        Latitude: item.Latitude,
        Longitude: item.Longitude,
        LocationDetails: item.LocationDetails,
        TargetArrivalTime: item.TargetArrivalTime,
        DriveTimeMinutes: item.DriveTimeMinutes,
        VisitTimeMinutes: item.VisitTimeMinutes,
        ParkingLatitude: item.ParkingLatitude,
        ParkingLongitude: item.ParkingLongitude,
        Position: item.Position
      })
    );
  }
}



/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/