import { Injectable }    from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
import { Route } from '../models/route';
import { Client } from '../models/client';
import { Location } from '../models/location';

import 'rxjs/add/operator/toPromise';

import { Store } from '@ngrx/store';
import { IMainStore } from '../state-management/main.store';

const theHeader = new HttpHeaders().set('Content-Type', 'application/json');

//adding a new comment
@Injectable()
export class MainService {
  online = true;
  private headers = new Headers({'Content-Type': 'application/json'});
  private baseUrl = 'api/';  // URL to web api
  private apiUrl = 'https://hidden-springs-63744.herokuapp.com/';

  constructor(private http: HttpClient, private store: Store<IMainStore>) { }
  getRoutes() {
    return this.http.get(this.baseUrl + `routes`)
        .map((response) => {
          console.log('results:');
          console.log(response);
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

  getClientsForRoute(id): Observable<Client[]>{
    if(this.online){
      console.log('getting clients for: ' + id);
      return this.http.get(this.apiUrl + `getClientsForLocation?locationId=${id}`)
      .map(res => {return res; })
      .catch(err => this.handleError(err));
    }
    else{
      return Observable.of([]);
    }
  }

  getRouteLocations(id): Observable<Location[]>{
    if(this.online){
      return this.http.get(this.apiUrl + `getRouteLocations?routeId=${id}`)
      .map(res => {return res; })
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